var ejs = require("ejs");
var mysql = require('./mysql');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var url = 'mongodb://52.32.254.215:27017/sensordata';

exports.user_sensordatainformation = function(req,res){
	
	var email=req.session.email;
	var query = "select * from sensors where controllerinformation_controllerid_primarykey in (select controllerid_primarykey " +
			"from controllerinformations where billinginformation_billingid_primarykey in (select billinginformation_billingid_primarykey " +
			"from billinginformation where userinfo_id_primarykey='"+req.session.userid+"'))";		
	console.log("Return Home Query is:"+query);
	mysql.fetchData(function(err, results){
		
		if (err) {
			throw err;
		} 
		else {
			if (results.length > 0) {
				ejs.renderFile('./views/user_sensordatainformation.ejs',{data:results},function(err,result)
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

exports.singleSensorData = function(req, res,next){
	MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    
  var collection = db.collection('users');

    // Insert some users
    collection.find({Sensor_Id: req.param('sensorid') }).toArray(function (err, result) {
      if (err) {
        console.log(err);
      } else if (result.length>0) {
    	  req.mongodata = result;
    	  next();
    	  
      } else {
    	  console.log("No Data");
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
    db.close();
	    });
	  }
	});	
};

exports.user_updatecost = function(req,res,next){
	var sensorId=req.param('sensorid');
	var query = "select billingusage,cost,billingid_primarykey from billinginformation where billinginformation_billingid_primarykey in " +
			"(select billinginformation_billingid_primarykey from controllerinformations where controllerid_primarykey " +
			"in (select controllerinformation_controllerid_primarykey from sensors where sensorid='"+sensorId+"')) and userinfo_id_primarykey='"+req.session.userid+"'";		
console.log("Return Home Query is:"+query);
mysql.fetchData(function(err, results){
	
	if (err) {
		throw err;
	} 
	else {
		if (results.length > 0) {
			req.cost = results;
			return next();
		}
	}
	
}, query);	};

exports.user_updatecostdatabase = function(req,res,next){
	var cost=parseFloat(req.cost[0].cost)+0.5;
	var usage=parseFloat(req.cost[0].billingusage)+1;
	var query = "update billinginformation set billingusage='"+usage+"',cost='"+cost+"' where billingid_primarykey='"+req.cost[0].billingid_primarykey+"'";
	console.log("Return Home Query is:"+query);
	mysql.fetchData(function(err, results){
		if (err) {
			throw err;
		} 
		else {
			console.log('got results');
	    	  ejs.renderFile('./views/user_datafrommongo.ejs',{data:req.mongodata},function(err,result)
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






