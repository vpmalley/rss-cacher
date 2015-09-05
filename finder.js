module.exports = {
  findFeeds : function (pageurl, radio) {
    
    var fs = require('fs');
    var extractor = require('file-extractor');
    var fetcher = require('./fetcher');      
    var async = require("async");
   
    var feedUrls = [];
    var s = fs.createReadStream(pageurl, {encoding: 'utf8'});
    extractor().matches(/http\:\/\/.{10,70}\d{4,5}\.xml/,function(m){
      feedUrls.push(m[0]);
    }).on('end', function(vars){
      console.log(feedUrls.length);
      s.close();
      async.eachSeries(feedUrls, function iterator(item, callback) {
        async.setImmediate(function () {
          console.log(radio + ": finding " + item);
          fetcher.fetch(item, false, radio);
        });
        setTimeout(callback, 1000);
      });
      
    }).start(s);
  }
  
};
