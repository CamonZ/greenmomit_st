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

function randomTemp(){
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
}

exports.index = function(req, res){
  console.log(JSON.stringify(req.query));
  getThermostats(req.query.sessionToken, res);
};

exports.show = function(req, res){
  res.json(randomData());
};