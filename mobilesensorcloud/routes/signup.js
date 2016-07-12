	var mysql = require('./mysql');

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.register = function(req,res){
	
	var email = req.body[0].email;
	var name = req.body[0].name;
	var password = req.body[0].password;
	var mobile = req.body[0].mobile;
	var usertype = req.body[1];						//1 - admin , 2- owner ,3-user

	
	
	var query = "INSERT INTO userinfo (email, name, password, mobile, usertype) VALUES ('" + email + "','" + name + "','" + password + "','" + mobile + "','" + usertype + "')";									
	
	
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