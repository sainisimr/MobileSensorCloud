
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , deleteadmin = require('./routes/deleteadmin') 
  , adminview = require('./routes/adminview')
   , adminedit = require('./routes/adminedit')
  , admin = require('./routes/admin')
  , user_signup = require('./routes/user_signup')
  , signin = require('./routes/signin')
  , user_user = require('./routes/user_user')
  , user_userbillingplan = require('./routes/user_userbillingplan')
  , user_sensordatainformation = require('./routes/user_sensordatainformation')
  , user_billinginformation = require('./routes/user_billinginformation')
  , signin = require('./routes/signin')
  , sensor = require('./routes/sensor')
  , vendor_vendor = require('./routes/vendor_vendor')
  , sensorowner = require('./routes/sensorowner') 
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

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

// development only
if ('development', function() {
  app.use(express.errorHandler());
});
app.get('/user_enrollplan',  function(req,res){ console.log(req.param('paymentid')) ;
req.session.billing_id=req.param('paymentid') ;
res.render('../views/user_payment.ejs');});
app.get('/user_userbillingplanenroll',user_userbillingplan.user_userbillingplanenroll,user_userbillingplan.user_userbillingplanenrollinsert);
app.get('/', routes.index);
app.get('/signout',  function(req,res){res.render('../views/signin.ejs');});
app.get('/signin', signin.signin);
app.get('/admin',admin.admin);
app.get('/sensor',sensor.sensor);
app.get('/admineditnew',deleteadmin.admineditnew);
app.get('/usereditnew',deleteadmin.usereditnew);
app.get('/sensoreditnew',deleteadmin.sensoreditnew);
app.post('/userdelete',deleteadmin.userdelete);
//app.post('/user',deleteadmin.user);
app.get('/sensordelete',deleteadmin.sensordelete);
app.get('/sensorowner',sensorowner.sensorowner);
//app.get('/sensorowner', function(req,res){res.render('../views/sensorowner.ejs');});
//app.get('/sensor', function(req,res){res.render('../views/sensor.ejs');});
app.post('/adminview', deleteadmin.adminview);
app.post('/deleteadmin', deleteadmin.admindelete);
app.post('/adminedit', deleteadmin.adminedit);
app.post('/useredit', deleteadmin.useredit);
app.get('/sensoredit',deleteadmin.sensoredit);
//app.post('/adminedit', adminedit.adminedit);
app.get('/admin', function(req,res){res.render('../views/admin.ejs');});
app.post('/deleteadmin',deleteadmin.deleteadmin);

app.get('/user',user.user);
//user control
app.get('/user_signup', function(req,res){res.render('../views/user_signup.ejs');});
app.post('/user_signupdetail', user_signup.user_signupdetail);

app.get('/vendor_vendor', vendor_vendor.vendor_vendor);
app.get('/vendor_controller', vendor_vendor.vendor_controller, vendor_vendor.vendor_controller_billing ,vendor_vendor.renderControllerPage);
app.get('/vendor_editcontroller', vendor_vendor.vendor_editcontroller);
app.get('/vendor_editcontrollerupdate', vendor_vendor.vendor_editcontrollerupdate,
		vendor_vendor.vendor_controller, vendor_vendor.vendor_controller_billing ,vendor_vendor.renderControllerPage);
app.get('/vendor_deletecontroller', vendor_vendor.vendor_deletecontroller,
		vendor_vendor.vendor_controller, vendor_vendor.vendor_controller_billing ,vendor_vendor.renderControllerPage);
app.get('/vendor_addcontroller', function(req,res){res.render('../views/vendor_addcontroller.ejs');});
app.get('/vendor_addcontrollerinsert', vendor_vendor.vendor_addcontrollerinsert,vendor_vendor.vendor_controller, 
		vendor_vendor.vendor_controller_billing ,vendor_vendor.renderControllerPage);

app.get('/vendor_sensor', vendor_vendor.vendor_sensor,vendor_vendor.vendor_controller_controller,vendor_vendor.renderSensorPage);
app.get('/vendor_editsensor', vendor_vendor.vendor_editsensor);
app.get('/vendor_editsensorupdate', vendor_vendor.vendor_editsensorupdate,
		vendor_vendor.vendor_sensor,vendor_vendor.vendor_controller_controller,vendor_vendor.renderSensorPage);
app.get('/vendor_deletesensor', vendor_vendor.vendor_deletesensor,vendor_vendor.vendor_sensor,
		vendor_vendor.vendor_controller_controller,vendor_vendor.renderSensorPage);
app.get('/vendor_addsensor', function(req,res){res.render('../views/vendor_addsensors.ejs');});
app.get('/vendor_addsensorinsert', vendor_vendor.vendor_addsensorinsert,vendor_vendor.vendor_sensor,
		vendor_vendor.vendor_controller_controller,vendor_vendor.renderSensorPage);
app.get('/vendor_billingplan', vendor_vendor.vendor_billingplan);
app.get('/vendor_addbilling', function(req,res){res.render('../views/vendor_addbillingplan.ejs');});
app.get('/vendor_addbillingplan', vendor_vendor.vendor_addbillingplan);


app.get('/user_user', user_user.user_user);

//app.get('/user_user', function(req,res){res.render('../view/user_user.ejs');});

app.get('/user_userbillingplan', user_userbillingplan.user_userbillingplan);

app.get('/user_billinginformation', user_billinginformation.user_billinginformation);

app.get('/user_sensordatainformation', user_sensordatainformation.user_sensordatainformation);
app.get('/singleSensorData',user_sensordatainformation.singleSensorData,
		user_sensordatainformation.user_updatecost,user_sensordatainformation.user_updatecostdatabase);






http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



