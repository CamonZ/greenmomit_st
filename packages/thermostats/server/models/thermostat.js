'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Measurement = require('./thermostat_measurement');


var ThermostatSchema = new Schema({
  greenMomitId: {
    type: String,
    required: true
  },
  greenMomitType: {
    type: Number,
    required: true
  },
  greenMomitUserId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  alarms: {
    type: Number,
    required: true
  },
  shared: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  invited: {
    type: Boolean,
    required: true
  },
  active: {
    type: Number,
    required: true
  },
  connected: {
    type: Boolean,
    required: true
  },
  lastConnection: {
    type: Date,
    require: true
  },
  lastTemperature: {
    type: Number,
    required: true
  },
  lastHumidity: {
    type: Number,
    required: true
  },
  lastOutTemperature: {
    type: Number,
    required: true
  },
  lastOutHumidity: {
    type: Number,
    required: true
  },  
  parameters:{}
});

ThermostatSchema.index({greenMomitId: 1}, {unique: true, safe: true});

ThermostatSchema.methods = {
  //just return the query on the assoc so I can execute it on the caller.
  measurements: function(){
    return Measurement.find({thermostatId: this._id});
  },
  measurementsFromToDate: function(startDate, endDate){
    return this.measurements().where({recordTime: {$gte: new Date(startDate), $lt: new Date(endDate)}});
  },
  addMeasurement: function(measurementData, done){
    measurementData.thermostatId = this._id;
    var measurement = new Measurement(measurementData);
    measurement.save(function(err, doc){
      if(err){ done(err, null); }
      else{ done(err, doc);}
    });
  }
};

module.exports = mongoose.model('Thermostat', ThermostatSchema);
