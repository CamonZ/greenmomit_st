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
  Thermostat.findById(req.params.thermostatId, function(err, doc){
    if(err !== null || doc === null) res.status(404).send({});
    else res.json(doc);
  });
};

exports.historic = function(req, res){
  var query = ThermostatMeasurement.find({thermostatId: req.params.thermostatId}).limit(20); //return the last 20 measurements
  query.exec(function(err, docs){
    if(docs.length !== 0) res.json(docs);
    else res.status(404).send([]);
  });
};