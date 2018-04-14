const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/mergedproblems/create', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));

  app.use('/mergedproblems/edit/:mergedProblemId', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));

  app.use('/mergedproblems/remove/:mergedProblemId', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));
};
