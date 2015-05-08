
  var fetcher = require('./fetcher');
  var store  = require('./store');
  var feedparser = require('./feedsearcher');
  var stylus = require('stylus');
  var express = require('express');
  var app = express();
  
  app.set('view engine', 'jade');
  app.set('views', './templates');
  
  app.use(express.static('./static'));
  app.use(stylus.middleware('./static'));

  //----------
  // home
  //----------

  function getHomePage() {
    return "Welcome to rss-cacher.\n\n" +
    "/feed/add?url=<feedurl>  ...  adds a feed to your list of watched feeds\n" +
    "/feed/refresh            ...  refreshes all of your watched feeds\n" + 
    "/item/all                ...  displays a list of all collected items\n";
  }

  app.get('/', function(req, res){
    res.end(getHomePage());
  });

  app.get('/home', function(req, res){
    res.end(getHomePage());
  });
  
  app.get('/feed', function(req, res){
    res.end(getHomePage());
  });

  //----------
  // adding feeds
  //----------
 
  app.get('/feed/add', function(req, res){
    console.log("adding feed at " + req.query.url);
    store.storeFeed(req.query.url);
    fetcher.fetch(req.query.url);
    res.end('feed added');
  });
  
  app.get('/feed/parse', function(req, res){
    console.log("parsing file for feeds at " + req.query.fileUrl)
    feedparser.parse('/home/vince/workspace/rss-cacher/data/podcasts-fi.html', "http[\w\/-\._]*\.xml"); 
    // http://radiofrance-podcast.net/podcast09/rss_11736.xml
    res.end('feeds added');
  });
  
  app.get('/feed/refresh', function(req, res){
    console.log("refreshing feeds ");
    store.retrieveAllFeeds(
      function (docs) {
        for (var i = 0; i < docs.length; i++) {
          console.log("refreshing feed at " + docs[i].url);
          fetcher.fetch(docs[i].url);
        }
      }
    );
    res.end('feeds refreshed');
  });
  
  //----------
  // displaying feeds
  //----------
  
  app.get('/item/all', function(req, res){
    store.retrieveAllItems(function(docs) {
      /*
      for (var i = 0; i < docs.length; i++) {
        console.log(docs[i]['_id']);
      }
      */
      console.log(docs.length);
      res.render('items', {'docs': docs});
    });
  });
  
  
  
  
  app.listen(process.argv[2]);

