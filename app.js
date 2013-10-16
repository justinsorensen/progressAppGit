
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();
var config = require('./config');

var User = require('./models/user');
var userRoutes = require('./routes/user');

var List = require('./models/list');
var listRoutes = require('./routes/list');

var passport = require('passport');
var	FacebookStrategy = require('passport-facebook').Strategy;


//passport setup
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	/*User.findOne(id, function(err, user){			//original code was the session problem
		done(err, user);
	});*/
	User.findById(id, function(err, user) { 		//testing alternative
		done(err, user); 							//here
	});
});
	
passport.use(new FacebookStrategy({
	clientID: config.development.fb.appId,
	clientSecret: config.development.fb.appSecret,
	callbackURL: config.development.fb.url + 'fbauthed'
	}, 
	function(accessToken, refreshToken, profile, done){
		process.nextTick(function(){
			var query = User.findOne({ 'fbId': profile.id});
			query.exec(function(err, oldUser){
				if(oldUser) {
					console.log('Existing User:' + oldUser.fbId + ' found and logged in!');
					done(null, oldUser);
				} else {
					var newUser = new User();
					newUser.fbId = profile.id;
					newUser.name = profile.displayName;
					//newUser.email = profile.emails[0].value;
					
					newUser.save(function(err){
						if(err) throw err;
						console.log('New User: ' + newUser.fbId + ' created and logged in!');
						done(null, newUser);
					});
				}
			});
		});
	}
));	

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());		//add cookieParser
app.use(express.bodyParser());
app.use(express.session({ secret: 'aasdfasdfasdfasdfasdf' }));			//add session
app.use(passport.initialize());		//add init
app.use(passport.session());		//add session
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
//app.get('/fbauth', passport.authenticate('facebook', { scope: 'email' }));
app.get('/fbauth', passport.authenticate('facebook'));
app.get('/fbauthed', passport.authenticate('facebook', {failureRedirect: '/'}), routes.loggedin);
app.get('/logout', function(req, res){
	req.logOut();
	res.redirect('/');
});
app.get("/test", authenticatedCheck, function (req, res) {		//testing page for "authenticatedCheck"
	res.send("test page, use /users to see users");
});

//HELLO TESTING FUNCTION
/*app.get("/hello", function(req, res) {
	res.render("hello");
});*/

app.get('/hello', listRoutes.hello);

/////////////////////////////////////
//
//		LIST FUNCTIONS
//
/////////////////////////////////////
app.get("/info", listRoutes.info);

//LIST
app.get("/list", listRoutes.list);

//EDIT LIST PAGE
app.get("/listEdit", authenticatedCheck, listRoutes.listEdit);

//CREATE LIST PAGE
app.get("/listCreate", authenticatedCheck, listRoutes.listCreate);

//NEW
app.post("/list", authenticatedCheck, listRoutes.newList);

//DELETE LIST
app.get("/list/destroy/:id", authenticatedCheck, listRoutes.destroyList);

//SHOW ITEMS
app.get("/list/:id", authenticatedCheck, listRoutes.showItems);

//NEW ITEM
app.put("/list/:id/newItem", authenticatedCheck, listRoutes.newItem);

//DELETE LAST ITEM
app.put("/list/:id/delItem", authenticatedCheck, listRoutes.delItem );

//array creation for graphing
app.get("/list/:id/itemGraph", authenticatedCheck, listRoutes.itemGraph);

//showTag
app.get("/list/:id/:tag", authenticatedCheck, listRoutes.showTag);

//compareTag
app.get("/list/:id/:tag/:id2/compareTag", authenticatedCheck, listRoutes.compareTag);

//////////////////////////////////////

/////////////////////////////////////
//
//			HELPER FUNCTIONS
//
/////////////////////////////////////

function authenticatedCheck(req, res, next){
    if(req.isAuthenticated()){
        console.log("authenticatedCheck successful")
        next();
    }else{
    	console.log( "authenticatedCheck failure");
        res.redirect("/");
    }
}


//************* Helper Functions End *************

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
