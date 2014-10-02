'use strict';

var config = require('meanio').loadConfig(),
    clearDB = require('mocha-mongoose')(config.db, {noClear: true});

var mongoose = require('mongoose'),
    Thermostat = mongoose.model('Thermostat'),
    chai = require('chai'),
    sharedMeasurementSpecs = require('./thermostat_measurements_finders_shared_spec.js'),
    util = require('../util/thermostatUtils'),
    nodeUtil = require('util');

describe('Models', function(){
  beforeEach(function(done){ clearDB(done); });

  describe('Thermostat', function(){
    beforeEach(function(done){
      this.sampleThermostat = new Thermostat(util.sampleThermostatData());
      this.sampleThermostat.save(function(err, doc){
        if(err){ done(err); }
        done();
      });
    });

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

      describe('.addMeasurement', function(){
        it('should add a measurement to the thermostat', function(done){
          var that = this, 
              callback = function(err, measurement){
                if(err) done(err);
                chai.expect(measurement.thermostatId).to.eq(that.sampleThermostat._id);
                done();
              };

          this.sampleThermostat.addMeasurement(util.sampleMeasurementData(), callback);
        });
      });
    });

    describe('when saving a thermostat', function(){
      beforeEach(function(done){ clearDB(done); });

      describe('if there\'s no thermostats with the same greenMomitId', function(){
        it('should be able to save the new thermostat', function(done){
          var thermostat = new Thermostat(util.sampleThermostatData());
          thermostat.save(function(err, doc){
            if(err) 
              done(err);
            chai.expect(thermostat.isNew).to.be.false;
            done();
          });
        });
      });

      describe('if there\'s a thermostat with the same greenMomitId', function(){
        it('should not be able to save the new thermostat', function(done){
          var thermostat = util.sampleThermostat();
          thermostat.save(function(err, doc){
            if(err) done(err);

            var otherThermostat = util.sampleThermostat();
            otherThermostat.save(function(err, doc){
              chai.expect(err).to.not.be.null;
              chai.expect(err.code).to.eql(11000);
              chai.expect(doc).to.be.undefined;
              done();
            });
          });
        });
      });
    });
  });
});

