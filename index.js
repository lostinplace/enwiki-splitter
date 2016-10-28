var saxpath = require('saxpath');
var fs      = require('fs');
var sax     = require('sax');
var parseString = require('fast-xml2js').parseString;

var fileStream = process.stdin;
var saxParser  = sax.createStream(true);
var streamer   = new saxpath.SaXPath(saxParser, '/mediawiki/page');
var outFolder = process.argv[2]
debugger

streamer.on('match', xml => {
  parseString(xml, (err,result) => {
    if(!result.page.redirect){
      var title = result.page.title[0];
      var id = result.page.id[0];
      var outFileName = id;
      var outPath = `${outFolder}/${outFileName}.xml`;
      fs.writeFileSync(outPath, xml);
      console.log(`wrote: "${title}" to "${outPath}" `)
    }
  });
});

fileStream.pipe(saxParser);
