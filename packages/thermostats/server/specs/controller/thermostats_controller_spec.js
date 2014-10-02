'use strict';

var config = require('meanio').loadConfig(),
    clearDB = require('mocha-mongoose')(config.db, {noClear: true});


var request = require('request'),
    chai = require('chai'),
    util = require('../util/thermostatUtils');


describe('ThermostatsController', function(){
  beforeEach(function(done){ clearDB(done); });

  describe('index', function(){
    describe('when there are no thermostats in the system', function(){
      it('should return an empty array', function(done){
        request.get({url: util.thermostatsURL(), json: true}, function(err, resp, body){
          if(err) done(err);
          chai.expect(body).to.eql([]);
          done();
        });
      });
    });

    describe('when there\'re thermostats in the system', function(){
      it('should return an array of thermostats', function(done){
        util.sampleThermostat().save(function(error, doc){
          if(error) done(error);
          request.get({url: util.thermostatsURL(), json: true}, function(err, resp, body){
            if(err) done(err);
            chai.expect(body).to.eql([util.serialize(doc._doc)]);
            done();
          });
        });
      });
    });
  });

  describe('show', function(){
    describe('when there\'s a thermostat with the given id in the db', function(){
      it('should return the thermostat', function(done){
        util.sampleThermostat().save(function(error, doc){
          if(error) done(error);
          request.get(
            {url: util.thermostatURL(doc._doc._id), json: true}, 
            function(err, resp, body){
              if(err) done(err);
              chai.expect(body).to.eql(util.serialize(doc._doc));
              done();
          });
        });
      });
    });

    describe('when there\'s no thermostat with the given id in the db', function(){
      it('should return a 404 and an empty hash', function(done){
        request.get(
          {url: util.thermostatURL('41224d776a326fb40f000001'), json: true}, 
          function(err, resp, body){
            chai.expect(resp.statusCode).to.eql(404);
            chai.expect(body).to.eql({});
            done();
          });
      });
    });
  });

  describe('historic_measurements', function(){
    describe('when there\'s a thermostat with the given id in the db', function(){
      describe('and there\'s measurements for the given thermostat', function(){
        it('should return the historic measurements', function(done){
          var thermostat = util.sampleThermostat();
          thermostat.save(function(err, doc){
            if(err) done(err);
            
            thermostat.addMeasurement(
              util.sampleMeasurementData(thermostat._id), 
              function(err, doc){
                if(err) done(err);
                
                request.get(
                  {url: util.thermostatMeasurementsURL(thermostat._id), json: true}, 
                  function(err, resp, body){
                    if(err) done(err);
                    chai.expect(body).to.eql([util.serialize(doc._doc)]);
                    done();
                  });
              }
            );
          });
        });
      });
      describe('and there\'s no measurements for the given thermostat', function(){
        it('should return a 404 and an empty array', function(done){
          var thermostat = util.sampleThermostat();
          thermostat.save(function(err, doc){
            if(err) done(err);
            request.get(
              {url: util.thermostatMeasurementsURL(thermostat._id), json: true}, 
              function(err, resp, body){
                chai.expect(resp.statusCode).to.eql(404);
                chai.expect(body).to.eql([]);
                done();
              });
            });
        });
      });
    });

    describe('when there\'s no thermostat with the given id in the db', function(){
      it('should return a 404 and an empty array', function(done){
        request.get(
          {url: util.thermostatMeasurementsURL('41224d776a326fb40f000001'), json: true}, 
          function(err, resp, body){
            chai.expect(resp.statusCode).to.eql(404);
            chai.expect(body).to.eql([]);
            done();
          });
      });
    });
  });
});

