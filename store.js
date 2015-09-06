var db = null;

module.exports = {

  connect : function () {
    console.log('MD opening');
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, mongoDb) {
      if(err) throw err;
      db = mongoDb;
    });
  },
  
  disconnect : function () {
    console.log('MD closing');
    if (db) {
      db.close();
    }
  },
  
  storeItem : function (item) {
    //var MongoClient = require('mongodb').MongoClient;
    var format = require('util').format;
 
    //console.log('MD opening for storing item ' + item.guid);
    //MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      //if(err) throw err;
   
      var collection = db.collection('rssitem');
      
      console.log("storing " + item.guid);
      collection.updateOne({guid : item.guid}, item, 
      {upsert : true}, function(err, docs) {
        if (err) {
          console.log(err);
        }
        //db.close();
      });
      
    //});
  },

  ifNoFeedFound : function (feedurl, callback) {
    var MongoClient = require('mongodb').MongoClient;
  
    console.log('MD opening for checking feed ' + feedurl);
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssfeed');
      collection.find({url : feedurl}, function(err, docs) {
        db.close();
        if (0 == docs.count()) {
          callback();
        }
      });
    });
  },

  storeFeed : function (feedurl, feedname, radio, tags) {
    //var MongoClient = require('mongodb').MongoClient;
  
    //console.log('MD opening for storing feed ' + feedurl);
    //MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      //if(err) throw err;
   
      var collection = db.collection('rssfeed');
      
      console.log("storing " + feedname);
      feed =  {
        url : feedurl, 
        title : feedname, 
        tags : tags
      };
      if (radio) {
        feed.radio = radio;
      } else {
        feed = { '$set' : feed };
      }
      collection.updateOne({url : feedurl}, feed, 
      {upsert : true}, function(err, docs) {
        if (err) {
          console.log(err);
        }
        //db.close();
      });
    //});
  },
  
  retrieveAllItems : function (callback) {
    var MongoClient = require('mongodb').MongoClient;
  
    console.log('MD opening for retrieving all items');
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssitem');
      collection.find().sort({'pubDate' : -1}).limit(50).toArray(function(err, docs) {
        db.close();
        callback(docs);
      });
    });
  },
  
  retrieveAllItemsForFeed : function (feedname, callback) {
    var MongoClient = require('mongodb').MongoClient;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssitem');
      collection.find({'meta.title' : feedname}).sort({'pubDate' : -1}).toArray(function(err, docs) {
        db.close();
        callback(docs);
      });
    });
  },
  
  retrieveFeed : function (feedname, callback) {
    var MongoClient = require('mongodb').MongoClient;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssfeed');
      collection.find({'title' : feedname}).toArray(function(err, docs) {
        db.close();
        for (var i = 0; i < docs.length; i++) {
          docs[i].link = "/item/search?feed=" + docs[i].title;
        }
        callback(docs);
      });
    });
  },
  
  retrieveRadioFeeds : function (radioname, callback) {
    var MongoClient = require('mongodb').MongoClient;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssfeed');
      collection.find({'radio' : radioname}).sort({'title' : 1}).toArray(function(err, docs) {
        db.close();
        for (var i = 0; i < docs.length; i++) {
          docs[i].link = "/item/search?feed=" + docs[i].title;
        }
        callback(docs);
      });
    });
  },

  retrieveAllFeeds : function (callback) {
    var MongoClient = require('mongodb').MongoClient;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssfeed');
      collection.find().sort({'title' : 1}).toArray(function(err, docs) {
        db.close();
        for (var i = 0; i < docs.length; i++) {
          docs[i].link = "/item/search?feed=" + docs[i].title;
        }
        callback(docs);
      });
    });
  }
}

