var locomotive = require('locomotive')
  , Controller = locomotive.Controller;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://grbrewer:Pass248word@ds141889.mlab.com:41889/twec-storeinfo";

var storesController = new Controller();
storesController.index = function() {
	var self = this;
	
	self.title = "TransWorld Entertainment";
	self.subtitle = "Store Information"
	self.render();
}

storesController.search = function() {
	var self = this;
	var store_number = this.param("store-number");
	self.title = "TransWorld Entertainment";
	self.subtitle = "Store Information"

	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("twec-storeinfo");
	  var query = { "Store #": parseInt(store_number) };
	  console.log(query);
	  dbo.collection("stores").find(query).toArray(function(err, result) {
	    if (err) throw err;
	    //console.log(result);
	    if(result.length == 0)
	    {
	    	self.method = 'store';
	    	self.store = newStore(parseInt(store_number));
	    }
	    else {
	    	self.method = 'update';
	    	self.store = result[0];
	    }
	    self.render('form');
	    db.close();
	  });
	});	
}

storesController.store = function() {
	var self = this;
	var req = requestToStore(self);
	if(req[0] != "")
	{
		self.errorField = req[0];
		self.store = req[1];
		self.method = 'store';
		self.render('form');
	}
	else {
		var store = req[1];
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("twec-storeinfo");
		  dbo.collection("stores").insertOne(store, function(err, res) {
		    if (err) throw err;
		    self.redirect('/stores');
		    db.close();
		  });
		}); 
	}
}

storesController.update = function() {
	var self = this;
	var req = requestToStore(self);
	if(req[0] != "")
	{
		self.errorField = req[0];
		self.store = req[1];
		self.method = 'update';
		self.render('form');
	}
	else {
		var store = req[1];
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("twec-storeinfo");
		  var myquery = { "Store #": store['Store #'] };
		  var newvalues = { $set: store };
		  dbo.collection("stores").updateOne(myquery, newvalues, function(err, res) {
		    if (err) throw err;
		    console.log("1 document updated");
		    self.redirect('/stores');
		    db.close();
		  });
		}); 
	}
}

storesController.delete = function() {
	var self = this;
	console.log('DELETE');
	var id = this.param('id');
	console.log(id);
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("twec-storeinfo");
	  var myquery = { "Store #": parseInt(id) };
	  dbo.collection("stores").deleteOne(myquery, function(err, obj) {
	    if (err) throw err;
	    console.log("1 document deleted");
	    self.redirect('/stores');
	    db.close();
	  });
	}); 
}

function requestToStore(form)
{
	var store = {};
	var errorFields = "";
	if(form.param('region') == '')
	{
		errorFields += "Region";
	}
	store['Region #'] = parseInt(form.param('region'));

	if(form.param('district') == '')
	{
		if(errorFields != "")
		{
			errorFields += ", ";
		}
		errorFields += "District";
	}
	store['District #'] = parseInt(form.param('district'));

	if(form.param('store-number') == '')
	{
		if(errorFields != "")
		{
			errorFields += ", ";
		}
		errorFields += "Store Number";
	}
	store['Store #'] = parseInt(form.param('store-number'));
	store['Store Name'] = form.param('store-name');
	store['Address'] = form.param('store-address');
	store['City'] = form.param('store-city');
	store['State'] = form.param('store-state');
	store['zip code'] = form.param('store-zip');

	return [errorFields, store];
}
function newStore(store_number)
{
	var store = {};
	store['Region #'] = "";
	store['District #'] = "";
	store['Store #'] = store_number;
	store['Store Name'] = "";
	store['Address'] = "";
	store['City'] = "";
	store['State'] = "";
	store['zip code'] = "";

	return store;
}

module.exports = storesController;