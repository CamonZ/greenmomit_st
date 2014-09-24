'use strict';

var mongoose = require('mongoose'),
    Thermostat = mongoose.model('Thermostat'),
    ThermostatMeasurement = mongoose.model('ThermostatMeasurement');

exports.index = function(req, res){
  Thermostat.find({}, function(err, docs){
    res.json(docs);
  });
};

exports.show = function(req, res){
  Thermostat.findOne({_id: req.params.thermostatId}, function(err, doc){
    res.json(doc);
  });
};

exports.historic = function(req, res){
  var query = ThermostatMeasurement.find({thermostatId: req.params.thermostatId}).limit(20); //return the last 20 measurements
  query.exec(function(err, docs){
    res.json(docs);
  });
  
};

function getDayDate(hour, min, sec, milli){
  var d = new Date();
  d.setHours(hour, min, sec, milli);
  return d;
}

function startOfToday(){ return getDayDate(0, 0, 0, 0); }
function endOfToday(){ return getDayDate(23, 59, 59, 999); }
