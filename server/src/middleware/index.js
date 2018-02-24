module.exports = {
  catchAndLogErrors: function(app) {
    return function (err, req, res, next) {
      res.json(err);
    };
  }
};
