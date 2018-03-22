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
          (hook) => {
            if (!hook.data.uri && hook.params.file) {
              const file = hook.params.file;
              const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
              hook.data = {uri: uri};
            }
          }
        ]
      }
    });

    app.service('/imageupload/createBatch').hooks({
      before: {
        all: [
          disallow('external'),
        ],
        create: [
          (hook) => {
            const { photos } = hook.data;

            return new Promise((resolve, reject) => {
              Promise.all(
                photos.map(item => hook.app.service('imageupload').create(
                  {...item},
                ))
              )
                .then(result => {
                  hook.result = result;
                  resolve(hook);
                })
                .catch(reject);
            })
          }
        ]
      }
    })
  }
};
