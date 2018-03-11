module.exports = function ({ auth }) {
  return function (app) {
    app.service('authentication').hooks({
      before: {
        create: [
          auth.hooks.authenticate(['jwt', 'local']),
          context => {
            const {email, name, isBlocked} = context.params.user;
            const companyId = context.params.user['companyId'];
            const role = context.params.user.role;
            context.params.payload = context.params.payload || {};
            Object.assign(context.params.payload, {
              email,
              name,
              role,
              isBlocked,
              companyId,
            });
          },
        ],
        remove: [
          auth.hooks.authenticate('jwt')
        ]
      }
    });
  }
};
