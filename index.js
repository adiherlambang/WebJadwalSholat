var express = require("express");
var path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
var app = express();
app.use(express.static(path.join(__dirname, "lib")))
app.set('views', __dirname + '/views');
app.use('/public', express.static('public'));
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
const data = require("./lib/js/main")
const fs = require('fs');

app.get("/", (req, res, next) => {
    Promise.all([data.getData(), data.getRunningText(), data.getMediaSlide()])
        .then(([data1, data2, data3]) => {
            // console.log(data); // logs the response data as JSON
            res.render("user/index.html", {
                data1,
                data2,
                data3
            });
            console.log("Success render HomePage");
        })
        .catch(error => {
            const data = {
                "data": {
                    "jadwal": {
                        "imsak": "-",
                        "subuh": "-",
                        "terbit": "-",
                        "dhuha": "-",
                        "dzuhur": "-",
                        "ashar": "-",
                        "maghrib": "-",
                        "isya": "-"
                    }
                }
            }
            res.render("user/index.html", {
                data
            })
            console.log("Success render data, without json data")
        });
})

app.get("/admin", (req, res, next) => {
    Promise.all([data.getRunningText(), data.getMediaSlide()])
        .then(([data1, data2]) => {
            res.render("admin/admin.html", {
                data1,
                data2
            });
            console.log("Success render admin");
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('An error occurred');
        });
})

app.post('/updateRunningText', (req, res) => {
    // Update the JSON file with the new data
    const data = JSON.stringify(req.body);
    // console.log(data)
    fs.writeFileSync('./public/data/runningText.json', data);

    // // Send a response back to the client
    res.send('Data saved successfully');
});

app.post('/updateMediaSlide', (req, res) => {
    // Update the JSON file with the new data
    const data = JSON.stringify(req.body);
    // console.log(data)
    fs.writeFileSync('./public/data/media.json', data);

    // // Send a response back to the client
    res.send('Data saved successfully');
});

app.get('/list-files', function (req, res) {
    const fs = require('fs');
    const directoryPath = './public/images/'; // Replace this with the actual path to your directory
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            console.error('Error reading directory: ' + err + directoryPath);
            res.status(500).send('Error reading directory');
        } else {
            const data = files.map(function (filename) {
                return {
                    filename: filename,
                    filepath: directoryPath + filename
                };
            });
            res.json(data);
        }
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('fileToUpload'), function(req, res) {
   console.log(req.file);
   res.send('File uploaded successfully!');
});

app.post('/deleteFile', (req, res) => {
    const data = JSON.stringify(req.body.filepath);
    console.log(data)
    const cleanedResponse = data.replace(/"/g, '');
    fs.unlink("C:\\Project Web\\MasjidVideotron\\"+cleanedResponse, (err) => {
        if (err) throw err;
        console.log('File deleted successfully');
        res.send('File deleted successfully')
    });
});

var server = app.listen(3000, function () {
    console.log("Listening on port %s...", server.address().port);
});