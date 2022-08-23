require('dotenv').config();
const 
    del = require('del'),
    AdmZip = require('adm-zip'),
    request = require('request-promise'),
    fs = require('fs');

(async () => {

    var appID = process.env.APP_ID;
    var accessToken = process.env.FB_ACCESS_TOKEN;

    var filepath = `./temp/${process.env.APP_NAME}_${process.env.APP_VERSION}_Build.zip`;

    const buffer = fs.readFileSync(filepath);
    
    console.log(`Uploading [${process.env.APP_NAME}] to Facebook`);
    let req = request({
        uri: `https://graph-video.facebook.com/${appID}/assets`,
        method: 'POST'
    })
    let form = req.form()
    form.append("access_token", "" + accessToken);
    form.append("type", "BUNDLE");
    form.append("comment", "Graph API upload");
    form.append("asset", buffer, {
        filename: `./temp/${process.env.APP_NAME}_${process.env.APP_VERSION}_Build.zip`,
        contentType: "application/octet-stream"
    });
    req.then(() => {
        console.log("Upload complete for file: " + `${process.env.APP_NAME}_${process.env.APP_VERSION}_Build.zip`);
    }, (e) => {
        console.error(e);
    });
})();
