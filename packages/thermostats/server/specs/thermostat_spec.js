'use strict';

var config = require('meanio').loadConfig();

require('mocha-mongoose')(config.db);

var mongoose = require('mongoose'),
    Thermostat = mongoose.model('Thermostat'),
    expect = require('chai').expect;

describe('Models', function(){
  describe('Thermostat', function(){
    beforeEach(function(done){done();});
    describe('.save', function(){
      it('should exist', function(){
        var thermostat = new Thermostat({name: 'test'});
        expect(thermostat).to.be.an.instanceof(Thermostat);
      });
    });
  });
});

