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

exports.sampleMeasurementData = function(thermostatId){
  var measurementFile = __dirname + '/../model/sampleMeasurement.json', data;
  data = JSON.parse(fs.readFileSync(measurementFile, 'utf8'));
  data.recordTime = new Date(data.recordTime);
  data.thermostatId = thermostatId;
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

exports.thermostatURL = function(thermostatId){
  return this.thermostatsURL() + thermostatId + '/';
};

exports.thermostatMeasurementsURL = function(thermostatId){
  return this.thermostatURL(thermostatId) + 'historic_temperatures';
};

exports.serialize = function(object){
  return JSON.parse(JSON.stringify(object));
};