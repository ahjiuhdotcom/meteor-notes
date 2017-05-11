import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

// Andrew: Importing the file just sets up the callback.
// The callbacks won't be fired until a user is actually created.
import '../imports/api/user';
import '../imports/startup/simple-schema-configuration.js';

Meteor.startup(() => {
  // code to run on server at startup

});
