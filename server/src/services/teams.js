const knex = require('feathers-knex');

const db = require('../database');
const { teamState } = require('../utils/enums');

module.exports = function (app) {
  app.use('/teams', knex({
    Model: db,
    name: 'team',
    id: 'id',
  }));

  app.use('/teams/:teamId/users', {
    find(params) {
      const teamId = params.route.teamId;
      return db.select('user.id', 'name', 'email', 'lastLogon', 'companyId', 'systemAdminId', 'role').from('user')
        .innerJoin('evaluatorteam', 'user.id', '=', 'evaluatorteam.evaluatorId')
        .where('evaluatorteam.teamId', teamId)
        .then(response => {
          return response;
        });
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/teams/:teamId/startEvaluation', {
    create(data, params) {
      const { teamId } = params.route;
      const { heuristicName: name, customHeuristics, plan } = data;
      let { heuristicId } = data;

      return new Promise((resolve, reject) => {
        if (customHeuristics && !heuristicId) {
          app.service('heuristics').create({
            name,
            isUnique: 1,
          })
            .then(result => {
              heuristicId = result.id;
              return app.service('rules/createBatch').create({ rules: customHeuristics, heuristicId });
            })
            .then(result => {
              throw new Error('error');
              reject('error');
              app.service('teams').patch(
              teamId,
              { heuristicId, state: teamState.evaluationStarted }
            )})
            .then(result => resolve(result))
            .catch(reject);
        } else {
          app.service('teams').patch(
            teamId,
            { heuristicId, state: teamState.evaluationStarted },
            { transaction: params.transaction },
          )
            .then(response => resolve(response))
            .catch(reject);
        }
      });
    },

    setup(app) {
      this.app = app;
    }
  });
};
