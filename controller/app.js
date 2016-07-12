
/**
 * Module dependencies.
 */
  buffer = [];
  var onclick = require('./routes/onclick');
  var mongoose = require('mongoose');
  var express = require('express')
  , routes = require('./routes')
  , vendor = require('./routes/vendor')
  , http = require('http')
  , path = require('path');

var app = express();
activesensors= ["1011","1013","1016"];

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat', duration: 30 * 60 * 1000}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


// development only
if ('development', function() {
  app.use(express.errorHandler());
});
//var dbHost = 'mongodb://localhost/meanapp'
var dbHost = 'mongodb://52.32.254.215:27017/sensordata';
mongoose.connect(dbHost);

setInterval(vendor.read1, 15 * 1000);
app.get('/', routes.index);
app.get('/onclick',onclick.checkbutton);
app.get('/togglesensor',vendor.togglesensor);


//app.get('/vendor', vendor.read);
//////////////////////////////////////////////////////////////////////////////////


app.post('/vendor', function(req,res) {
    var arr1 = req.body;
    
    var flag = 0;
    
    for(var i = 0; i < activesensors.length; i++)
   	 if(arr1.Sensor_Id === activesensors[i])
   		 	{flag = 1; break;}
   	 
    if(flag == 1){
    	
    
    	arr1.timeStamp = new Date().getTime();
    	buffer.push(arr1); 
    	console.log("done");
    	res.send("Done ");
    }
     if(flag == 0) {
    	 res.send("Not allowed");
     }
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



