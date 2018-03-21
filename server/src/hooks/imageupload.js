const dauria = require('dauria');

module.exports = function () {
  return function (app) {
    app.service('/imageupload').hooks({
      before: {
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
