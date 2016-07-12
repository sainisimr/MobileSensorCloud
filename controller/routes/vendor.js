var mysql = require('./mysql');
var ejs = require('ejs');
//var mongoURL = "mongodb://localhost:27017/mobilesensorcloud";
exports.togglesensor = function(req,res){
	var id = req.param('id');
	var vendor = require('./vendor');
	console.log(id);
	var query = "select status from sensors where sensorid=" + id;	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			    //console.log(results);
			    //result = c.status;
			    var c = results.pop();
			    console.log(c.status);
			    result = c.status;
			    var newstate;
				if(result === 'active')
					newstate = "inactive";
				if(result === 'inactive')
					newstate = "active";
				var qr = "update sensors set status ='"+ newstate +"' where sensorid =" +id;
				console.log(qr);
				mysql.fetchData(function(err, ress){
					if (err) {
						throw err;
					} 
					else 
					{
							   if(newstate === "active")
								   activesensors.push(id);
							   else
								   if(newstate === "inactive")
									   for(var i = 0; i < activesensors.length; i++)
										   if(id === activesensors[i])
											   activesensors.splice(i,1);
						(vendor.statusofsensors(req,res));
					}
					},qr);
			}
	}, query);
	
};

exports.statusofsensors = function(req,res){
		var query = "select status,sensorid from sensors";	
		mysql.fetchData(function(err, results){
			
			if (err) {
				throw err;
			} 
			else {
				
				console.log("sensor are " + JSON.stringify(results));
				if (results.length > 0) {
					ejs.renderFile('./views/sensorstatus.ejs',{data:results},function(err,result)
                         {
								if(!err)
									{
										res.end(result);
									}
								else
									{
									
									console.log(err);
									}
							});
					console.log("sensors in IF");
									
				}	
				else
				{
				console.log("Invalid login");
				ejs.renderFile('./views/failure.ejs',function(err,result)
				{
					if(!err)
						{
							res.end(result);
						}
					else
						{
							res.end('An error occured');
							console.log('An error occured');
						}
				});
				}
			}
			
		}, query);	
};
exports.controllerinformation = function(req,res){
	var query = "select * from controllerinformations where controllerid_primarykey in (select controllerinformation_controllerid_primarykey from sensors  )";	
	mysql.fetchData(function(err, results){
	if (err) {
			throw err;
		} 
		else {
			
			console.log("sensor are " + JSON.stringify(results));
			if (results.length > 0) {
				ejs.renderFile('./views/controllerinformation.ejs',{data:results},function(err,result)
                     {
							if(!err)
								{
									res.end(result);
								}
							else
								{
								
								console.log(err);
								}
						});
				console.log("sensors in IF");
								
			}
			else
			{
			console.log("Invalid login");
			ejs.renderFile('./views/failure.ejs',function(err,result)
			{
				if(!err)
					{
						res.end(result);
					}
				else
					{
						res.end('An error occured');
						console.log('An error occured');
					}
			});
			}
		}
	}, query);	


};

exports.read1 = function() {
for(var i = 0; i < buffer.length; i++) {
     var val = buffer.shift();
     var User = require('./usermodel');
     

    var record = new User({
    Sensor_Id: val.Sensor_Id,
    Location : val.Location,
    Latitude: val.Latitude,
    Longitude: val.Longitude,
    PPM: val.PPM ,
    Ozone: val.Ozone,
    N2O :val.N2O,
    SO2: val.SO2,
    CO: val.CO,
    timeStamp: val.timeStamp  

  });

record.save(function (err) {
if (err) console.log(err);
else console.log("Record inserted successfully");
});

} 
         
};


