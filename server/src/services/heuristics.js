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
                  return rule.heuristic_id === heuristic.id;
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

  app.use('/heuristics', knex({
    Model: db,
    name: 'heuristic',
    id: 'id',
  }));

  app.use('/rules', knex({
    Model: db,
    name: 'rule',
    id: 'id',
  }));
};
