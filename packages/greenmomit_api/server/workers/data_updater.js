'use strict';

require('../../../thermostats/server/models/thermostat');

var mongoose = require('mongoose'),
    apiLogin = require('../models/login'),
    apiThermostats = require('../models/thermostat'),
    Thermostat = mongoose.model('Thermostat'),
    ThermostatMeasurement = mongoose.model('ThermostatMeasurement'),
    _ = require('lodash'),
    async = require('async');



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

function properDate(dateString){
  return new Date(dateString.replace('UTC', 'Z'));
}



function localThermostatData(dataFromCollection, dataFromItem){
  var localData = {};

  _.forIn(thermostatAttributesMap, function(localKey, remoteKey, obj){ 
    localData[localKey] = dataFromCollection[remoteKey]; 
  });
  
  
  console.log('lastConnection: ' + properDate(dataFromCollection.lastConnection));

  localData.lastConnection = properDate(dataFromCollection.lastConnection);
  localData.lastTemperature = dataFromItem.data.record.temperatureValue;
  localData.lastHumidity = dataFromItem.data.record.humidityValue;
  localData.lastOutTemperature = dataFromItem.data.record.temperatureOutValue;
  localData.lastOutHumidity = dataFromItem.data.record.humidityOutValue;
  localData.parameters = dataFromItem.data.parameters;

  return localData;
}

function localMeasurementData(remoteData, thermostatId){
  var localData = {};
  _.forEach(measurementAttributes, function(key){ localData[key] = remoteData[key]; });

  localData.thermostatId = thermostatId;
  localData.recordTime = properDate(localData.recordTime);

  return localData;
}

function upsertMeasurement(thermostat, data, done){
  console.log('upserting the measurement data');
  var errorHandler = function(error){
    if(error){
      console.error(
        'error upserting the measurement for thermostat: ' +
        thermostat.greenMomitId +
        ' and recordTime: ' +
        measurementData.recordTime);
      done(error, '');
    }
    else{
      done(null, '');
    }
  };
  
  var measurementData = localMeasurementData(data.record, thermostat._id);
  var queryParams = {recordTime: measurementData.recordTime};
  var queryOptions = {upsert: true};

  ThermostatMeasurement.update(queryParams, measurementData, queryOptions, errorHandler);
}

function processDataFromCollection(dataFromCollection, loginData, done){
  apiThermostats.getThermostatDetails(loginData.sessionToken, dataFromCollection.id, function(dataFromThermostat){
    var thermostatData = localThermostatData(dataFromCollection, dataFromThermostat);
    
    Thermostat.findOneAndUpdate(
      {greenMomitId: thermostatData.greenMomitId},
      thermostatData,
      {upsert: true, new: true},
      function(error, thermostat){
        if(error === null || error === undefined && (thermostat._id !== null && thermostat._id !== undefined))
          upsertMeasurement(thermostat, dataFromCollection, done);
        else
          console.error('error updating the termostat with greenMomitId: ' + thermostatData.greenMomitId);
    });
  });
}


console.log('processing the data update');
apiLogin.beginLoginProcess(function(loginData){
  
  apiThermostats.getThermostats(loginData.sessionToken, function(thermostatsData){

    var functions = [];

    _.forEach(thermostatsData, function(dataFromCollection){
      functions.push(processDataFromCollection.bind(null, dataFromCollection, loginData));
    });

    async.parallel(functions, function(err, result){ process.exit(); });
  });
});
