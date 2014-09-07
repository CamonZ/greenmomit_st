'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var GreenmomitLogin = new Module('greenmomit_login');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
GreenmomitLogin.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  GreenmomitLogin.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  GreenmomitLogin.menus.add({
    title: 'greenmomitLogin example page',
    link: 'greenmomitLogin example page',
    roles: ['authenticated'],
    menu: 'main'
  });

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    GreenmomitLogin.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    GreenmomitLogin.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    GreenmomitLogin.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return GreenmomitLogin;
});
