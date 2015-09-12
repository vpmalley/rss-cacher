
  var finder = require('./finder');
  var fetcher = require('./fetcher');
  var store  = require('./store');
  var writer  = require('./writer');
  var stylus = require('stylus');
  var express = require('express');
  var async = require("async");
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
    if (req.query.url) {
      console.log("adding feed at " + req.query.url);
      store.connect();
      fetcher.fetch(req.query.url, true);
      store.disconnect();
      res.render('message', {'message' : 'Programme ajouté', 'link' : '/home'});
    } else {
      res.render('message', {'message' : 'on attend le format : /feed/add?url=<page rss fu flux>', 'link' : '/home'});
    }
  });
  
  app.get('/feed/refresh', function(req, res){
    console.log("refreshing feeds ");
    var linkDisplay = '/home';
    
    store.connect();
    if (req.query.feed) {
      store.retrieveFeed(req.query.feed,
        function (docs) {
          fetcher.fetch(docs[0].url, true);
        }
      );
      linkDisplay = '/item/search?feed=' + req.query.feed;
    } else {
      store.retrieveAllFeeds(
        function (docs) {
          async.eachSeries(docs, function iterator(item, callback) {
            async.setImmediate(function () {
              console.log("refreshing feed at " + item.url);
              fetcher.fetch(item.url, true);
            });
            setTimeout(callback, 1000);
          });
        }
      );      
    }
    store.disconnect();
    
    res.render('message', {'message' : 'Émissions rafraîchies', 'link' : linkDisplay});
  });

  app.get('/rf/parse', function(req, res){
    //finder.findFeeds('./francemusique.html', 'fm');
    finder.findFeeds('./franceinter.html', 'fi');
    //finder.findFeeds('./franceculture.html', 'fc');
      res.render('message', {'message' : 'De nombreux programmes sont ajoutés, cela va prendre un moment.', 'link' : '/home'});
  });
  
  //----------
  // displaying feeds
  //----------

  app.get('/feed/display', function(req, res){
    if (req.query.radio) {
      store.retrieveRadioFeeds(req.query.radio, function(feeds) {
        console.log(feeds.length);
        res.render('home', {'feeds': feeds});
      });
    } else {
      store.retrieveAllFeeds(function(feeds) {
        console.log(feeds.length);
        res.render('home', {'feeds': feeds});
      });      
    }
  });
  
  app.get('/item/all', function(req, res){
    store.retrieveAllItems(function(docs) {
      console.log(docs.length);
      res.render('items', {'message': 'tous les programmes', 'docs': docs, 'query' : ''});
    });
  });
  
  app.get('/item/search', function(req, res){
    
    // search by feed name
    if (req.query.feed) {
      store.retrieveAllItemsForFeed(req.query.feed, function(docs) {
        console.log(docs.length);
        res.render('items', {'message': 'le programme ' + req.query.feed, 'docs': docs, 'query' : '?feed=' + req.query.feed});
      });
    }
  });
  
  //----------
  // printing feeds
  //----------
  
  app.get('/feed/print', function(req, res){
    if (req.query.radio) {
      store.retrieveRadioFeeds(req.query.radio,
        function (docs) {
          for (var i = 0; i < docs.length; i++) {
            console.log("printing feed " + docs[i].title);
            printFeed(req.query.radio, docs[i].title);
            docs[i].link = './' + writer.getFileName(docs[i].title);
          }
          printRadio(req.query.radio, docs);
          res.end('printed');
        }
      );
    }
  });

  function printRadio(radio, feeds) {
    var doc = writer.generateRadioHtml(radio, feeds);
    var filepath = radio + '/' + writer.getFileName('index');
    console.log(filepath);
    writer.writeDoc('output/' + filepath, doc);
  }
  
  function printFeed(folder, feedtitle) {
      store.retrieveAllItemsForFeed(feedtitle, function(docs) {
      docs = docs || {};
      console.log(docs.length);
      var doc = writer.generateFeedHtml(feedtitle, docs);
      var filepath = folder + '/' + writer.getFileName(feedtitle);
      console.log(filepath);
      writer.writeDoc('output/' + filepath, doc);
    });
  }
  
  app.listen(process.argv[2]);

