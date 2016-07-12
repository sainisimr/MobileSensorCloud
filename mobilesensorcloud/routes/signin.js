var ejs = require("ejs");
var mysql = require('./mysql');

exports.index = function(req, res){
	
	if(req.session.email){
		
		var email = req.session.email + " via index session";
		res.render("home", {emailid: email});		
	}
	else{
		
		res.render("index");
	}	
};
exports.signin = function(req,res){
	var page1;
	var usertype=req.param('usertype'); 
	var email  ;
	var query = "select * from userinformation where email='"+req.param('email')+"' and type = '" + usertype + "'";		
	console.log("Return Home Query is:"+query);
	if(usertype=='admin')
		page1='admin.ejs';
	else if(usertype=='user')
		page1='user_user.ejs';
	else
		page1='vendor_vendor.ejs';
	
	//console.log("here");
	//	console.log(req.session.email);
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			if (results.length > 0) {
				req.session.userid=results[0].id_primarykey;
				console.log(JSON.stringify( results));
				ejs.renderFile('./views/'+page1,{data:results},function(err,result)
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