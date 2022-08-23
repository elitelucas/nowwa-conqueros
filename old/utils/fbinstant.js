require('dotenv').config();
const 
    del = require('del'),
    AdmZip = require('adm-zip'),
    request = require('request-promise'),
    fs = require('fs');

(async ()=>{

    const oldZipFile = new AdmZip(`./temp/${process.env.APP_NAME}_Download.zip`); 

    oldZipFile.extractAllTo(`./temp/extracted/`, true);

    await new Promise((resolve, reject)=>{
        let indexHTML = `./temp/extracted/index.html`;
        fs.readFile(indexHTML, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                reject();
                return; 
            }

            var endOfHead = '</head>';
            var endOfHeadIndex = data.indexOf(endOfHead);

            var sdkFile = `    <script src="https://connect.facebook.net/en_US/fbinstant.latest.js"></script>\n`;
            
            data = data.slice(0, endOfHeadIndex) + sdkFile + data.slice(endOfHeadIndex);
            
            var pattern = `    <script src="https://connect.facebook.net/en_US/fbinstant.beta.js"><\/script>\n`;
            var hasPattern = data.indexOf(pattern) >= 0;
            if (hasPattern) {
                data = data.replace(pattern, "");
            }

            console.log(data);
            
            fs.writeFile(indexHTML, data, 'utf8', function (err) {
                if (err) {
                    console.log(err);
                    reject();
                    return;
                }
                console.log(`success replace: ${indexHTML}`);
                resolve();
                return;
            });
        });
    });
    
    const newZipFile = new AdmZip();

    newZipFile.addLocalFolder(`./temp/extracted/`);
    newZipFile.deleteFile('__start__.js');
    newZipFile.deleteFile('__loading__.js');

    newZipFile.addLocalFile('./utils/fbapp-config.json');
    newZipFile.addLocalFile(`./dist/${process.env.OUTPUT_FILE}`, '', `__loading__.js`);
    newZipFile.addLocalFile('./utils/__start__.js');

    newZipFile.writeZip(`./temp/${process.env.APP_NAME}.${process.env.APP_VERSION}._Upload.zip`);
    
    //await del([`./temp/extracted/**`,`./temp/extracted`]);

    var appID = process.env.APP_ID;
    var accessToken = process.env.FB_ACCESS_TOKEN;

    const buffer = newZipFile.toBuffer();
    
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
        filename: `./temp/${process.env.APP_NAME}.${process.env.APP_VERSION}._Upload.zip`,
        contentType: "application/octet-stream"
    });
    req.then(() => {
        console.log("Upload complete for file: " + `${process.env.APP_NAME}.${process.env.APP_VERSION}._Upload.zip`);
    }, (e) => {
        console.error(e);
    });
})();
