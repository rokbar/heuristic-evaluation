const knex = require('feathers-knex');

const db = require('../database');

module.exports = {
  canUserSeeHeuristics(hook) {
    const {params: {route: {heuristicId}, user: {id: userId}}} = hook;

    return db.select(
      'heuristic.id as heuristicId',
      'heuristic.isUnique',
    )
      .from('team')
      .leftJoin('evaluatorteam', 'team.id', '=', 'evaluatorteam.teamId')
      .leftJoin('heuristic', 'team.heuristicId', '=', 'heuristic.id')
      .where(function() {
        this.where('heuristicId', heuristicId).andWhere('evaluatorteam.evaluatorId', userId).orWhere('heuristic.isUnique', 0)
      })
      .groupBy('heuristicId')
      .then(response => response.some((heuristic) => heuristic.heuristicId === Number(heuristicId)))
      .catch((err) => {
        throw new Error('Įvyko nenumatyta serverio klaida.');
      });
  }
};
