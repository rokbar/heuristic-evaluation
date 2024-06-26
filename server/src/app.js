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

require('dotenv').config();

const middleware = require('./middleware');
const services = require('./services');

const appHooks = require('./app.hooks');
const authenticationHooks = require('./hooks/authentication');
const usersHooks = require('./hooks/users');
const companiesHooks = require('./hooks/companies');
const teamsHooks = require('./hooks/teams');
const teamStatesHooks = require('./hooks/teamstates');
const evaluatorTeamHooks = require('./hooks/evaluatorteam');
const heuristicsHooks = require('./hooks/heuristics');
const problemsHooks = require('./hooks/problems');
const problemRuleHooks = require('./hooks/problemrule');
const evaluatorProblemHooks = require('./hooks/evaluatorproblem');
const problemPhotoHooks = require('./hooks/problemphoto');
const imageUploadHooks = require('./hooks/imageupload');
const mergedProblemsHooks = require('./hooks/mergedproblems');
const ratingsHooks = require('./hooks/ratings');

const channels = require('./channels');
const initUser = require('./utils/initUser');

const app = express(feathers());

// Load app configuration
app.configure(configuration());

// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Host the public folder
app.use('/', express.static(app.get('public')));

if (process.env.NODE_ENV === 'production') {
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

// Set up Plugins and providers
app.configure(express.rest());

// Configure jwt authentication middlewares
app.configure(auth({ secret: process.env.JWT_SECRET }));
app.configure(local());
app.configure(jwt());

// Set up our services (see `services/index.js`)
app.configure(services);

// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
// app.use(express.notFound());
app.use(express.errorHandler({ logger }));

// Our services' hooks
app.configure(authenticationHooks({ auth }));
app.configure(usersHooks.hookHashPassword({ local }));
app.configure(companiesHooks({ auth }));
app.configure(teamsHooks({ auth, local }));
app.configure(teamStatesHooks({ auth }));
app.configure(evaluatorTeamHooks({ auth }));
app.configure(heuristicsHooks({ auth }));
app.configure(problemsHooks({ auth }));
app.configure(problemRuleHooks());
app.configure(evaluatorProblemHooks());
app.configure(problemPhotoHooks());
app.configure(imageUploadHooks());
app.configure(mergedProblemsHooks({ auth }));
app.configure(ratingsHooks({ auth }));

// This call must stay after hookHashPassword and before hookAuth.
app.configure(initUser);

app.configure(usersHooks.hookAuth({ auth, local }));
app.hooks(appHooks);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware.catchAndLogErrors);

module.exports = app;
