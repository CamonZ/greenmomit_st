'use strict';

require('../../models/thermostat.js');

var fs = require('fs'),
    mongoose = require('mongoose'),
    config = require('meanio').loadConfig(),
    Thermostat = mongoose.model('Thermostat');

exports.sampleThermostatData = function(){
  var thermostatFile = __dirname + '/../model/sampleThermostat.json', data;
  data = JSON.parse(fs.readFileSync(thermostatFile, 'utf8'));
  data.lastConnection = new Date(data.lastConnection);
  return data;
};

exports.sampleMeasurementData = function(){
  var measurementFile = __dirname + '/../model/sampleMeasurement.json', data;
  data = JSON.parse(fs.readFileSync(measurementFile, 'utf8'));
  data.recordTime = new Date(data.recordTime);
  console.log('recordTime: ' + data.recordTime);
  return data;
};

exports.Thermostat = function(){
  return Thermostat;
};

exports.sampleThermostat = function(){
  return new Thermostat(this.sampleThermostatData());
};

exports.baseAppURL = function(){
  return 'http://localhost:' + config.http.port + '/';
};

exports.thermostatsURL = function(){
  return this.baseAppURL() + 'thermostats/';
};