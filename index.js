var saxpath = require('saxpath');
var fs      = require('fs');
var sax     = require('sax');
var parseString = require('fast-xml2js').parseString;

var fileStream = process.stdin;
var saxParser  = sax.createStream(true);
var streamer   = new saxpath.SaXPath(saxParser, '/mediawiki/page');
debugger

streamer.on('match', xml => {
  parseString(xml, (err,result) => {
    if(!result.page.redirect){
      var outFileName = result.page.title[0].split(/:|\//).join("_");
      var outPath = `output/${outFileName}.xml`;
      fs.writeFileSync(outPath, xml);
    }
  });
});

fileStream.pipe(saxParser);
