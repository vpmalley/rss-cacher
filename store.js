module.exports = {
  storeItem : function (item) {
    var MongoClient = require('mongodb').MongoClient;
    var format = require('util').format;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssitem');
      
      console.log("adding/udpating " + item.guid);
      collection.updateOne({guid : item.guid}, item, 
      {upsert : true}, function(err, docs) {
        if (err) {
          console.log(err);
        }
        db.close();
      });
      
    });
  },

  storeFeed : function (feedurl, feedname, radio, tags) {
    var MongoClient = require('mongodb').MongoClient;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssfeed');
      
      console.log("adding/udpating " + feedname);
      feed =  {
        url : feedurl, 
        title : feedname, 
        tags : tags
      };
      if (radio) {
        feed.radio = radio;
      }
      collection.updateOne({url : feedurl}, feed, 
      {upsert : true}, function(err, docs) {
        if (err) {
          console.log(err);
        }
        db.close();
      });
    });
  },
  
  retrieveAllItems : function (callback) {
    var MongoClient = require('mongodb').MongoClient;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssitem');
      collection.find().limit(50).toArray(function(err, docs) {
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
      collection.find({'meta.title' : feedname}).toArray(function(err, docs) {
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
  
  retrieveAllFeeds : function (callback) {
    var MongoClient = require('mongodb').MongoClient;
 
    MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
      if(err) throw err;
   
      var collection = db.collection('rssfeed');
      collection.find().toArray(function(err, docs) {
        db.close();
        for (var i = 0; i < docs.length; i++) {
          docs[i].link = "/item/search?feed=" + docs[i].title;
        }
        callback(docs);
      });
    });
  }
}

