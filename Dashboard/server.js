//Imported modules
var https = require("https");
var http = require("http");
var url = require("url");
var fs = require('fs');
var node_static = require('node-static');
var AWS = require('aws-sdk');
var randomKey = require('key-forge').randomKey;
var twilio = require('twilio');
var config = require('./config/config');

var client = new twilio.RestClient(config.accountSid, config.authToken);
options = {
  key: fs.readFileSync('./pemfiles/private-key.pem'),
  cert: fs.readFileSync('./pemfiles/certificate.pem')
}

var file_server = new node_static.Server('./public');

var UserSessions = [];

var key_size = 32;




function GenerateToken()
{
  var temp_token = randomKey(key_size);

  // Ensure this token is unique.
  var is_unique = false;
  while (is_unique == false)
  {
    is_unique = true;

    for (var i = 0; i < UserSessions.length; i++)
    {
      if (UserSessions[i].token == temp_token)
      {
        // Against long odds, this key is a repeat of one already stored.  Try again.
        temp_token = randomKey(key_size);
        is_unique = false;
        break;
      }
    }
  }

  //TODO : We can extend the token time from here - 
  // Next, we set an expiration for this token, one day from now.
  d = new Date();
  expiration = d.getTime();
  expiration += 24 * 60 * 60 * 1000;

  return {
    token: temp_token,
    expiration: expiration
  };
}

/**
 * Function to check for unsecured HTTP connection
 * If request comes it reroutes them to http port
 * @param request
 * @param response
 * @constructor
 */
function OnUnsecuredRequest(request, response) {
  // Direct to the same pathname on port 443 for an https connection.
  var host = request.headers.host;
  var path = url.parse(request.url).pathname;
  var new_url = "https://" + host + path;

  response.writeHead(301,
      {"Location" : new_url }
  );
  response.end();
}


/**
 * // This is the function to control the Server's response control - GET and POST
 * @param request
 * @param response
 * @constructor
 */

function OnRequest(request, response) {
  // First, we sort requests based on the HTTP verb that's used.
  if (request.method == "GET")
  {
    getRequests(request, response);
  }
  else if (request.method == "POST")
  {
    // Data is being passed to the server.  This is where the calls for Amazon data go.
    postRequests(request, response)
  }
  else
  {
    // This verb is not supported on this server.  Respond with a "Bad Request" error.
    response.writeHead(400);
    response.write("Bad Request.  This HTTP verb is currently not supported.");
    response.end();
  }
}


/**
 * Function for managing GET HTTP request
 * @param request
 * @param response
 */
function getRequests(request, response)
{
  var pathname = url.parse(request.url).pathname;

  if (pathname == "/")
  {
    file_server.serveFile("./views/home.html", 200, {}, request, response);
  }

  	request.addListener('end', function(){
    file_server.serve(request, response, function (error, result) {
      if (error)
      {
    	  
      }
    });

  }).resume();
}


/**
 * Function for POST HTTP Request
 * @param request
 * @param response
 */
