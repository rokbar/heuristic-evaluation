const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/problemphotos', knex({
    Model: db,
    name: 'problemphoto',
    id: 'id',
  }));
};
