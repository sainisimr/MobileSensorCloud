var ejs = require("ejs");
var mysql = require('./mysql');

exports.sensorowner = function(req,res){
	//var sensortype = req.param("sensortype");
	var query = "select * from userinformation where type= 'vendor'";		
	console.log("Return Home Query is:"+query);
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			if (results.length > 0) {
				
				console.log("getusers names");
				console.log(JSON.stringify( results));
				//res.end(JSON.stringify(results));	
				ejs.renderFile('./views/sensorowner.ejs',{data:results},function(err,result)
				{
					if(!err)
						{
							res.end(result);
						}
					else
						{
						res.end('An error occured');
						console.log(err);
						}
				});
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

	
	


/*
exports.addsensor = function(req,res){
	
	var name = req.body.name;
	var location = req.body.location;
	var type = req.body.type;
	
	
	var query = "INSERT INTO sensors (email, sensorname, sensorlocation, sensortype) VALUES ('" + req.session.email + "','" + name + "','" + location + "','" + type + "')";									
	
	
	mysql.fetchData(function(err, results){
		console.log("in fetch data");
		if (err) {
			throw err;
		} 
		else {
			
			console.log("data inserted");
			res.end();
			if (results.length > 0) {
				console.log("data inserted in IF");
				res.end();				
			}			
		}
	}, query);	
};


exports.editsensor = function(req,res){
	
	
	console.log("edited sensor data : " + JSON.stringify(req.body.sensorlocation));
	
	var query = "UPDATE sensors SET sensorname = '" + req.body.sensorname + "', sensorlocation = '" + req.body.sensorlocation + "', sensortype = '" + req.body.sensortype + "' where email = '" + req.session.email + "' and sensorid = '" + req.body.sensorid + "'";
	
	mysql.fetchData(function(err, results){
		console.log("in fetch data");
		if (err) {
			throw err;
		} 
		else {
			
			console.log("SENSOR UPDATED");
			res.end();
			if (results.length > 0) {
				console.log("SENSOR UPDATED in IF");
				res.end();				
			}			
		}
		
	}, query);	
};



exports.removesensor = function(req,res){
	
	var sensorid = req.body.sensorid;
	
	var query = "Delete from sensors where email = '" + req.session.email + "' and sensorid = '" + sensorid +"'";									
	
	console.log(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body.sensorid));

	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("sensor deleted inserted");
			res.end();
			if (results.length > 0) {
				console.log("data inserted");
				res.end();				
			}			
		}
		
	}, query);	
};



exports.updatesensor = function(req,res){
	
	var email = req.param("email");
	var name = req.param("name");
	var password = req.param("password");
	var mobile = req.param("mobile");
	
	
	var query = "INSERT INTO userinfo (email, name, password, mobile) VALUES ('" + email + "','" + name + "','" + password + "','" + mobile + "')";									
	
	
	mysql.fetchData(function(err, results){
		console.log("in fetch data");
		if (err) {
			throw err;
		} 
		else {
			
			console.log("data inserted");
			if (results.length > 0) {
				console.log("data inserted");
				res.end();				
			}			
		}
		
	}, query);	
};


exports.getsensors = function(req,res){
	
	
	var query = "Select * from sensors where email = '" + req.session.email + "'";									
	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else{
			
			if (results.length > 0) {
				
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};

*/




