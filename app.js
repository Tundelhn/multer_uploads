const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});
const uploads = multer({
  storage,
  limits: { fileSize: 10000000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('myImage');

function checkFileType(file, cb) {
  const fileType = /jpeg|jpg|png|pdf|gif/;
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype);
  if (fileType && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: images only');
  }
}

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', (req, res) => {
  uploads(req, res, err => {
    if (err) {
      res.render('index', {
        msg: err
      });
    } else {
      if (req.file == undefined) {
        res.render('index', {
          msg: 'Error : no file uploaded'
        });
      } else {
        res.render('index', {
          msg: 'file upload successful',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`serve running on port ${PORT}`);
});
