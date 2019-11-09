// Import Multer
const multer = require('multer');
// Import DataUri
const Datauri = require('datauri');
// Import path
const path = require('path');


// Set Storage to the Memory
const storage = multer.memoryStorage();

const multerUpload = multer({ storage }).single('gif');

// Instantiate dUri
const dUri = new Datauri();

const dataUri = (req) => dUri.format('.gif', req.file.buffer);

module.exports = {
  multerUpload,
  dataUri,
};
