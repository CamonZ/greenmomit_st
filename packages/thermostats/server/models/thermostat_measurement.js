'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var ThermostatMeasurementSchema = new Schema({
  thermostatId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  recordTime: {
    type: [Date],
    required: true
  },
  temperatureValue: {
    type: Number,
    required: true
  },
  humidityValue: {
    type: Number,
    required: true
  },
  relays: {
    type: Number,
    required: true
  },
  temperatureSetPointValue: {
    type: Number,
    required: true
  },
  tMinHeatValue: {
    type: Number,
    required: true
  },
  tMaxHeatValue: {
    type: Number,
    required: true
  },
  tMinColdValue: {
    type: Number,
    required: true
  },
  tMaxColdValue: {
    type: Number,
    required: true
  },
  workingModeValue: {
    type: Number,
    required: true
  },
  presenceModeTimeValue: {
    type: Number,
    required: true
  },
  useModeValue: {
    type: Number,
    required: true
  },
  tempUnitValue: {
    type: Number,
    required: true
  },
  temperature2Value: {
    type: Number,
    required: true
  },
  luminosityValue: {
    type: Number,
    required: true
  },
  hardwareStateValue: {
    type: Number,
    required: true
  },
  proximityValue: {
    type: Number,
    required: true
  },
  savingTimesValue: {
    type: Number,
    required: true
  },
  WiFi_RSSIValue: {
    type: Number,
    required: true
  },
  LCD_StateValue: {
    type: Number,
    required: true
  },
  stateValue: {
    type: Number,
    required: true
  },
  Usual_Night_LuminosityValue: {
    type: Number,
    required: true
  },
  WifiVersionValue: {
    type: Number,
    required: true
  }
});

//compound index based on thermostatId and the recordTime
ThermostatMeasurementSchema.index({thermostatId: 1, recordTime: -1});

module.exports = mongoose.model('ThermostatMeasurement', ThermostatMeasurementSchema);
