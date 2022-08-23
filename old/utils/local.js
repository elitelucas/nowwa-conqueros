require('dotenv').config();
const 
    fs = require('fs'),
    express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    AdmZip = require('adm-zip');

(async () => {
    await new Promise((resolve, reject) => {
        fs.copyFile(`./dist/${process.env.OUTPUT_FILE}`, `./temp/${process.env.OUTPUT_FILE}`, (err) => {
            if (err) {
                console.error(err);
                reject();
            } else {
                resolve();
            }
        });
    }); 

    const oldZipFile = new AdmZip(`./temp/${process.env.APP_NAME}_Download.zip`); 

    oldZipFile.extractAllTo(`./temp/local/`, true);

    const app = express ();

    app.use (bodyParser.json());

    app.use (cors());

    app.use (function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.listen(process.env.PORT, () => console.log('webhook is listening'));

    app.use ('/', express.static ('./temp/local'));
})();



