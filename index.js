
  var fetcher = require('./fetcher');
  var store  = require('./store');
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
    store.retrieveAllFeeds(function(feeds) {
      console.log(feeds.length);
      res.render('home', {'feeds': feeds});
    });
  });
  
  app.get('/feed', function(req, res){
    res.end(getHomePage());
  });

  //----------
  // adding feeds
  //----------
 
  app.get('/feed/add', function(req, res){
    console.log("adding feed at " + req.query.url);
    fetcher.fetch(req.query.url);
    res.render('message', {'message' : 'Programme ajouté'});
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
    res.render('message', {'message' : 'Émissions rafraîchies'});
  });
  
  //----------
  // displaying feeds
  //----------
  
  app.get('/item/all', function(req, res){
    store.retrieveAllItems(function(docs) {
      console.log(docs.length);
      res.render('items', {'message': 'tous les programmes', 'docs': docs});
    });
  });
  
  app.get('/item/search', function(req, res){
    
    // search by feed name
    if (req.query.feed) {
      store.retrieveAllItemsForFeed(req.query.feed, function(docs) {
        console.log(docs.length);
        res.render('items', {'message': 'le programme ' + req.query.feed, 'docs': docs});
      });
    }
  });
  
  
  
  app.listen(process.argv[2]);

