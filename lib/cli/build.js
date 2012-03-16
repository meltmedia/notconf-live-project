var flatiron = require('flatiron'),
    path = require('path'),
    spawn = require('child_process').spawn,
    fs = require('fs'),
    app = flatiron.app;

var submissionPath = path.join(__dirname,'..', '..', 'submissions');

module.exports = function build(username) {

  var p = path.join(submissionPath, username);

  app.log.info('Checking submission.');
  path.exists(p,
    function(exists) {
      if(exists) {
        app.log.info('Submission exists, archiving.');

        process.chdir(p);
        try {
          fs.mkdirSync('../../build');
        } catch (x) {
          //ignore errors, dir is already there
        }

        var zip = spawn('zip', ['-r', '../../build/'+username, '.']);

        zip.stdout.on('data', function (data) {
          app.log.debug(data);
        });

        zip.stderr.on('data', function (data) {
          app.log.error(data);
        });

        zip.on('exit', function (code) {
          if(code !== 0) {
            app.log.error('Did not finish build. Something happened.');
          } else {
            app.log.info('Completed build.');
          }
        });

      } else {
        app.log.error("Submission doesn't exist. Exiting.");
      }
  });

};

module.exports.usage = [
  'yeehaw build <submission to build>'
];