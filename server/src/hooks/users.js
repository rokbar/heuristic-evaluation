const authHooks = require('feathers-authentication-hooks');

module.exports = {
  // Add a hook to the user service that automatically replaces
  // the password with a hash of the password before saving it.
  hookHashPassword: function({ local }) {
    return function (app) {
      app.service('users').hooks({
        before: {
          create: [
            local.hooks.hashPassword({passwordField: 'password'})
          ]
        },
      });
    }
  },

  hookAuth: function ({ auth, local }) {
    return function (app) {
      app.service('users').hooks({
        before: {
          all: [
            auth.hooks.authenticate('jwt'),
          ],
          find: [
            authHooks.restrictToRoles({
              roles: ['systemadmin'],
              fieldName: 'role',
              idField: 'id',
            }),
          ],
          create: [
            authHooks.restrictToRoles({
              roles: ['systemadmin'],
              fieldName: 'role',
              idField: 'id',
            }),
          ]
        },
        // Make sure `password` never gets sent to the client
        after: local.hooks.protect('password'),
      });
    }
  }
};
