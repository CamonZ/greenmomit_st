'use strict';

// The Package is past automatically as first parameter
module.exports = function(GreenmomitLogin, app, auth, database) {
  app.route('/greenmomit_login/').get(loginController.loginUser)
};
