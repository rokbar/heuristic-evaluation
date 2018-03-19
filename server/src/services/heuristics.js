const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/heuristics/all', {
    find() {
      return new Promise((resolve, reject) => {
        let heuristics;
        let rules;
        app.service('heuristics').find()
          .then(items => {
            heuristics = items;
            return app.service('rules').find()
          })
          .then(items => {
            rules = items;
          })
          .then(() => {
          // TODO - refactor to use query builder's join
            const mappedHeuristics = heuristics.reduce((accumulator, heuristic) => {
              if (!heuristic.isUnique) {
                const filteredRules = rules.filter((rule) => {
                  return rule.heuristicId === heuristic.id;
                });
                accumulator.push({...heuristic, rules: filteredRules});
              }
              return accumulator;
            }, []);
            resolve(mappedHeuristics);
          })
          .catch(reject);
      })
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/heuristics/:heuristicId/rules', {
    find(params) {
      const heuristicId = params.route.heuristicId;
      return db.select('rule.id', 'rule.description', 'rule.listNumber').from('rule')
        .where('rule.heuristicId', heuristicId)
        .orderBy('rule.listNumber', 'inc')
        .then(response => {
          return response;
        });
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/rules/createBatch', {
    create(data, params) {
      return new Promise((resolve, reject) => {
        const { rules, heuristicId } = data;
        const rowsToInsert = rules.map((item) => {
          return { description: item, heuristicId }
        });

        db.transacting(params.transaction.trx)
          .insert([...rowsToInsert]).into('rule')
          .then(response => {
            resolve(response);
          })
          .catch();
      })
    },

    setup(app) {
      this.app = app;
    }
  });

  // TODO - adjust role access and limit REST options
  app.use('/heuristics', knex({
    Model: db,
    name: 'heuristic',
    id: 'id',
  }));

  // TODO - adjust role access and limit REST options
  app.use('/rules', knex({
    Model: db,
    name: 'rule',
    id: 'id',
  }));
};
