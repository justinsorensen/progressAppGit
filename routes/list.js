var mongoose = require( 'mongoose' );
var List = mongoose.model('List');

/////////////////////////////////////////////////////
//
//				LIST FUNCTIONS		
//
/////////////////////////////////////////////////////

//Hello testing page
exports.hello = function(req, res) {
	res.render('hello');
};

exports.info = function(req, res) {
	res.render('info', { title: 'Info'});
};

//LIST
exports.list = function(req, res) {
	List.find({}).sort('dateCreated').exec( function (err, docs) {
		//console.log(req.user);
		res.render('list', { title: 'Lists', user: req.user, lists: docs } );			//variable name "lists" using docs
	});
};
//////////

//LIST EDIT
exports.listEdit = function(req, res) {
	List.find({}).sort('dateCreated').exec( function (err, docs) {
		//console.log(req.user);
		res.render('listEdit', { title: 'Edit Lists', user: req.user, lists: docs } );			//variable name "lists" using docs
	});
};
//////////

//LIST CREATE
exports.listCreate = function(req, res) {
	List.find({}).sort('dateCreated').exec( function (err, docs) {
		//console.log(req.user);
		res.render('listCreate', { title: "Create", user: req.user, lists: docs } );			//variable name "lists" using docs
	});
};
//////////


//NEW LIST
exports.newList = function (req, res) {
	var b = req.body;
	new List({
		name: b.name,
		userID: req.user.fbId,
		dateCreated: new Date().getTime(),
		unit: b.unit,
		tag: b.tag,
		note: b.note
	}).save(function (err, user) {
		if (err) res.json(err);
		//res.redirect('/list/' + list.name);
		res.redirect('/list');
	});
};
////////////


//DELETE LIST
exports.destroyList = function(req, res, next){
	//console.log(req.params.id);
	List.findById( req.params.id, function (err, list) {
		console.log(req.user.fbId);
		console.log(list.userID);
		if(req.user.fbId == list.userID) {			//ownership check
			console.log("destroyList: belongs to current user");
			list.remove( function(err, list) {
				if(err) return next(err);
				res.redirect('/listEdit');
			});
			} else {
				console.log("destroyList: does not belong to current user");
				res.redirect('/');
			}
	});
};
//////////////

/////////////////////////////////////////////////////
//
//				ITEM FUNCTIONS		
//
/////////////////////////////////////////////////////

//SHOW ITEMS IN LIST
exports.showItems = function (req, res) {
	console.log(req.params.id);
	List.findById( req.params.id, function(err, list) {
		if(req.user.fbId == list.userID) {
			console.log("belongs to current user");
			res.render('showItems', { title: list.name, list: list });
		} else {
			console.log("does not belong to current user");
			res.redirect('/');
		}
	});
};
/////////////////////

//CREATE NEW ITEM
exports.newItem = function (req, res) {
	var b = req.body;
	console.log(req.params.id);
	List.update(
		{ _id: req.params.id },
		{ $push: { 'item': { 'value': b.value }}},
		function (err) {
			res.redirect('/list/' + req.params.id);
		});
};
/////////////////////

//DELETE LAST ITEM
exports.delItem = function (req, res) {
	console.log("delItem");
	console.log("req.params.id: " + req.params.id);
	console.log("fbId: " + req.user.fbId)
	//console.log("userID: " + list.userID);
	List.findById( req.params.id, function (err, list) {
		console.log("inside loop: " + list.userID);
		if(req.user.fbId == list.userID) {						//check if belongs to current user
			console.log("delItem: belongs to current user");
			List.update(
				{ _id: req.params.id},
				{ $pop: { 'item': 1 }},
				function (err) {
					res.redirect('/list/' + req.params.id);
				});
		} else {
			console.log("delItem: does not belong to current user");
			res.redirect('/');
		}
	});
};
////////////////////

//itemGraph creates array to be stringified
exports.itemGraph = function(req, res) {
	console.log(req.params.id);

	var graphObject = [];				//empty array to store items for graphing

	var cb = function(obj) {			//callback object to test array
		console.log(obj);
	}

	List.findById(req.params.id, function(err, list) {
		console.log(list.item.length);
		for(var i = 0; i < list.item.length; i++) {
			//console.log(i);
			//console.log(list.item);
			graphObject.push(list.item[i]);				//add ".value" to push only value 
		}
		//var json_string = graphObject;
		//console.log(JSON.stringify(json_string));
		//cb(graphObject);
		res.render('itemGraph', { title: "Graph", list: list, graph: graphObject });
		//res.render('itemGraph', {locals: { list: list, graph: graphObject }});
	});
	//res.render('itemGraph', { graph: graphObject });
	//cb(graphObject);
	//next();
};
///////////////////////

//showTag render page 
exports.showTag = function(req, res) {
	console.log(req.params);
	console.log(req.params.id);
	console.log(req.params.tag);
	console.log("after params");
	console.log(req.user);
	//res.render("showTag");
	/*List.findById( req.params.id, function(err, list) {
		res.render('showTag', { list: list });
	});*/
	List.find({ "tag": req.params.tag }).sort('dateCreated').exec( function (err, docs) {
		console.log("Inside loop: " + req.params.tag);
		res.render('showTag', { tag: req.params, list: docs });			//variable name "lists" using docs
	});
};
////////////////////

//compareTag compares 2 tags via their _id
exports.compareTag = function(req, res) {
	console.log("id: " + req.params.id);
	console.log("id2:" + req.params.id2);

						//empty array for list storage
	var list1 = [];		//list1 is the list owned by the user
	var list2 = [];		//list2 is list to compare original to 

	List.findById(req.params.id, function(err, listA) {
		if (req.user.fbId == listA.userID) {					//ownership test
			console.log("compareTag: belongs to current user");
			for(var i = 0; i < listA.item.length; i++) {
				list1.push(listA.item[i]);				//add ".value" to push only value 
			}

			List.findById(req.params.id2, function(err, listB){

				for(var i = 0; i < listB.item.length; i++) {
					list2.push(listB.item[i]);				//add ".value" to push only value 
				}

				console.log("list1: " + list1);
				console.log("list2: " + list2);
				res.render("compareTag", { title: "Compare Progress", list1: JSON.stringify(list1), list2: JSON.stringify(list2), listA: listA, listB: listB  });
			});
		} else {
			console.log("compareTag: does not belong to current user");
			res.redirect("/");
		};
	});
	
};



///////////////////////////////////
//
//		HELPER FUNCTIONS
//
//////////////////////////////////

//ownership check
/*if(req.user.fbId == list.userID) {			
		//do something
	} else {
		//do something else
		res.redirect('/');
	}*/