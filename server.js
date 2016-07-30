var express = require('express');
var path = require('path');
var app = express();

app.use('/js', express.static(__dirname + '/js'));
//Store all HTML files in view folder.
app.use('/css', express.static(__dirname + '/css'));
//Store all JS and CSS in Scripts folder.
app.use('/pages', express.static(__dirname + '/pages'));
//Store all JS and CSS in Scripts folder.

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
