'use strict';

var greenMomitLogin = require('../../../greenmomit_api/server/models/login');

exports.loginUser = function(req, res){
  greenMomitLogin.beginLoginProcess(res);
};