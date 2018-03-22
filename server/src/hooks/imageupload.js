const dauria = require('dauria');
const { disallow } = require('feathers-hooks-common');

module.exports = function () {
  return function (app) {
    app.service('/imageupload').hooks({
      before: {
        all: [
          disallow('external'),
        ],
        create: [
          (context) => {
            if (!context.data.uri && context.params.file) {
              const file = context.params.file;
              const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
              context.data = {uri: uri};
            }
          }
        ]
      }
    })
  }
};
