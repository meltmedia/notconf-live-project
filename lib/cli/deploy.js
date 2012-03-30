var flatiron = require('flatiron'),
    path = require('path'),
    spawn = require('child_process').spawn,
    http = require('http'),
    fs = require('fs'),
    app = flatiron.app;

var buildPath = path.join(__dirname,'..', '..', 'build');

module.exports = function build(username) {

  function prepareFile(filePath, stats) {
    var boundary = Math.floor(Math.random()*100000000),
        requestHeader, contentHeader;

    requestHeader = {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': stats.size*1.5
    };

    contentHeader = '--' + boundary + '\r\n'
                  + 'Content-Disposition: file; name="upload"; filename="'+path.basename(filePath)+'"\r\n'
                  + 'Content-Type: application/octet-stream\r\n\r\n';

    contentHeader = new Buffer(contentHeader, 'ascii');

    streamFile(filePath, requestHeader, contentHeader, boundary);
  }

  function streamFile(filePath, requestHeader, contentHeader, boundary) {
    var req, stream, fileData = [],
        opts = {
          host: 'localhost',
          port: '3055',
          path: '/',
          method: 'POST',
          headers: requestHeader
        };

    req = http.request(opts,
      function(res) {
        res.on('data',
          function(chunk) {

          });

        res.on('end',
          function() {
            app.log.info('Build deployed successfully.');
          });

      });

    req.write(contentHeader);

    /**
     * Start streaming the file and send it as it comes in.
     */

    stream = fs.createReadStream(filePath, { encoding: 'binary' });
    stream.on('data',
      function(data) {
        req.write(new Buffer(data, 'binary'));
      });

    stream.on('end',
      function() {

        req.write(new Buffer("\r\n--" + boundary + "--", 'ascii'));
        req.end();
        app.log.info('Build sent.');
      });

  }

  var p = path.join(buildPath, username+'.zip');

  app.log.info('Checking build.');
  path.exists(p,
    function(exists) {
      if(exists) {

        fs.stat(p,
          function(err, stats) {
            prepareFile(p, stats);
          });

      } else {
        app.log.error('Build does not exist.');
      }
  });

};

module.exports.usage = [
  'yeehaw deploy <submission to deploy>'
];