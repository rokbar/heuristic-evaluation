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
const auth = require('@feathersjs/authentication');
const local = require('@feathersjs/authentication-local');
const jwt = require('@feathersjs/authentication-jwt');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const usersHooks = require('./hooks/users');
const authenticationHooks = require('./hooks/authentication');
const channels = require('./channels');

const app = express(feathers());

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

app.configure(authenticationHooks(auth));
app.configure(usersHooks.hookHashPassword(local));

// This call must stay after hookHashPassword and before hookAuth.
app.service('users').find()
  .then((users) => {
    if (!users.length) {
      app.service('users').create({
        name: 'sysadmin',
        email: 'sysadmin@heuristic.heportal',
        password: 'sysadmin',
        systemAdmin_id: 1,
        role: 'systemadmin',
        lastLogon: new Date(),
      });
    }
  });

app.configure(usersHooks.hookAuth(auth, local));
app.hooks(appHooks);
app.configure(middleware.catchAndLogErrors);

module.exports = app;
