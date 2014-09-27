'use strict';

var chai = require('chai');

exports.shouldBehaveLikeACollectionOfMeasurementsOfAThermostat = function(){
  it('should return an object', function(){ 
    chai.expect(this.measurements).to.be.an('Object');
  });

  it('should have ThermostatMeasurement as the name of the model in the query conditions', function(){
    chai.expect(this.measurements.model.modelName).to.eq('ThermostatMeasurement');
  });

  it('should have the thermostat id as thermostatId in the query conditions', function(){
    chai.expect(this.measurements._conditions.thermostatId).to.eq(this.thermostat._id);
  });
};