'use strict';

var jsSHA = require('jssha'),
    request = require('request');


var BASE_API_URL='https://apist.greenmomit.com:8443';

function sha1EncryptPassword(loginToken){
  var shaObj = new jsSHA(process.env.USER_PASSWORD, 'TEXT');
  shaObj.getHash('SHA-1', 'HEX');
  var hmac = shaObj.getHMAC(loginToken, 'TEXT', 'SHA-1', 'HEX');
  return hmac;
}

function loginOptions(ACTION_URL, queryString){
  return {
    url: BASE_API_URL + ACTION_URL,
    qs: queryString,
    method: 'POST'
  };
}

function getSessionToken(loginToken, hashedPassword, res){
  var SESSION_TOKEN_URL = '/momitst/webserviceapi/user/loginToken';

    var sessionTokenRequest = request(
      loginOptions(SESSION_TOKEN_URL, {loginToken: loginToken, password: hashedPassword}),
      function(error, response, body){

        if(response.statusCode === 200){

          var parsedResponse = JSON.parse(body);
          if(parsedResponse.result === 200){
            res.json({sessionToken: parsedResponse.data.sessionToken, loginToken: loginToken, email: parsedResponse.email});
          }
        }
        else{
          res.json(error);
        }
      }
    );
    sessionTokenRequest.end();
}


function getLoginToken(res){
  var CONNECT_TOKEN_URL = '/momitst/webserviceapi/user/connect';

  var opts = loginOptions(CONNECT_TOKEN_URL, {email: process.env.USER_EMAIL});

  console.log('options: ' + JSON.stringify(opts));

  var loginTokenRequest = request(opts, function(error, response, body){
      if(response.statusCode === 200){

        var parsedResponse = JSON.parse(body);
        if(parsedResponse.result === 200){

          var userLoginToken = parsedResponse.data.loginToken;
          var hashedPassword = sha1EncryptPassword(userLoginToken);

          getSessionToken(userLoginToken, hashedPassword, res);
        }
      }
      else{
        res.json(error);
      }
    }
  );
  loginTokenRequest.end();
}



exports.loginUser = function(req, res){
  getLoginToken(res);
};