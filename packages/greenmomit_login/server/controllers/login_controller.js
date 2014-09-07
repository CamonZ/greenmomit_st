'use strict';

var jsSHA = require('jssha'),
    http = require('http');


var API_URL='https://apist.greenmomit.com';

function sha1EncryptPassword(loginToken){
  var shaObj = new jsSHA(process.env.USER_PASSWORD, 'TEXT');
  shaObj.getHash('SHA-1', 'HEX');
  var hmac = shaObj.getHMAC(loginToken, 'TEXT', 'SHA-1', 'HEX');
  return hmac;
}

function loginOptions(URL){
  return {
    hostname: API_URL,
    port: 8443,
    path: URL,
    method: 'POST'
  };
}

function getSessionToken(loginToken, hashedPassword, res){
  var SESSION_TOKEN_URL = '/momitst/webserviceapi/user/loginToken?loginToken=' + 
    loginToken +
    '&password=' +
    hashedPassword;

    var sessionTokenRequest = http.request(
      loginOptions(SESSION_TOKEN_URL),
      function(response){
        var parsedResponse = JSON.parse(response);
        if(parsedResponse.result === '200'){
          res.json({sessionToken: parsedResponse.data.sessionToken, loginToken: loginToken, email: parsedResponse.email});
        }
      }
    );
    sessionTokenRequest.end();
}


function getLoginToken(res){
  var CONNECT_TOKEN_URL = '/momitst/webserviceapi/user/connect?email=' + process.env.USER_EMAIL;

  var loginTokenRequest = http.request(
    loginOptions(CONNECT_TOKEN_URL),
    function(response){
      var parsedResponse = JSON.parse(response);
      if(parsedResponse.result === '200'){
        var userLoginToken = parsedResponse.data.loginToken;
        var hashedPassword = sha1EncryptPassword(userLoginToken);
        getSessionToken(userLoginToken, hashedPassword, res);
      }
    }
  );
  loginTokenRequest.end();
}



exports.loginUser = function(req, res){
  getLoginToken(res);
};