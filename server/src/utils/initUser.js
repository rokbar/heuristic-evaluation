const { initUser } = require('../config');

module.exports = function (app) {
  app.service('users').find()
    .then((users) => {
      if (!users.length) app.service('users').create({
        ...initUser,
      });
    })
    .catch(error => {
      throw error;
    })
};
