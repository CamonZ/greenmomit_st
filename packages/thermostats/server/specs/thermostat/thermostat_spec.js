'use strict';

var config = require('meanio').loadConfig();

require('mocha-mongoose')(config.db);

var mongoose = require('mongoose'),
    Thermostat = mongoose.model('Thermostat'),
    chai = require('chai'),
    sharedMeasurementSpecs = require('./thermostat_measurements_finders_shared_spec.js'),
    fs = require('fs');

describe('Models', function(){
  
  describe('Thermostat', function(){
    before(function(done){
      var that = this, thermostatFile = __dirname + '/sampleThermostat.json';

      fs.readFile(thermostatFile, 'utf8', function(err, data){
        if(err){ done(err); }
        else{
          that.parsedData = JSON.parse(data);
          that.parsedData.lastConnection = new Date(that.parsedData.lastConnection);
          that.sampleThermostat = new Thermostat(that.parsedData);
          that.sampleThermostat.save(function(err, doc){
            if(err) done(err);
            done();
          });
        }
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
        before(function(done){
          var that = this;
          var measurementFile = __dirname + '/sampleMeasurement.json';
          if(this.sampleThermostat !== undefined && 
             this.sampleThermostat !== null){
            
            fs.readFile(measurementFile, 'utf8', function(err, data){
              if(err) done('error reading sample measurement file');
              that.sampleMeasurementData = JSON.parse(data);
              that.sampleMeasurementData.recordTime = new Date(that.sampleMeasurementData.recordTime);
              done();
            });
          }
          else{
            done('Sample thermostat is not defined');
          }
        });

        it('should add a measurement to the thermostat', function(done){
          var that = this, callback = function(err, measurement){
            if(err) done(err);
            chai.expect(measurement.thermostatId).to.eq(that.sampleThermostat._id);
            done();
          };

          this.sampleThermostat.addMeasurement(this.sampleMeasurementData, callback);
        });
      });
    });

    describe('when saving a thermostat', function(){
      before(function(){
        //clear the db from the other thermostat.
        Thermostat.remove({}, function(err, docs){
          if(err) console.log('error clearing the database');
        });
      });

      it('should be able to save a new object', function(done){
        var thermostat = new Thermostat(this.parsedData);
        thermostat.save(function(err, doc){
          if(err) 
            done(err);
          chai.expect(thermostat.isNew).to.be.false;
          done();
        });
      });
    });
  });
});

