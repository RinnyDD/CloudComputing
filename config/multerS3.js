const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('../models/awsS3');
const path = require('path');

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      let mimeType = 'application/octet-stream';

      if (ext === '.png') mimeType = 'image/png';
      else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';

      cb(null, mimeType);
    },
    contentDisposition: 'inline',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // Put images inside 'img/' folder (like your manual upload)
      const uniqueName = 'img/' + Date.now().toString() + '-' + file.originalname;
      cb(null, uniqueName);
    },
  }),
});

module.exports = upload;
