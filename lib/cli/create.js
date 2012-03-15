var flatiron = require('flatiron'),
    path = require('path'),
    https = require('https'),
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

        app.log.info('Finished creating project.');
      });
    } else {
      app.log.error('Invalid Github username:', username);
    }

  });

};

module.exports.usage = [
  'yeehaw create <github username> <github username to start from>'
];