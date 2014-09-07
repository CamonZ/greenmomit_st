'use strict';

var request = require('request'),
    _ = require('lodash');

var BASE_API_URL='https://apist.greenmomit.com:8443';

function thermostatOptions(ACTION_URL, queryString){
  return {
    url: BASE_API_URL + ACTION_URL,
    qs: queryString,
    method: 'GET'
  };
}


function getThermostats(sessionToken, res){
  var THERMOSTATS_URL = '/momitst/webserviceapi/user/' +
    sessionToken + '/thermostats';

  var thermostatsRequest = request(
    thermostatOptions(THERMOSTATS_URL, {}),
    function(error, response, body){
      if(response.statusCode === 200){


        var parsedResponse = JSON.parse(body);

        if(parsedResponse.result === 200){
          var thermostats = {};
          _.each(parsedResponse.datas, function(t){ thermostats[t.name] = t; });
          res.json(thermostats);
        }
      }
      else{
        res.json(error);
      }
    }
  );
}

exports.index = function(req, res){
  console.log(JSON.stringify(req.query));
  getThermostats(req.query.sessionToken, res);
};