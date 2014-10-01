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
      var thermostatFile = __dirname + '/sampleThermostat.json',
          data = fs.readFileSync(thermostatFile, 'utf8');

      this.parsedData = JSON.parse(data);
      this.parsedData.lastConnection = new Date(this.parsedData.lastConnection);
      this.sampleThermostat = new Thermostat(this.parsedData);

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
        before(function(done){
          var measurementFile = __dirname + '/sampleMeasurement.json', data;
          if(this.sampleThermostat !== undefined && 
             this.sampleThermostat !== null){
            
            data = fs.readFileSync(measurementFile, 'utf8');
            this.sampleMeasurementData = JSON.parse(data);
            this.sampleMeasurementData.recordTime = new Date(this.sampleMeasurementData.recordTime);
            done();
          }
          else{
            done('Sample thermostat is not defined');
          }
        });

        it('should add a measurement to the thermostat', function(done){
          var that = this, 
              callback = function(err, measurement){
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

