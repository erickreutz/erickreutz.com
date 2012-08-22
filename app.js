var express = require('express'),
    gzippo = require('gzippo');

var app;
var path = __dirname;

exports.boot = function() {
  app = express.createServer();

  bootApplication(app);

  app.get('*', function(req, res) {
    res.sendfile(path + '/public/index.html');
  });

//  app.get('*', function(req, res) { res.sendfile(path + '/public/error.html'); });

  return app;
}

function bootApplication(app) {
  app.use(gzippo.staticGzip(path + '/public'));

  app.use(function(req, res, next) {
    if (req.headers.host.match(/usefabric.com/) && req.headers.host.slice(0, 3) != 'www') {
        res.redirect('http://www.' + req.headers.host + req.url, 301);
    } else {
      next();
    }
  });
};

exports.startServer = function(port, path, callback) {
  exports.boot().listen(port, function() {
    console.log('listening on port %s', port);
  });
}

if (!module.parent) {
  var port = process.env.PORT || 3332;
  exports.boot().listen(port, function() {
    console.log('listening on port %s', port);
  });
}