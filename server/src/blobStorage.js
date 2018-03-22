const path = require('path');
const fs = require('fs-blob-store');

const blobStorage =  fs(path.join(__dirname, '../public'));

module.exports = {
  blobStorage: blobStorage
};
