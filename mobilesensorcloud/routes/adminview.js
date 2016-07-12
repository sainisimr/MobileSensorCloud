var ejs = require("ejs");
var mysql = require('./mysql');
var sensor=require('./sensor');

exports.adminview = function(req,res){
	
	
	console.log(req.param('adminviewId'));
	var query = "select * from sensors where sensorid='"+req.param('adminviewId')+"'";		
	console.log("Return Home Query is:"+query);
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			ejs.renderFile('./views/adminview.ejs',function(err,result)
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
		
	}, query);	



};

/*

var email = req.param("email");
var password = req.param("password");
var usertype = req.param("usertype");
//var email = req.body[0].email;
//var password = req.body[0].password; 
//var usertype = req.body[1];						//1 - admin , 2- owner ,3-user
//var usertype="";


var getUser = "select * from userinfo where email ='" + email + "' and password = '" + password + "' and usertype = '" + usertype + "'";

console.log("Query is:" + getUser);		


mysql.fetchData(function(err,results){
		
	console.log("result is" + JSON.stringify(results));
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				
				console.log("valid Login");
				req.session.email = email;
				if(usertype == "admin"){res.end("admin");}
				else if(usertype == "sensorowner"){res.end("sensorowner");}
				else if(usertype == "user"){res.end("user");}
				
			}
			else {    
				
				console.log("WRONG");
				res.end("invalid");
			}
		}  
	},getUser);
*/


/*exports.getusers = function(req,res){
	
	var query = "select name from userinfo where usertype = 'admin'";		
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
				ejs.renderFile('./views/admin.ejs',{data:results},function(err,result)
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
};*/

/*
exports.getuserprofile = function(req,res){
	
	var query = "select * from userinfo where email = '" + req.session.userprofileemail + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("userprofile is " + JSON.stringify(results));
			if (results.length > 0) {
				console.log("getuserprofile in IF");
				
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};




exports.getsensorowners = function(req,res){
	
	var query = "select * from userinfo where usertype = 'sensorowner'";		
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			if (results.length > 0) {
				console.log("getsensorowners in IF");
				console.log(JSON.stringify(results));
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};




exports.getsensorownerprofile = function(req,res){
	
	var query = "select * from userinfo where email = '" + req.session.sensorownerprofileemail + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("sensorownerprofile is " + JSON.stringify(results));
			if (results.length > 0) {
				console.log("getsensorownerprofile in IF");
				
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};


exports.getownersensors = function(req,res){
	
	var query = "select * from sensors where email = '" + req.session.sensorownerprofileemail + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("ownersensors are " + JSON.stringify(results));
			if (results.length > 0) {
				
				console.log("owner sensors in IF");
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};



exports.getsensorprofile = function(req,res){
	
	var query = "select * from sensors where sensorid = '" + req.session.sensoridprofile + "'";	
	
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			
			console.log("sensor are " + JSON.stringify(results));
			if (results.length > 0) {
				
				console.log("sensors in IF");
				res.end(JSON.stringify(results));				
			}			
		}
		
	}, query);	
};

*/



