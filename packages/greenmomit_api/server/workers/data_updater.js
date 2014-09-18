'use strict';

var kue = require('kue'),
    url = require('url'),
    redis = require('kue/node_modules/redis'),
    mongoose = require('mongoose'),
    apiLogin = require('../models/login'),
    apiThermostats = require('../models/thermostat'),
    Thermostat = mongoose.model('Thermostat'),
    ThermostatMeasurement = mongoose.model('ThermostatMeasurement'),
    _ = require('lodash');


kue.redis.createClient = function() {
    var redisUrl = url.parse(process.env.REDISTOGO_URL),
        client = redis.createClient(redisUrl.port, redisUrl.hostname);
    if (redisUrl.auth) client.auth(redisUrl.auth.split(':')[1]);
    return client;
};

var jobs = kue.createQueue();

var thermostatAttributesMap = { 
  'id': 'greenMomitId',
  'type': 'greenMomitType',
  'userId': 'greenMomitUserId',
  'name': 'name',
  'alarms': 'alarms',
  'shared': 'shared',
  'address': 'address',
  'invited': 'invited',
  'active': 'active',
  'connected': 'connected',
  'lastConnection': 'lastConnection',
  'parameters': 'parameters'
};

var measurementAttributes = [
  'recordTime',
  'temperatureValue',
  'humidityValue',
  'relays',
  'temperatureSetPointValue',
  'tminHeatValue',
  'tmaxHeatValue',
  'tminColdValue',
  'tmaxColdValue',
  'workingModeValue',
  'presenceModeTimeValue',
  'useModeValue',
  'tempUnitValue',
  'temperature2Value',
  'luminosityValue',
  'hardwareStateValue',
  'proximityValue',
  'savingTimesValue',
  'WiFi_RSSIValue',
  'LCD_StateValue',
  'stateValue',
  'Usual_Night_LuminosityValue',
  'WifiVersionValue'
];


function localThermostatData(remoteData){
  var localData = {};
  _.forEachIn(thermostatAttributesMap, function(k, v){ localData[v] = remoteData[k]; });
  return localData;
}

function localMeasurementData(remoteData, thermostatId){
  var localData = {};
  _.forEach(measurementAttributes, function(key){ localData[key] = remoteData[key]; });
  localData.thermostatId = thermostatId;
  return localData;
}

function upsertMeasurement(thermostat, data){

  var errorHandler = function(error){
    console.error(
      'error upserting the measurement for thermostat: ' +
      thermostat.greenMomitId +
      ' and recordTime: ' +
      measurementData.recordTime);
  };

  var measurementData = localMeasurementData(data.record, thermostat._id);
  var queryParams = {recordTime: measurementData.recordTime};
  var queryOptions = {upsert: true};

  ThermostatMeasurement.update(queryParams, measurementData, queryOptions, errorHandler);
}


setInterval(function(){
  var job = jobs.create('updateThermostats', {});

  jobs.process('updateThermostats',
    function(job, done, ctx) {

      apiLogin.beginLoginProcess(function(loginData){

        apiThermostats.getThermostats(loginData.sessionToken, function(thermostatsData){

          _.forEach(thermostatsData, function(data){

            var thermostatData = localThermostatData(data);

            Thermostat.findOneAndUpdate(
              {greenMomitId: thermostatData.greenMomitId},
              thermostatData,
              {upsert: true},
              function(error, thermostat){
                if(error !== null || error !== undefined)
                  upsertMeasurement(thermostat, thermostatData);
                else
                  console.error('error updating the termostat with greenMomitId: ' + thermostatData.greenMomitId);
            });
          });
        });
      });
      done();
    }
  );
}, 300000); // 300k ms or 5 mins

