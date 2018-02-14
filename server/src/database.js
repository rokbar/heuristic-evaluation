const knex = require('knex');
const { connection } = require('./config');

module.exports = (function() {
  return knex({
    client: 'mysql',
    connection,
  });
})();
