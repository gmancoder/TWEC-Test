var express = require('express')
  , poweredBy = require('connect-powered-by');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var static = require('serve-static');

module.exports = function() {
  // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
  // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
  // middleware available as separate modules.
  if ('development' == this.env) {
    var logger = require('morgan');
    this.use(logger("default"));
  }

  this.use(poweredBy('Locomotive'));
  //this.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  this.use(static(__dirname + '/../../public'));
  this.use(bodyParser.urlencoded({extended: false}));
  this.use(methodOverride());
  this.use(this.router);
  this.use(errorHandler());
}