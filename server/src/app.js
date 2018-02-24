const Verifier = require('@feathersjs/authentication-jwt').Verifier;
const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const knex = require('feathers-knex');
const auth = require('@feathersjs/authentication');
const local = require('@feathersjs/authentication-local');
const jwt = require('@feathersjs/authentication-jwt');
const authHooks = require('feathers-authentication-hooks');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const app = express(feathers());
const db = require('./database');

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure jwt authentication middlewares
app.configure(auth({ secret: 'myverysupersecretstring' }));
app.configure(local());
app.configure(jwt());
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
// app.use(express.notFound());
app.use(express.errorHandler({ logger }));
function catchAndLogErrors(app) {
  return function (err, req, res, next) {
    res.json(err);
  };
}


app.hooks(appHooks);

app.use('/users', knex({
  Model: db,
  name: 'user',
  id: 'id',
}));

app.service('users').hooks({
  // Make sure `password` never gets sent to the client
  after: local.hooks.protect('password')
});

app.service('authentication').hooks({
  before: {
    create: [
      auth.hooks.authenticate(['jwt', 'local']),
      context => {
        const { email, name, isBlocked } = context.params.user;
        const companyId = context.params.user['company_id'];
        const role = context.params.user.typeSelector;
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

// Add a hook to the user service that automatically replaces
// the password with a hash of the password before saving it.
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
      local.hooks.hashPassword({ passwordField: 'password' })
    ]
  },
});




app.hooks({
  error(hook) {
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
});
app.use(catchAndLogErrors(app));


module.exports = app;
