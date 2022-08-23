require('dotenv').config();
const { exec } = require("child_process");

var appId = process.env.APP_ID;
var appName = process.env.APP_NAME;
var appVersion = process.env.APP_VERSION;

var command = `snapdev minis build create -p "${appId}" -n "build version ${appVersion}" -v "${appVersion}" -f "./temp/${appName}_${appVersion}_Build.zip"`;
console.log(`execute: ${command}`);
exec(command, (error, stdout, stderr) => {
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