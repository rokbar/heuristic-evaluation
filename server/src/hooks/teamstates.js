module.exports = function ({ auth }) {
  return function (app) {
    app.service('teamstates').hooks({
      before: {
        all: [
          auth.hooks.authenticate('jwt'),
        ],
        create: [() => { throw new Error('Not implemented') }],
        update: [() => { throw new Error('Not implemented') }],
        patch: [() => { throw new Error('Not implemented') }],
        remove: [() => { throw new Error('Not implemented') }],
      },
    });
  }
};
