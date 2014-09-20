'use strict';

var request = require('request');

var BASE_API_URL='https://apist.greenmomit.com:8443';

function thermostatOptions(ACTION_URL, queryString){
  return {
    url: BASE_API_URL + ACTION_URL,
    qs: queryString,
    method: 'GET'
  };
}

exports.getThermostats = function(sessionToken, done){
  var THERMOSTATS_URL = '/momitst/webserviceapi/user/' +
    sessionToken + '/thermostats';

  request(
    thermostatOptions(THERMOSTATS_URL, {}),
    function(error, response, body){
      if(response.statusCode === 200){


        var parsedResponse = JSON.parse(body);

        if(parsedResponse.result === 200){
          done(parsedResponse.datas);
        }
      }
      else{
        done(error);
      }
    }
  );
};

exports.getThermostatDetails = function(sessionToken, thermostatId, done){
  var THERMOSTAT_URL = '/momitst/webserviceapi/thermostat/' + thermostatId;

  request(
    thermostatOptions(THERMOSTAT_URL, {session: sessionToken}),
    function(error, response, body){
      if(response.statusCode === 200){

        var parsedResponse = JSON.parse(body);

        if(parsedResponse.result === 200) { done(parsedResponse.data);}
        else{
          console.log('error in result, response was: ' + body);
          done(error);
        }
      }
      else{
        console.log('error was: ' + JSON.Stringify(error));
        done(error);
      }
    }
  );
};