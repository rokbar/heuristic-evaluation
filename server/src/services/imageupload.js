const blobService = require('feathers-blob');
const multer = require('multer');

const multipartMiddleware = multer();
const { blobStorage } = require('../blobStorage');

module.exports = function(app) {
  app.use('/imageupload/createBatch', {
    async create(data, params) {
      return params;
    },
  });

  app.use('/imageupload',
    multipartMiddleware.single('uri'),

    function (req, res, next) {
      req.feathers.file = req.file;
      next();
    },

    blobService({Model: blobStorage})
  );
};
