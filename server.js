const express = require('express');
const app = express();
const path = require('path');
const PORT = 4000;
const multer = require('multer');
const request = require('request');
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
        if (err) {
            console.log(err);
        } else {
            if (req.file === undefined) {
                res.send('not selecting files');
            }
            filep = path.join(__dirname, "./public/uploads/" + req.file.filename);

            const options = {
                method: "POST",
                url: "http://localhost:8080/upload",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                formData: {
                    "uploadFile": fs.createReadStream(filep)
                }
            };

            request(options, function (err, httpResponse, body) {
                console.log(err);
                console.log(httpResponse);
                console.log(body)
            });

        }
    });


});
app.listen(PORT, () => console.log(`server is running on ${PORT}`));