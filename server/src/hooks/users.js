const authHooks = require('feathers-authentication-hooks');
const bcrypt = require('bcryptjs');

const validateHook = require('../utils/validationHookWrapper');

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
      app.service('users/:userId/changePassword').hooks({
        before: {
          create: [
            (hook) => {
              const { newPassword, confirmPassword } = hook.data;
              return new Promise((resolve, reject) => {
                if (newPassword !== confirmPassword) reject(new Error('Patvirtinimo slaptažodis yra neteisingas.'));
                resolve(hook);
              });
            },
            local.hooks.hashPassword({passwordField: 'newPassword'}),
          ]
        }
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
            // TODO - let companyadmin to do only specific queries, evaluator - only leader can query his own team members
            authHooks.restrictToRoles({
              roles: ['systemadmin', 'companyadmin', 'evaluator'],
              fieldName: 'role',
              idField: 'id',
            }),
          ],
          get: [
            validateHook(authHooks.restrictToRoles({
              roles: ['systemadmin'],
              fieldName: 'role',
              idField: 'id',
              ownerField: 'id',
              owner: true,
            }), 'Neturite teisių peržiūrėti pasirinkto naudotojo duomenis.'),
          ],
          create: [
            authHooks.restrictToRoles({
              roles: ['systemadmin'],
              fieldName: 'role',
              idField: 'id',
            }),
          ],
          update: [
            authHooks.restrictToRoles({
              roles: ['systemadmin'],
              fieldName: 'role',
              idField: 'id',
            }),
          ],
          patch: [
            authHooks.restrictToRoles({
              roles: ['systemadmin'],
              fieldName: 'role',
              idField: 'id',
            }),
          ],
          remove: [
            authHooks.restrictToRoles({
              roles: ['systemadmin'],
              fieldName: 'role',
              idField: 'id',
            }),
          ],
        },
        // Make sure `password` never gets sent to the client
        after: local.hooks.protect('password'),
      });

      app.service('users/:userId/teams').hooks({
        before: {
          all: [
            auth.hooks.authenticate('jwt'),
          ],
          find: [
            authHooks.restrictToRoles({
              roles: ['evaluator'],
              fieldName: 'role',
              idField: 'id',
            }),
          ],
        },
        after: local.hooks.protect('password'),
      });

      app.service('users/:userId/editAccount').hooks({
        before: {
          all: [
            auth.hooks.authenticate('jwt'),
            (hook) => {
              return new Promise((resolve, reject) => {
                if (hook.params.user.id !== parseInt(hook.params.route.userId, 10)) reject(new Error('Veiksmas yra negalimas.'));
                return bcrypt.compare(hook.data.password, hook.params.user.password)
                  .then(result => {
                    if (result) {
                      resolve(hook);
                    } else {
                      throw new Error('Neteisingas slaptažodis.');
                    }
                  })
                  .catch(err => reject(err));
              });
            },
          ],
        },
        after: local.hooks.protect('password'),
      });

      app.service('users/:userId/changePassword').hooks({
        before: {
          all: [
            auth.hooks.authenticate('jwt'),
            (hook) => {
              return new Promise((resolve, reject) => {
                if (hook.params.user.id !== parseInt(hook.params.route.userId, 10)) reject(new Error('Veiksmas yra negalimas.'));
                return bcrypt.compare(hook.data.currentPassword, hook.params.user.password)
                  .then(result => {
                    if (result) {
                      resolve(hook);
                    } else {
                      throw new Error('Neteisingas slaptažodis.');
                    }
                  })
                  .catch(err => reject(err));
              });
            },
          ],
        },
        after: local.hooks.protect('password'),
      });
    }
  }
};
