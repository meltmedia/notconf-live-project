var flatiron = require('flatiron'),
    path = require('path'),
    spawn = require('child_process').spawn,
    http = require('http'),
    nconf = require('nconf'),
    fs = require('fs'),
    app = flatiron.app;

var buildPath = path.join(__dirname,'..', '..', 'build');

module.exports = function deploy(username) {

  nconf.file({file: "config/config.json"});
  var token = nconf.get('token');

  function prepareFile(filePath, stats) {
    var boundary = Math.floor(Math.random()*100000000),
        requestHeader, contentHeader;

    requestHeader = {
      'x-token': token,
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
        buildFailed = false,
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
            if(res.statusCode >= 200 && res.statusCode <= 399) {
              app.log.info('Build deployed successfully.');
            } else {
              buildFailed = true;
              app.log.error('Build deployment failed.');
            }

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

        if(!buildFailed) {
          app.log.info('Build sent.');
        }

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