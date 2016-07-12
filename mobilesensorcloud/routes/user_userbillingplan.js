var ejs = require("ejs");
var mysql = require('./mysql');
var user_userbillingplan = require('./user_userbillingplan');

exports.user_userbillingplan = function(req,res){
	
	var email=req.session.email;
	var query = "select billingid_primarykey,planname,cost,description," +
			"(SELECT CASE WHEN billinginformation_billingid_primarykey IS not NULL THEN " +
			"'Enrolled' ELSE 'NotEnrolled' END from billinginformation where userinfo_id_primarykey='"+req.session.userid+"' and" +
			" billinginformation_billingid_primarykey=bi.billingid_primarykey) as billinginformations " +
			"from billinginformation as bi where bi.isoriginal=1";
	console.log("Return Home Query is:"+query);
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			if (results.length > 0) {
				ejs.renderFile('./views/user_userbillingplan.ejs',{data:results},function(err,result)
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

exports.user_userbillingplanenroll = function(req,res,next){
	
	var billing_id=req.session.billing_id;
	var query ="select * from billinginformation where billingid_primarykey='"+billing_id+"'";
	console.log("Return Home Query is:"+query);
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			if (results.length > 0) {
				req.billing=results;
				return next();
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

exports.user_userbillingplanenrollinsert = function(req,res,next){
	var query = "insert into billinginformation (userinfo_id_primarykey,cost,planname," +
			"isOriginal,description,billingusage,billinginformation_billingid_primarykey) values " +
			"('"+req.session.userid+"','"+req.billing[0].cost+"','"+req.billing[0].planname+"','0'," +
					"'"+req.billing[0].description+"','0','"+req.billing[0].billingid_primarykey+"')";
	console.log("Return Home Query is:"+query);
	mysql.fetchData(function(err, results){
		if (err) {
			throw err;
		} 
		else {
			user_userbillingplan.user_userbillingplan(req,res);
		}
		
	}, query);	
};
