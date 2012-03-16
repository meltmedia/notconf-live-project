var flatiron = require('flatiron'),
    path = require('path'),
    https = require('https'),
    fs = require('fs'),
    wrench = require('wrench'),
    app = flatiron.app;

var submissionPath = path.join(__dirname,'..', '..', 'submissions'),
    userdata = {};

module.exports = function create(username, baseUsername, callback) {
  var source = 'source';
  if(baseUsername) {
    source = path.join(submissionPath, baseUsername);
    path.exists(source, function(exists) {
      app.log.warn('User '+baseUsername+' does not have a submission. Defaulting to source.');
      source = path.join(submissionPath, '..', 'source');
    });
  }

  app.log.info('Validating Github Username:', username);

  https.get({
    hostname: 'api.github.com',
    path: '/users/'+username
  }, function(res) {
    if(res.statusCode === 200) {
      res.setEncoding('utf8');
      var buffer = [];
      res.on('data', function(chunk) {
        buffer.push(chunk);
      });

      res.on('end', function() {
        userdata = JSON.parse(buffer.join(''));

        app.log.info('Creating project for:', userdata.name + ' ('+ userdata.login +')');

        var dest = path.join(submissionPath, userdata.login);
        wrench.copyDirSyncRecursive(source, dest);

        var count = 0;
        function finishCallback() {
          count++;
          if(count === 3) {
            app.log.info('Finished creating project.');
          }
        }

        // Update submission contributors
        app.log.info('Updating submission contributors.');

        fs.readFile(dest+'/CONTRIBUTORS',
          function(err, data) {
            if(err) throw err;
            var store = data.toString('utf8');
            store = userdata.name + " http://github.com/" + userdata.login + "\r\n" + store;
            fs.writeFile(dest+'/CONTRIBUTORS', store, 'utf8',
              function(err) {
                if(err) throw err;
                app.log.info('Updated submission contributors.');
                finishCallback();
              });
        });

        // Update submission readme
        app.log.info('Updating submission readme.');

        var readme = "#Good luck!";

        fs.writeFile(dest+'/readme.md', readme, 'utf8',
          function(err) {
            if(err) throw err;
            app.log.info('Updated submission readme.');
            finishCallback();
        });

        // Update global contributors
        app.log.info('Updating global contributors.');

        var file = path.join(__dirname, '..', '..', 'CONTRIBUTORS');
        fs.readFile(file,
          function(err, data) {
            if(err) throw err;
            var store = data.toString('utf8');
            store = userdata.name + " http://github.com/" + userdata.login + "\r\n" + store;

            fs.writeFile(file, store, 'utf8',
              function(err) {
                if(err) throw err;
                app.log.info('Updated global contributors.');
                finishCallback();
              });
        });

      });
    } else {
      app.log.error('Invalid Github username:', username);
    }

  });

};

module.exports.usage = [
  'yeehaw create <github username> <github username to start from>'
];