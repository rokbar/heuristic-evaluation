const authHooks = require('feathers-authentication-hooks');

const { hasTeamNotStartedEvaluation } = require('../validations/teams');
const validateHook = require('../utils/validationHookWrapper');

// TODO - adjust restriction (separate leaders from evaluators)
module.exports = function ({ auth }) {
  return function (app) {
    app.service('evaluatorteam').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        find: [
          authHooks.restrictToOwner({
            idField: 'id',
            ownerField: 'evaluatorId',
          }),
        ],
        get: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
            ownerField: 'evaluatorId',
            owner: true,
          }),
        ],
        create: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        update: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
        ],
        patch: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
            ownerField: 'evaluatorId',
            owner: true,
          }),
        ],
        remove: [
          authHooks.restrictToRoles({
            roles: ['companyadmin'],
            fieldName: 'role',
            idField: 'id',
          }),
          validateHook(hasTeamNotStartedEvaluation, 'Negalima pašalinti vertintojo. Komanda yra pradėjusi vertinimą.'),
        ],
      },
      after: {
        create: [
          (hook) => {
            return new Promise((resolve, reject) => {
              hook.app.service('users')
                .get(hook.data.evaluatorId)
                .then(result => {
                  const { password, ...userData } = result;
                  hook.result.user = userData;
                  resolve(hook);
                })
                .catch(reject);
            });
          }
        ]
      }
    });
  }
};
