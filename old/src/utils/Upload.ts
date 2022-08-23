require('dotenv').config();

var appId = process.env.APP_ID;
var appName = process.env.APP_NAME;
var appVersion = process.env.APP_VERSION;
var platform = process.env.PLATFORM;

var zipName = `${process.env.APP_NAME}_${process.env.APP_VERSION}_Build.zip`;
var zipPath = `./temp/${zipName}`;

if (platform == 'sc') {

    const 
        { exec } = require("child_process");

    var command:string = `snapdev minis build create -p "${appId}" -n "build version ${appVersion}" -v "${appVersion}" -f "./temp/${appName}_${appVersion}_Build.zip"`;
    console.log(`execute: ${command}`);
    exec(command, (error:any, stdout:any, stderr:any) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

}

if (platform == 'fb') {

    const 
        request = require('request-promise'),
        fs = require('fs');

    (async () => {

        var accessToken = process.env.FB_ACCESS_TOKEN;

        const buffer = fs.readFileSync(zipPath);
        
        console.log(`Uploading [${appName}] to Facebook`);
        let req = request({
            uri: `https://graph-video.facebook.com/${appId}/assets`,
            method: 'POST'
        })
        let form = req.form()
        form.append("access_token", "" + accessToken);
        form.append("type", "BUNDLE");
        form.append("comment", "Graph API upload");
        form.append("asset", buffer, {
            filename: zipPath,
            contentType: "application/octet-stream"
        });
        req.then(() => {
            console.log(`Upload complete for file: ${zipName}`);
        }, (e:any) => {
            console.error(e);
        });
    })();
    
}