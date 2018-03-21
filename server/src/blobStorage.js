const path = require('path');
const fs = require('fs-blob-store');

const blobStorage =  fs(path.join(__dirname, '../upload'));

module.exports = {
  blobStorage: blobStorage
};
