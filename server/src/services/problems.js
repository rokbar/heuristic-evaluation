const knex = require('feathers-knex');

const db = require('../database');

module.exports = function (app) {
  app.use('/evaluatorproblems/:teamId', {
    find(params) {
      const teamId = params.route.teamId;
      const userId = params.user.id;
      const host = params.headers.host;
      const proto = params.headers['x-forwarded-proto'] || 'http';

      return db.select(
        'problem.id',
        'problem.description',
        'problem.location',
        'problem.isCombined',
        'problem.teamId',
        'problem.solution',
        db.raw('GROUP_CONCAT(DISTINCT ??.??) as ??', ['problemphoto', 'path', 'photos']),
        db.raw('GROUP_CONCAT(DISTINCT CAST(??.?? as SIGNED)) as ??', ['problemrule', 'ruleId', 'rules']),
      )
        .from('problem')
        .leftJoin('evaluatorproblem', 'problem.id', '=', 'evaluatorproblem.problemId')
        .leftJoin('problemrule', 'problem.id', '=', 'problemrule.problemId')
        .leftJoin('problemphoto', 'problem.id', '=', 'problemphoto.problemId')
        .where('evaluatorproblem.evaluatorId', userId)
        .andWhere('problem.teamId', teamId)
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

  app.use('/teamproblems/:teamId', {
    find(params) {
      const teamId = params.route.teamId;
      const host = params.headers.host;
      const proto = params.headers['x-forwarded-proto'] || 'http';

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
        .andWhereNot('problem.isCombined', true)
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

  app.use('/problems/create', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));

  // TODO - refactor to single sql query, restictToOwner
  app.use('/problems/get/:problemId', {
    find(params) {
      const {problemId} = params.route;
      const problem = {};
      const host = params.headers && params.headers.host;
      const proto = params.headers && (params.headers['x-forwarded-proto'] || 'http');

      return new Promise((resolve, reject) => {
        app.service('problemrule').find(
          {query: {problemId: problemId}},
        )
          .then(result => {
            problem.problemrule = result;
            return app.service('problemphotos').find(
              {
                query: {
                  problemId: problemId,
                  $select: ['path', 'size'],
                }
              },
            )
          })
          .then(result => {
            problem.photos = result.map(item => ({
              id: item.id,
              path: `${proto}://${host}/${item.path}`,
              size: item.size,
            }));
            return app.service('problems').get(
              problemId,
            )
          })
          .then(result => {
            problem.problem = result;
            return app.service('evaluatorproblem').find(
              {query: {problemId: problemId}}
            )
          })
          .then(result => {
            problem.evaluatorproblem = result[0];
            resolve(problem);
          })
          .catch(reject);
      })
    }
  });

  app.use('/problems/edit/:problemId', knex({
    Model: db,
    name: 'evaluatorproblem',
    id: 'id',
  }));

  app.use('/problems/remove/:problemId', knex({
    Model: db,
    name: 'evaluatorproblem',
    id: 'id',
  }));

  // TODO - adjust role access and limit REST options
  app.use('/problems', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));
};
