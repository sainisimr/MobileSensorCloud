
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('controller', { title: 'Express' });
};