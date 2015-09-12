module.exports = {
  /**
   * outputs some content to a file named as passed
   * @param items the title for the feed (for display)
   * @param items the RSS items to add to the markdown document
   * @return some string containing the markdown document
   */
  generateFeedHtml : function (feedtitle, items) {
    var jade = require('jade');
    var fn = jade.compileFile('./templates/items-gh.jade', { pretty : '\t'});
    return fn({'message': 'le programme ' + feedtitle, 'docs': items});
  },
  
  /**
   * outputs some content to a file named as passed
   * @param radio the title for the feed (for display)
   * @param feeds the feeds to add to the markdown document
   * @return some string containing the markdown document
   */
  generateRadioHtml : function (radio, feeds) {
    var jade = require('jade');
    var fn = jade.compileFile('./templates/feeds-gh.jade', { pretty : '\t'});
    return fn({'message': 'Les programmes de ' + radio, 'feeds': feeds});
  },
  
  getFileName : function (feedtitle) {
    /*
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    var date = yyyy + '-' + mm + '-' + dd;
    var filepath = folder + '/' + date + '-' + feedtitle.replace(' ', '-') + '.html';
    */
    var filepath = feedtitle.replace(/\//gm, '-').replace(/\?/gm, '').replace(/\W/gm, '-') + '.html'; 
    return filepath;
  },
  
  /**
   * outputs some content to a file named as passed
   * @param filename the name of the file to use
   * @param doc content to write to the file
   */
  writeDoc : function (filepath, doc) {
    //doc = "---\ntags : radiofrance\n---\n" + doc;
    var fse = require('fs-extra');
    fse.outputFile(filepath, doc, {encoding : "utf8" }, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
}
