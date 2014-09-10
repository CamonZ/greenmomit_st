'use strict';

var greenMomitThermostats = require('../../../greenmomit_api/server/models/thermostat');

exports.index = function(req, res){
  greenMomitThermostats.getThermostats(req.query.sessionToken, res);
};

exports.show = function(req, res){
  greenMomitThermostats.getThermostatDetails(
    req.query.sessionToken,
    req.params.thermostatId,
    res);
};

exports.historic = function(req, res){
  res.json([]);
};