var path  = require('path');
var fs    = require('fs');
var acorn = require('acorn');

var files = ['simple', 'intersection'];

module.exports = files.reduce(function(res, file) {
  var filePath, contents;
  filePath = path.resolve(__dirname, file + '.js');
  contents = fs.readFileSync(filePath, {encoding: 'utf8'});
  res[file] = acorn.parse(contents);
  return res;
}, {});
