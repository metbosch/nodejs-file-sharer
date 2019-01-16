var fs = require('fs');
var path = require('path');

var express = require('express');
var formidable = require('formidable');

var app = express();

const LISTEN_PORT = 1453;
const PUBLIC_PATH = path.join(__dirname, 'public');
const UPLOAD_PATH = path.join(__dirname, '..', 'uploaded_files');

app.use(express.static(PUBLIC_PATH));

app.post('/fileupload', function (req, res) {
    var form = new formidable.IncomingForm();

    // default 10GB
    form.maxFileSize = Math.pow(1024, 3) * 10;

    form.parse(req, function (err, fields, files) {
        if (!files.fileupload) {
            console.log("ERROR BAD REQUEST -", err, files);
            res.status(400).end('File not uploaded!');
            return;
        }

        var oldpath = files.fileupload.path;
        var newpath = path.join(UPLOAD_PATH, files.fileupload.name);

        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log('ERROR -', err);

                res.status(500).end('!ERROR! File not uploaded');
            }
            else {
                console.log('SUCCESS -', newpath);

                res.end('File uploaded and moved!');
            }
        });
    });
});

app.listen(LISTEN_PORT, function () {
    console.log('NodeJS File SHARER server listening on port %s', LISTEN_PORT);
});
