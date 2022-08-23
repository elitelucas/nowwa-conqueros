const 
    fs = require('fs'),
    yargs = require('yargs'),
    { hideBin } = require('yargs/helpers'),
    argv = yargs(hideBin(process.argv)).argv;


function stringReplace (inputFilename, pattern, replace, outputFilename) {
    return new Promise((resolve,reject)=>{
        fs.readFile(inputFilename, 'utf8', function (err,data) {
            if (err) {
                console.log(err);
                reject();
                return; 
            }
            console.log('success read ' + inputFilename);

            if (pattern == null) {
                fs.writeFile(outputFilename, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                        reject();
                        return;
                    }
                    console.log('success write ' + outputFilename);
                    resolve();
                });
            } else {
                var matches = data.match(pattern);
                if (matches) {
    
                    console.log(`Before: ${matches[0]}`);
                    console.log(`After: ${replace}`);
        
                    data = data.replace(pattern, replace);
                
                    fs.writeFile(outputFilename, data, 'utf8', function (err) {
                        if (err) {
                            console.log(err);
                            reject();
                            return;
                        }
                        console.log('success write ' + outputFilename);
                        resolve();
                    });
                } else {
                    fs.writeFile(outputFilename, data, 'utf8', function (err) {
                        if (err) {
                            console.log(err);
                            reject();
                            return;
                        }
                        console.log('no matching pattern: ' + pattern);
                        console.log('success write ' + outputFilename);
                        resolve();
                    });
                }
            }
        });
    });
}

(async () => {
    var environment = argv.env;
    var platform = argv.platform;
    var appName = argv.appName;
    var version = argv.ver;

    var ownPackageJsonPath = `package.json`;
    var ownPackageJsonPattern = /\"version\":[ ]?\"[0-9.-]+\"/g;
    var ownPackageJsonReplace = `"version": "${version}"`;
    await stringReplace(ownPackageJsonPath, ownPackageJsonPattern, ownPackageJsonReplace, ownPackageJsonPath);
    
    var ownPackageJsonPattern = /\"name\":[ ]?\"[a-zA-Z0-9.-]+\"/g;
    var ownPackageJsonReplace = `"name": "${appName}"`;
    await stringReplace(ownPackageJsonPath, ownPackageJsonPattern, ownPackageJsonReplace, ownPackageJsonPath);

    var ownPlaycanvasJsonPathInput = `./playcanvas/playcanvas.${appName}.json`;
    var ownPlaycanvasJsonPathOutput = `./playcanvas.json`;
    await stringReplace(ownPlaycanvasJsonPathInput, null, null, ownPlaycanvasJsonPathOutput);

    var dotEnvPathInput = `./environments/.env.${appName}.${platform}.${environment}`;
    var dotEnvPattern = /APP_VERSION='[0-9.-]+'/g;
    var dotEnvReplace = `APP_VERSION='${version}'`;
    var dotEnvPathOutput = `./.env`;
    await stringReplace(dotEnvPathInput, dotEnvPattern, dotEnvReplace, dotEnvPathOutput);

    require('dotenv').config();

    var wrapperPathInput = `./src/Wrapper.ts`;
    var wrapperPathOutput = `./src/Wrapper.ts`;
    var wrapperPattern = /import mainImage from \"data-url:\.\/frontend\/[a-zA-Z0-9._\-]+\.png\";/g;
    var wrapperReplace = `import mainImage from "data-url:./frontend/${process.env.ASSET_NAME}.png";`;
    await stringReplace(wrapperPathInput, wrapperPattern, wrapperReplace, wrapperPathOutput);

    var wrapperPattern = /data-url:.\/frontend\/[a-zA-Z0-9._\-]+.png/g;
    var wrapperReplace = `data-url:./frontend/${process.env.ASSET_NAME}.png`;
    await stringReplace(wrapperPathInput, wrapperPattern, wrapperReplace, wrapperPathOutput);

    var wrapperPattern = /assetName: \"[a-zA-Z0-9._\-]+\"/g;
    var wrapperReplace = `assetName: "${process.env.ASSET_NAME}"`;
    await stringReplace(wrapperPathInput, wrapperPattern, wrapperReplace, wrapperPathOutput);

    var chatbotEventsPathInput = `./src/backend/ChatbotEvents.ts`;
    var chatbotEventsPathOutput = `./src/backend/ChatbotEvents.ts`;
    var chatbotEventsPattern = /assetName: \"[a-zA-Z0-9._\-]+\"/g;
    var chatbotEventsReplace = `assetName: "${process.env.ASSET_NAME}"`;
    await stringReplace(chatbotEventsPathInput, chatbotEventsPattern, chatbotEventsReplace, chatbotEventsPathOutput);

    var chatbotEventsPattern = /title: \"[a-zA-Z0-9._ \-]+\"/g;
    var chatbotEventsReplace = `title: "${process.env.APP_NAME}"`;
    await stringReplace(chatbotEventsPathInput, chatbotEventsPattern, chatbotEventsReplace, chatbotEventsPathOutput);

    var chatbotEventsPattern = /url: \"[a-zA-Z0-9._\-]+\"/g;
    var chatbotEventsReplace = `url: "${process.env.SHARE_URL}"`;
    await stringReplace(chatbotEventsPathInput, chatbotEventsPattern, chatbotEventsReplace, chatbotEventsPathOutput);

    var chatbotMessageTemplatesPathInput = `./src/backend/ChatbotMessageTemplates.ts`;
    var chatbotMessageTemplatesPathOutput = `./src/backend/ChatbotMessageTemplates.ts`;
    var chatbotMessageTemplatesPattern = /[a-zA-Z0-9._\-]+: \"[a-zA-Z0-9._\-]+.png\"/g;
    var chatbotMessageTemplatesReplace = `${process.env.ASSET_NAME}: "${process.env.ASSET_NAME}.png"`;
    await stringReplace(chatbotMessageTemplatesPathInput, chatbotMessageTemplatesPattern, chatbotMessageTemplatesReplace, chatbotMessageTemplatesPathOutput);

    var typesTemplatesPathInput = `./src/backend/Types.ts`;
    var typesTemplatesPathOutput = `./src/backend/Types.ts`;
    var typesTemplatesPattern = /AssetNames = tuple\(\"[a-zA-Z0-9._\-]+\"\);/g;
    var typesTemplatesReplace = `AssetNames = tuple("${process.env.ASSET_NAME}");`;
    await stringReplace(typesTemplatesPathInput, typesTemplatesPattern, typesTemplatesReplace, typesTemplatesPathOutput);

    if (platform == `facebook` || platform == 'playcanvas') {
        var ownReplicantRCJsonPathInput = `./replicantrcs/.replicantrc.${appName}.${platform}`;
        var ownReplicantRCJsonPathOutput = `./.replicantrc`;
        await stringReplace(ownReplicantRCJsonPathInput, null, null, ownReplicantRCJsonPathOutput);
    }
})();
