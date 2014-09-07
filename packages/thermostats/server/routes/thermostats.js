'use strict';

var thermostatsController = require('../controllers/thermostats_controller');

// The Package is past automatically as first parameter
module.exports = function(Thermostats, app, auth, database) {
  app.route('/thermostats').get(thermostatsController.index);
};
