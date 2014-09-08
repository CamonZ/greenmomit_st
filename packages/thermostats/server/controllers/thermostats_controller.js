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


function getThermostats(sessionToken, res){
  var THERMOSTATS_URL = '/momitst/webserviceapi/user/' +
    sessionToken + '/thermostats';

  request(
    thermostatOptions(THERMOSTATS_URL, {}),
    function(error, response, body){
      if(response.statusCode === 200){


        var parsedResponse = JSON.parse(body);

        if(parsedResponse.result === 200){
          res.json(parsedResponse.datas);
        }
      }
      else{
        res.json(error);
      }
    }
  );
}

function getThermostatDetails(sessionToken, thermostatId, res){
  var THERMOSTAT_URL = '/momitst/webserviceapi/thermostat/' + thermostatId;

  request(
    thermostatOptions(THERMOSTAT_URL, {session: sessionToken}),
    function(error, response, body){
      console.log('got a response from the server for the termostat: ' + thermostatId);
      console.log('statusCode was: ' + response.statusCode);
      if(response.statusCode === 200){
        var parsedResponse = JSON.parse(body);
        console.log('response result was: ' + parsedResponse.result);
        if(parsedResponse.result === 200) { res.json(parsedResponse.data);}
        else{
          console.log('error in result, response was: ' + body);
          res.json({});
        }
      }
      else{
        console.log('error was: ' + JSON.Stringify(error));
        res.json(error);
      }
    }
  );
}

/*function randomTemp(){
  var rand = Math.random();
  rand = rand > 0.2 ? 1 - rand : rand;
  return (20*(1 + rand));
}

function randomData(){
  return [
    {timestamp: '2014-09-07', temp: randomTemp()},
    {timestamp: '2014-09-06', temp: randomTemp()},
    {timestamp: '2014-09-05', temp: randomTemp()},
    {timestamp: '2014-09-04', temp: randomTemp()},
    {timestamp: '2014-09-03', temp: randomTemp()},
    {timestamp: '2014-09-02', temp: randomTemp()},
    {timestamp: '2014-09-01', temp: randomTemp()},
    {timestamp: '2014-08-31', temp: randomTemp()},
    {timestamp: '2014-08-30', temp: randomTemp()}];
}*/

exports.index = function(req, res){
  console.log(JSON.stringify(req.query));
  getThermostats(req.query.sessionToken, res);
};

exports.show = function(req, res){
  getThermostatDetails(
    req.query.sessionToken,
    req.params.thermostatId,
    res);
};

exports.historic = function(req, res){
  res.json([]);
}