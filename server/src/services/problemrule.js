const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  // TODO - adjust role access and limit REST options
  app.use('/problemrule', knex({
    Model: db,
    name: 'problemrule',
    id: 'id',
  }));
};
