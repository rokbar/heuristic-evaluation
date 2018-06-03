const knex = require('feathers-knex');

const db = require('../database');
const {teamState} = require('../utils/enums');

module.exports = {
  hasTeamNotStartedEvaluation(hook) {
    const {params: {query: {teamId}}} = hook;
    return db.select(
      'team.id',
      'team.state',
    )
      .from('team')
      .where('team.id', teamId)
      .then(response => response && response.length && response[0].state === teamState.new)
      .catch(() => {
        throw new Error('Įvyko nenumatyta serverio klaida.');
      });
  }
};

