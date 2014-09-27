'use strict';

var config = require('meanio').loadConfig();

require('mocha-mongoose')(config.db);

var mongoose = require('mongoose'),
    Thermostat = mongoose.model('Thermostat'),
    chai = require('chai'),
    sharedMeasurementSpecs = require('./thermostat_measurements_finders_shared_spec.js');

describe('Models', function(){
  
  describe('Thermostat', function(){
    
    describe('schema methods', function(){
      before(function(){ this.thermostat = new Thermostat({}); });

      describe('.measurements', function(){
        before(function(){ this.measurements = this.thermostat.measurements(); });
        
        sharedMeasurementSpecs.shouldBehaveLikeACollectionOfMeasurementsOfAThermostat();

      });

      describe('.measurementsFromToDate', function(){
        var startDate = '2013-09-27T00:00:00.000Z', endDate = '2014-09-26T00:00:00.000Z';
        before(function(){
          this.measurements = this.thermostat.measurementsFromToDate(startDate, endDate);
        });

        sharedMeasurementSpecs.shouldBehaveLikeACollectionOfMeasurementsOfAThermostat();
        
        it('should have the startDate and endDate as a range search in the query conditions', function(){
          chai.expect(this.measurements._conditions.recordTime.$gte.toISOString()).to.eq(startDate);
          chai.expect(this.measurements._conditions.recordTime.$lt.toISOString()).to.eq(endDate);
        });
      });
    });

    describe('.save', function(){
      it('should exist', function(){
        var thermostat = new Thermostat({});
        chai.expect(thermostat).to.be.an.instanceof(Thermostat);
      });
    });
  });
});

