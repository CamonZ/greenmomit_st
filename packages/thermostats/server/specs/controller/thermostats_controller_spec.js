'use strict';

var config = require('meanio').loadConfig(),
    clearDB = require('mocha-mongoose')(config.db, {noClear: true});


var request = require('request'),
    async = require('async'),
    chai = require('chai'),
    util = require('../util/thermostatUtils'),
    nodeUtil = require('util');


describe('ThermostatsController', function(){
  beforeEach(function(done){
    clearDB(done);
  });

  describe('#index', function(){
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
        var thermostat = util.sampleThermostat();
        thermostat.save(function(error, doc){
          if(error) done(error);
          var expected = JSON.parse(JSON.stringify(doc._doc));
          request.get({url: util.thermostatsURL(), json: true}, function(err, resp, body){
            if(err) done(err);
            chai.expect(body).to.eql([expected]);
            done();
          });
        });
      });
    });
  });
});

