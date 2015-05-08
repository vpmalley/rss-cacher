module.exports = {
  parse : function (fileUrl, pattern) {
    var fs = require('fs');
    fs.readFile(fileUrl, function(err, booksContent) {
      if (err) {
        console.log(err);
      } else {
        var matches = pattern.exec(booksContent);
        console.log(matches);
      }
    });

    /*
    var extractor = require('file-extractor');
    extractor().matches(/http[A-Za-z0-9_\/\-\.]+\.xml/g,
        function(m){ console.log(m); }
      ).start();
    */  
      
  }
}
