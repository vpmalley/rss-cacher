module.exports = {
  fetch : function (feedurl, parseItems, radio) {

    var FeedParser = require('feedparser');
    var request = require('request');
    var store = require('./store');
   
    var req = request(feedurl);
    var feedparser = new FeedParser();
   
    req.on('error', function (error) {
      // handle any request errors 
    });
    req.on('response', function (res) {
      var stream = this;
   
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
   
      stream.pipe(feedparser);
    });
   
   
    feedparser.on('error', function(error) {
      // always handle errors 
    });
    
    feedparser.on('meta', function (meta) {
      store.storeFeed(feedurl, meta.title, radio);
    });
    feedparser.on('readable', function() {
      // This is where the action is! 
      var stream = this;
      var item;
      
      if (parseItems) {
        while (item = stream.read()) {
          store.storeItem(item);
        }
      }
    });
  }
  
};
