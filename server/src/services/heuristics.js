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
            const mappedHeuristics = heuristics.map((heuristic) => {
              if (!heuristic.isUnique) {
                const mappedRules = rules.filter((rule) => {
                  return rule.heuristicId === heuristic.id;
                });
                return {...heuristic, rules: mappedRules};
              }
            });
            resolve(mappedHeuristics);
          })
          .catch(reject);
      })
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/rules/createBatch', {
    create(data) {
      return new Promise((resolve, reject) => {
        const { rules, heuristicId } = data;
        const rowsToInsert = rules.map((item) => {
          return { description: item, heuristicId }
        });

        db.insert(...rowsToInsert).into('rule')
          .then(response => {
            console.log(response);
            resolve(response);
          })
          .catch(err => console.log(err));
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
