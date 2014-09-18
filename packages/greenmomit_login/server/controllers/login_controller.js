'use strict';

var greenMomitLogin = require('../../../greenmomit_api/server/models/login');




exports.loginUser = function(req, res){

  var asyncLoginResponseHandler = function(data){ res.json(data); }

  greenMomitLogin.beginLoginProcess(asyncLoginResponseHandler);
};