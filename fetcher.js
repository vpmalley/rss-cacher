var FeedParser = require('feedparser');
var request = require('request');
var store = require('./store');
var count = 0;
   
module.exports = {
  fetch : function (feedurl, parseItems, radio) {
    count++;
    console.log(count);
    var feedparser = new FeedParser();
    request.get(feedurl)
    .on('error', function (error) {
      console.log('ERR.req : ' + error);
    })
    .on('response', function (res) {
      if (res.statusCode != 200) return this.emit('error', new Error('Bad status code : ' + res.statusCode));
    })
    .pipe(feedparser);
   
    feedparser.on('error', function(error) {
      // always handle errors 
      console.log('ERR.feedparser : ' + error);
    });
    
    feedparser.on('meta', function (meta) {
      console.log('fetching feed ' + meta.title);
      store.storeFeed(feedurl, meta.title, radio);
    });
    
    feedparser.on('readable', function() {    
      if (parseItems) {
        var stream = this;
        var item;
        while (item = stream.read()) {
          store.storeItem(item);
        }
      }
    });
    
  }
  
};
