
exports.checkbutton = function(req,res) {
var vendor = require('./vendor.js');
var id = req.param('id');
console.log(id);
if(id === "breaddb")
 { 
    console.log("hello in check button");
    vendor.readdatabase(req,res);
     
       }
if(id === "bstatus")
{ 
   console.log("status of  sensor");
   vendor.statusofsensors(req,res);
    
      }
if(id === "bcontrollerinfo")
{ 
   console.log("hello in configure button");
   vendor.controllerinformation(req,res);
    
      }
};


