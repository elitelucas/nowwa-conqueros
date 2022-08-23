import fs, { readdirSync } from 'fs';
import { extractFull, add, rename } from "node-7z";
import sevenBin from '7zip-bin';
import path from 'path';
import { number } from 'yargs';

(async() => {


    require('dotenv').config();
    const
        rp = require('request-promise'),
        configuration = JSON.parse(fs.readFileSync('./playcanvas.json', { encoding:'utf8' })),
        sourceFilename    = `GCInstantWrapper.js`,
        sourcePath = `./dist/${sourceFilename}`,
        destinationFilename = `RPW.js`;

    fs.readFile(`${sourcePath}`, 'utf8', function (err:any, data:any) {
        if (err) {
            return console.log(err);
        }
        
        console.log(`Uploading ${sourceFilename} to PlayCanvas`);
        let req = rp({
            uri: `https://playcanvas.com/api/assets/${configuration.upload.asset_id}`,
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${configuration.upload.bearer}`
            }
        })
        let form = req.form()
        form.append("project", "" + configuration.playcanvas.project_id)
        form.append("name", "" + destinationFilename)
        form.append("asset", "" + configuration.upload.asset_id)
        form.append("data", JSON.stringify({order: 100, scripts: {}}))
        form.append("preload", "true")
        form.append("branchId", "" + configuration.upload.branch_id)
        form.append("file", data, {
            filename: `${sourceFilename}`,
            contentType: "text/javascript"
        })
        req.then(() => {
            console.log(`Upload complete for file ${destinationFilename}`)
            
        }, (e:any) => {
            console.error(e);
        });
    });

})();
