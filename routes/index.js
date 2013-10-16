
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'progressApp' });
};
exports.loggedin = function(req, res){
	res.render('loggedin', { title: 'progressApp', user: req.user});
};
						