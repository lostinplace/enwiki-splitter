var saxpath = require('saxpath');
var fs      = require('fs');
var sax     = require('sax');
var parseString = require('fast-xml2js').parseString;

var fileStream = process.stdin;
var saxParser  = sax.createStream(true);
var streamer   = new saxpath.SaXPath(saxParser, '/mediawiki/page');
var outFolder = process.argv[2]
debugger
var pattern = RegExp(process.argv[3])
var counter = 0;
var lastPrinted = 0;

function updateSkip(){
  console.log(`skipped: ${counter - lastPrinted}, continuing from ${counter}`);
  lastPrinted = counter;
}

streamer.on('match', xml => {
  counter++;
  parseString(xml, (err,result) => {
    let hasRedirect = result.page.redirect
    let text = !hasRedirect && result.page.revision[0].text[0]
    let matches = text && text._.match(pattern)
    if(matches){
      var title = result.page.title[0];
      var id = result.page.id[0];
      var outFileName = id;
      var outPath = `${outFolder}/${outFileName}.xml`;
      fs.writeFileSync(outPath, xml);
      updateSkip()
      console.log(`wrote: "${title}" to "${outPath}" `)
    } else {
      if((counter - lastPrinted) > 1000) {
        updateSkip()
      }
    }
  });
});

fileStream.pipe(saxParser);
