const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/mergedproblems/merge', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));

  app.use('/mergedproblems', knex({
    Model: db,
    name: 'mergedproblem',
    id: 'id',
  }));

  app.use('/mergedproblems/createBatch', {
    create(data, params) {
      return new Promise((resolve, reject) => {
        const { mergedProblemIds, newProblemId } = data;
        const rowsToInsert = mergedProblemIds && mergedProblemIds.map((item) => {
          return { fromId: item, toId: newProblemId }
        });

        db.transacting(params.transaction.trx)
          .insert([...rowsToInsert]).into('mergedproblem')
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

  app.use('/problems/merge', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));

  app.use('/teammergedproblems/:teamId', {
    find(params) {
      const teamId = params.route.teamId;
      const host = params.headers.host;
      const proto = params.headers['x-forwarded-proto'];

      return db.select(
        'problem.id',
        'problem.description',
        'problem.location',
        'problem.isCombined',
        'problem.teamId',
        'problem.isRevised',
        'problem.solution',
        db.raw('GROUP_CONCAT(DISTINCT ??.??) as ??', ['problemphoto', 'path', 'photos']),
        db.raw('GROUP_CONCAT(DISTINCT CAST(??.?? as SIGNED)) as ??', ['problemrule', 'ruleId', 'rules']),
        db.raw('GROUP_CONCAT(DISTINCT CAST(??.?? as SIGNED)) as ??', ['evaluatorproblem', 'evaluatorId', 'users']),
      )
        .from('problem')
        .leftJoin('evaluatorproblem', 'problem.id', '=', 'evaluatorproblem.problemId')
        .leftJoin('problemrule', 'problem.id', '=', 'problemrule.problemId')
        .leftJoin('problemphoto', 'problem.id', '=', 'problemphoto.problemId')
        .where('problem.teamId', teamId)
        .andWhere('problem.isCombined', true)
        .groupBy('problem.id')
        .then(response => {
          const modifiedResponse = response.map(item => {
            const {photos, ...rest} = item;
            return {...rest, photos: photos && photos.split(',').map(photo => `${proto}://${host}/${photo}`)};
          });

          return modifiedResponse;
        });
    },

    setup(app) {
      this.app = app;
    }
  });

  app.use('/mergedproblems/edit/:problemId', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));
};
