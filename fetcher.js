module.exports = {
  fetch : function (feedurl) {

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
    feedparser.on('readable', function() {
      // This is where the action is! 
      var stream = this;
      var meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance 
      var item;
      
      //console.log('\n\n----------\n\n');
      //console.log(meta);
      //console.log('\n\n----------\n\n');
   
      while (item = stream.read()) {
        store.storeItem(item);
        // TODO persist feed item
  //      console.log('\n\n----------\n\n');
  //      console.log(item);
      }
    });
  }
  
};