function postRequests(request, response)
{
  var pathname = url.parse(request.url).pathname;

  //TODO :: Runs Before the PULL Metrics has been placed - IMP IMP
  if (pathname == "/login")
  {
    // Amazon AWS credentials are sent to the server.  We need to associate them with a User token
    // and store the credentials here, where they are safe.
    // Pull the data from the request.
    request.setEncoding('utf8')
    request.on('data', function(chunk) {

      var creds = chunk.split(",");
      AWS.config = {
        
        region: 'us-west-2',
        sslEnabled: true
      }

      // This is a new User, so we need to create a new token using the 'key-forge' module.
      var generated_token = GenerateToken();

      // Handle for Amazon Elastic Compute Cloud:
      var ec2 = new AWS.EC2();


      ec2.describeInstances({}, function(error, data) {

        if (error)
        {
          // Send error response to browser.
          response.writeHead(502);
          response.write(error.message);
          response.end();
        }
        else
        {


          var instance_list = "";
          var match_list = "";

          for (var i = 0; i < data.Reservations.length; i++)
          {
            for (var j = 0; j < data.Reservations[i].Instances.length; j++)
            {
              instance_list += data.Reservations[i].Instances[j].InstanceId;

              for (var k = 0; k < data.Reservations[i].Instances[j].Tags.length; k++)
              {
                match_list += data.Reservations[i].Instances[j].Tags[k].Key +
                    ": " + data.Reservations[i].Instances[j].Tags[k].Value;

                if (k != data.Reservations[i].Instances[j].Tags.length - 1)
                {
                  match_list += ",";
                }
              }

              if (j != data.Reservations[i].Instances.length - 1)
              {
                instance_list += ",";
                match_list += ";";
              }
            }

            if (i != data.Reservations.length - 1)
            {
              instance_list += ",";
              match_list += ";";
            }
          }


          // Now, request Amazon for the tags.
          ec2.describeTags({}, function(error, data) {

            if (error)
            {
              // Send error response to browser.
              response.writeHead(502);
              response.write(error.message);
              response.end();
            }
            else
            {
              var tag_list = "";

              for (var i = 0; i < data.Tags.length; i++)
              {
                tag_list += data.Tags[i].Key + ": " + data.Tags[i].Value

                if (i != data.Tags.length - 1)
                {
                  tag_list += ",";
                }
              }


              //TODO: Sending a reply to client
              temp = {
                token: generated_token.token,
                expiration: generated_token.expiration,
                credentials: AWS.config
              };
              UserSessions.push(temp);

              var response_string = generated_token.token + ";" + instance_list + ";" + tag_list + ";" + match_list;
              console.log("**************************************************************************");
              console.log("@@@@@ Credential response_string -> " + response_string);
              console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
              console.log("@@@@@ generated_token "+generated_token.token);
              console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
              console.log("@@@@@ instance_list "+instance_list);
              console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
              console.log("@@@@@ tag_list "+tag_list);
              console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
              console.log("@@@@@ match_list "+match_list);
              console.log("**************************************************************************");

              // Return this string to the browser.
              response.writeHead(200);
              response.write(response_string);
              response.end();

            }

          });

        }

      });

    });
  }
  
  else if (pathname == "/pull_metrics")
  {
    // This function queries Amazon for time-sequenced data from the User's services.

    request.setEncoding('utf8')
    request.on('data', function(chunk) {

      var mini_chunks = chunk.split(";");
      var token = mini_chunks[0];
      var time = mini_chunks[1].split(",");

      var token_found = false;
      for (var i = 0; i < UserSessions.length; i++)
      {
        if (UserSessions[i].token == token)
        {
          // The User Token has been found.
          token_found = true;

          // Load the stored credentials into the AWS module.
          AWS.config = UserSessions[i].credentials

          break;
        }
      }

      if (token_found == false)
      {
        // We refuse this request. Send response to browser.
        response.writeHead(401);
        response.write("Access Denied:  Security clearance has expired or is invalid.");
        response.end();
        return;
      }

      //TODO: Cloudwatch handle has been created here to pull data
      var cloudwatch = new AWS.CloudWatch();
      var namespace;
      if(String(mini_chunks[3])=="MemoryUtilization"){
        namespace = "System/Linux"
      }
      else{
        namespace = "AWS/EC2"
      }

      var params = {
        StartTime: String(time[0]),
        EndTime: String(time[1]),
        Period: String(time[2]),
        Namespace: namespace,
        MetricName: String(mini_chunks[3]),
        Statistics: ['Average'],
        Dimensions: [
          {
            Name: 'InstanceId',
            Value: String(mini_chunks[2])
          }
        ]
      };

      // Make the request to Amazon.
      //TODO: getMetricStatistics API call from here
      cloudwatch.getMetricStatistics(params, function(error, data){
        if (error)
        {
          // Send error response to browser.
          response.writeHead(502);
          response.write(error.message);
          response.end();
        }
        else
        {
          var message = "";

          for (var i = 0; i < data.Datapoints.length; i++)
          {
            message += data.Datapoints[i].Timestamp + "," + data.Datapoints[i].Average;

            if ((data.Datapoints[i].Average > config.memoryThreshold && data.Datapoints[i].Unit=='Percent'&& mini_chunks[3] =="MemoryUtilization" ) || (data.Datapoints[i].Average > config.cpuThreshold && data.Datapoints[i].Unit=='Percent'&& mini_chunks[3] =="CPUUtilization" )) {
              // console.log("memory thresh "+ config.memoryThreshold );
              client.messages.create({
                to:"6692385981",
                from: "+12244073238",
                body:'Hello Sir, Your ' + String(mini_chunks[3]) +' for Instance ID: ' + mini_chunks[2] + ' has gone above threshold at ' + mini_chunks[1] + ' Thanks, Jarvis'
              }, function(error, message) {
                if (error) {
                  console.log(error.message);
                }
              });

            }

            if (i < data.Datapoints.length - 1)
            {
              message += ";"
            }
          }

          response.writeHead(200);
          response.write(message);
          response.end();

        }
      });
    });
  }


}


/**
 // This function keeps the array "UserSessions" clean.  Tokens are given a 24 hour lifetime,
 // partially for security and partially to keep storage needs to minimum.
 */

function ClearExpiredTokens()
{
  d = new Date();
  //variable without var means it's a global variable
  current_time = d.getTime();

  // Cycle through the tokens and prune any that have expired.
  var total_cycles = UserSessions.length;
  var adjustment = 0;

  for (var i = 0; i < total_cycles; i++)
  {
    if (UserSessions[i + adjustment].expiration < current_time)
    {
      UserSessions.splice(i + adjustment, 1);

      // Be careful.  Since we deleted an element in this array, we need to adjust the
      // index we use to target the next element.
      adjustment--;
    }
  }

  callback = function() {
    ClearExpiredTokens();
  };

  prune_id = setTimeout(callback, 60 * 60 * 1000);
}



https.createServer(options, OnRequest).listen(443);

http.createServer(OnUnsecuredRequest).listen(80);

console.log("Secure HTTPS server running on port 443");
ClearExpiredTokens();
