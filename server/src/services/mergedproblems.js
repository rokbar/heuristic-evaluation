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
        const { problemsToMergeIds, newProblemId } = data;
        const rowsToInsert = problemsToMergeIds && problemsToMergeIds.map((item) => {
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

  app.use('/mergedproblems/updatePositions', {
    patch(id, data, params) {
      return new Promise((resolve, reject) => {
        const { position, problemId } = data;
        if (problemId) {
          let foundProblemPosition;;
          db.transacting(params.transaction.trx)
            .select(
              'problem.id',
              'problem.position',
              'problem.isCombined',
            )
            .from('problem')
            .where('id', problemId)
            .then(response => {
              foundProblemPosition = response.position - 1;
              return db.transacting(params.transaction.trx)
                .select(
                  'problem.id',
                  'problem.position',
                )
                .from('problem')
                .where('problem.position', '>', foundProblemPosition)
                .andWhere('problem.isCombined', true)
            })
            .then(response => {
              let updatingPosition = foundProblemPosition;
              return Promise.all(response.map(item => {
                return db.raw('UPDATE problem SET position = ? WHERE id = ?', [updatingPosition++, item.id]).transacting(params.transaction.trx);
              }));
            })
            .then(response => {
              resolve(response);
            })
            .catch(reject);
        }

        if (position >= 0) {
          db.transacting(params.transaction.trx)
            .select(
              'problem.id',
              'problem.position',
            )
            .from('problem')
            .where('problem.position', '>', position)
            .andWhere('problem.isCombined', true)
            .then(response => {
              let updatingPosition = position;
              return Promise.all(response.map(item => {
                return db.raw('UPDATE problem SET position = ? WHERE id = ?', [updatingPosition++, item.id]).transacting(params.transaction.trx);
              }));
            })
            .then(response => {
              resolve(response);
            })
            .catch(reject);
        }
      });
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
        'problem.position',
        'problem.isRevised',
        'problem.solution',
        db.raw('GROUP_CONCAT(DISTINCT ??.??) as ??', ['problemphoto', 'path', 'photos']),
        db.raw('GROUP_CONCAT(DISTINCT CAST(??.?? as SIGNED)) as ??', ['problemrule', 'ruleId', 'rules']),
        db.raw('GROUP_CONCAT(DISTINCT CAST(??.?? as SIGNED)) as ??', ['evaluatorproblem', 'evaluatorId', 'users']),
        db.raw('GROUP_CONCAT(DISTINCT CAST(??.?? as SIGNED)) as ??', ['mergedproblem', 'fromId', 'originalProblemsIds']),
      )
        .from('problem')
        .leftJoin('evaluatorproblem', 'problem.id', '=', 'evaluatorproblem.problemId')
        .leftJoin('problemrule', 'problem.id', '=', 'problemrule.problemId')
        .leftJoin('problemphoto', 'problem.id', '=', 'problemphoto.problemId')
        .leftJoin('mergedproblem', 'problem.id', '=', 'mergedproblem.toId')
        .where('problem.teamId', teamId)
        .andWhere('problem.isCombined', true)
        .groupBy('problem.id')
        .orderBy('position', 'inc')
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

  app.use('/mergedproblems/remove/:problemId', knex({
    Model: db,
    name: 'problem',
    id: 'id',
  }));
};
