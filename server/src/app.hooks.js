// Application hooks that run for every service
const logger = require('./hooks/logger');

module.exports = {
  before: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      // logger(),
      (hook) => {
        const err = hook.error;

        //change `hook.error` to the modified error
        hook.error = {
          message: err.message,
          name: err.name,
          code: err.code,
          className: err.className,
          info: err.info,
          data: err.data,
        };
      }
    ],
    find: [

    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
