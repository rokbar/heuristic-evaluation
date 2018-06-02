const knex = require('feathers-knex');

const db = require('../database');
const { teamState } = require('../utils/enums');

module.exports = {
  hasTeamNotStartedEvaluation(teamId) {
    return db.select(
      'team.id',
      'team.state',
    )
      .from('team')
      .where('team.id', teamId)
      .then(response => response && response.state === teamState.new)
      .catch((err) => {
        throw new Error('Įvyko klaida');
      });
  }
};

