module.exports = {
  /**
   * outputs some content to a file named as passed
   * @param items the title for the feed (for display)
   * @param items the RSS items to add to the markdown document
   * @return some string containing the markdown document
   */
  generateHtml : function (feedtitle, items) {
    var jade = require('jade');
    var fn = jade.compileFile('./templates/items.jade');
    return fn({'message': 'le programme ' + feedtitle, 'docs': items});
  },
  
  /**
   * outputs some content to a file named as passed
   * @param filename the name of the file to use
   * @param doc content to write to the file
   */
  writeDoc : function (filepath, doc) {
    var fse = require('fs-extra');
    fse.outputFile(filepath, doc, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
}
