var ejs = require("ejs");
var mysql = require('./mysql');

exports.user_signupdetail = function(req, res){
var newUser= "INSERT INTO userinformation (firstname, lastname,email, password, mobile, type, securityques) VALUES " +
		"('"+req.param("firstname")+"','"+req.param("lastname")+"','"+req.param("emailid")+"','" + req.param("password") +"' , '" + req.param("mobile") +"' " +
				", '" + req.param("typeofuser") +"' , '" + req.param("securityques") +"');";
console.log("Query is:"+newUser);


mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}

	res.render("../views/signin.ejs");
	
},newUser);

};