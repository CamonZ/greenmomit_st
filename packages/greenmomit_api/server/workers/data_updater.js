'use strict';

var mongoose = require('mongoose'),
    apiLogin = require('../models/login'),
    apiThermostats = require('../models/thermostat'),
    Thermostat = mongoose.model('Thermostat'),
    ThermostatMeasurement = mongoose.model('ThermostatMeasurement'),
    _ = require('lodash');

require('../../../thermostats/server/models/thermostat');


mongoose.connect(process.env.MONGOLAB_URI);

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

  _.forIn(thermostatAttributesMap, function(localKey, remoteKey, obj){ 
    localData[localKey] = remoteData[remoteKey]; 
  });
  
  localData.lastConnection = new Date(localData.lastConnection);
  return localData;
}

function localMeasurementData(remoteData, thermostatId){
  var localData = {};
  _.forEach(measurementAttributes, function(key){ localData[key] = remoteData[key]; });

  localData.thermostatId = thermostatId;
  localData.recordTime = new Date(localData.recordTime);
  return localData;
}

function upsertMeasurement(thermostat, data){
  console.log('upserting the measurement data');
  var errorHandler = function(error){
    if(error)
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
      
  console.log('processing the data update');

  apiLogin.beginLoginProcess(function(loginData){
    
    apiThermostats.getThermostats(loginData.sessionToken, function(thermostatsData){
      _.forEach(thermostatsData, function(data){
        
        var thermostatData = localThermostatData(data);
        
        Thermostat.findOneAndUpdate(
          {greenMomitId: thermostatData.greenMomitId},
          thermostatData,
          {upsert: true, new: true},
          function(error, thermostat){
            if(error !== null || error !== undefined)
              upsertMeasurement(thermostat, data);
            else
              console.error('error updating the termostat with greenMomitId: ' + thermostatData.greenMomitId);
        });
      });
    });
  });


}, 300000); // 300k ms or 5 mins

