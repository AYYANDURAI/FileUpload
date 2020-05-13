const express = require('express');
const app = express();
const path = require('path');
//const upload = require("express-fileupload");
const PORT = 4000;
const multer = require('multer');
const request = require('request');
//app.use(upload());
const fs = require('fs');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


const upload = multer({
    storage: storage
}).single('filename');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {

    var filep = "";
    upload(req, res, (err) => {
        console.log(req.file.path, "file path");
        if (err) {
            console.log(err);
        } else {
            if (req.file === undefined) {
                res.send('not selecting files');
            }
            filep = path.join(__dirname, "./public/uploads/" + req.file.filename);

            var data = '';
            let formData = {
                file: {
                    value: fs.createReadStream(filep),
                    options: {
                        filename: req.file.originalname
                    }
                }
            };

            const postUrl = "http://example.com";

            request.post({ url: postUrl, formData: formData }, function (err, httpResponse, body) {
                console.log(err);
                console.log(httpResponse);
                console.log(body)
            });

            // console.log(readerStream);

            // readerStream.setEncoding('UTF8');

            // // Handle stream events --> data, end, and error
            // readerStream.on('data', function (chunk) {
            //     //console.log(chunk + '\n');
            //     data += chunk;
            // });

            // readerStream.on('end', function () {
            //     console.log(data);
            // });

            // readerStream.on('error', function (err) {
            //     console.log(err.stack);
            // });

            res.send(data);
        }
    });


});
app.listen(PORT, () => console.log(`server is running on ${PORT}`));