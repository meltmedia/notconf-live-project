var express = require('express');
var app = express.createServer();
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.redirect('index.html');
});

app.listen(2486);
console.log("listening on localhost:2486");