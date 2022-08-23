import { stringReplace, Replace } from './Utilities';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';

const argv = yargs(hideBin(process.argv)).argv;

let BuildWrapper = ():Promise<boolean> => {
    const 
        { exec }    = require("child_process"),
        filename    = `GCInstantWrapper`,
        source      = `./src/${filename}.ts`,
        destination = `./dist/${filename}.js`

    return new Promise((resolve, reject) => {
        var command:string = `npx cross-env NODE_ENV='production' parcel build ${source} --no-cache --no-content-hash --no-source-maps --no-optimize --dist-dir dist`;
        console.log(`execute: ${command}`);
        exec(command, (error:any, stdout:any, stderr:any) => {
            if (error) {
                console.log(`error: ${error.message}`);
                console.log(`wrapper: building: fail`);
                resolve(false);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                console.log(`wrapper: building: fail`);
                resolve(false);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`wrapper: building: success`);
            resolve(true);
        });
    });
};

let MakeWrapper = async (tries:number = 0):Promise<void> => {
    let success = await BuildWrapper();
    
    console.log(`tries: [${tries}]: ${success}`);
    if (success) {
        return Promise.resolve(); 
    } else {
        return MakeWrapper(tries + 1);
    }
};

let PostProcessWrapper = ():Promise<void> => {
    
    const 
        { exec }    = require("child_process"),
        filename    = `GCInstantWrapper`,
        destination = `./dist/${filename}.js`
    
        return new Promise((resolve, reject) => {
            let data = fs.readFileSync(`${destination}`, { encoding:'utf8' });
                    
            var endOfChunk = 'var $946c485706e48c1f$export$2e2bcd8739ae039';
            var endOfChunkIndex = data.indexOf(endOfChunk);
            console.log('unknown var chunk index: ' + endOfChunkIndex);
            if (endOfChunkIndex >= 0) {
                var firstVar = `var $946c485706e48c1f$import$4f1f131d5e9c7574 = {};\n`;
                var secondVar = `var $946c485706e48c1f$import$5ecbb526cd5c0bbc = {};\n`;
                
                data = data.slice(0, endOfChunkIndex) + firstVar + secondVar + data.slice(endOfChunkIndex);
                console.log('chunk replaced!');
            }

            var endOfPlatform = 'switch(undefined)';
            var endOfPlatformIndex = data.indexOf(endOfPlatform);
            if (endOfPlatformIndex >= 0) {
                data = data.replace(endOfPlatform, `switch('${process.env.PLATFORM}')`);
                console.log('platform replaced!');
            }

            data = data.replace(/\%2F/g,'/');
            data = data.replace(/\%2B/g,'+');
            data = data.replace(/\%3A/g,':');
            data = data.replace(/\%3B/g,';');

            fs.writeFileSync(`${destination}`, data, { encoding: 'utf8' }); 

            resolve();
        });
};

let UploadWrapper = ():Promise<void> => {
    return new Promise((resolve, reject) => {
        require('dotenv').config();
        const
            rp = require('request-promise'),
            configuration = JSON.parse(fs.readFileSync('./playcanvas.json', { encoding:'utf8' })),
            sourceFilename    = `GCInstantWrapper.js`,
            sourcePath = `./dist/${sourceFilename}`,
            destinationFilename = `RPW.js`;
    
        fs.readFile(`${sourcePath}`, 'utf8', function (err:any, data:any) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
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
                    resolve();
                }, (e:any) => {
                    console.error(e);
                    reject(e);
                });
            }
        });
    });
};

(async () => {

    var environment:string = (argv as any).env;
    var platform:string = (argv as any).platform;
    var appName:string = (argv as any).appName;
    var version:string = (argv as any).ver;
    console.log(`version: ${version}`);
    
    var ownPackageJsonPath:string = `package.json`;
    var ownPackageJsonReplaces:Replace[] = [
        { Pattern: /\"version\":[ ]*\"[a-zA-Z0-9.-]*\"/g, Value: `"version": "${version}"` },
        { Pattern: /\"name\":[ ]*\"[a-zA-Z0-9.-\s]*\"/g, Value:  `"name": "${appName}"` },
    ];
    await stringReplace(ownPackageJsonPath, ownPackageJsonPath, ownPackageJsonReplaces);
    
    var dotEnvPathInput:string = `./environments/.env.${appName}.${platform}.${environment}`;
    var dotEnvPathOutput:string = `./.env`;
    var dotEnvReplaces:Replace[] = [
        { Pattern: /APP_VERSION='[a-zA-Z0-9.-]+'/g, Value: `APP_VERSION='${version}'` }
    ];
    await stringReplace(dotEnvPathInput, dotEnvPathOutput, dotEnvReplaces);
    
    require('dotenv').config();

    var usePreloadBundle:boolean = (process.env.USE_PRELOAD_BUNDLE as string) == 'true';
    var useGCInstant:boolean = (process.env.USE_GCINSTANT as string) == 'true';
    var useReplicant:boolean = (process.env.USE_REPLICANT as string) == 'true';
    
    var ownPlaycanvasJsonPathInput = `./playcanvas/playcanvas.${appName}.json`;
    var ownPlaycanvasJsonPathOutput = `./playcanvas.json`;
    var ownPlaycanvasJsonReplaces:Replace[] = [
        { Pattern: /\"version\":[ ]*\"[a-zA-Z0-9.-]*\"/g, Value: `"version": "${version}"` },
        { Pattern: /\"preload_bundle\":[ ]*[a-z]*/g, Value: `"preload_bundle": ${usePreloadBundle}` },
    ];
    await stringReplace(ownPlaycanvasJsonPathInput, ownPlaycanvasJsonPathOutput, ownPlaycanvasJsonReplaces);

    if (useGCInstant) {
        
        var wrapperPathInput:string = `./src/Wrapper.ts`;
        var wrapperPathOutput:string = `./src/Wrapper.ts`;
        var wrapperReplaces:Replace[] = [
            { Pattern: /import mainImage from \"data-url:\.\/frontend\/[a-zA-Z0-9._\-]+\.png\";/g, Value: `import mainImage from "data-url:./frontend/${process.env.ASSET_NAME}.png";` },
            { Pattern: /data-url:.\/frontend\/[a-zA-Z0-9._\-]+.png/g, Value: `data-url:./frontend/${process.env.ASSET_NAME}.png` },
            { Pattern: /assetName: \"[a-zA-Z0-9._\-]+\"/g, Value: `assetName: "${process.env.ASSET_NAME}"` }
        ];;
        await stringReplace(wrapperPathInput, wrapperPathOutput, wrapperReplaces);
        
        var chatbotEventsPathInput:string = `./src/backend/ChatbotEvents.ts`;
        var chatbotEventsPathOutput:string = `./src/backend/ChatbotEvents.ts`;
        var chatbotEventsReplaces:Replace[] = [
            { Pattern: /assetName: \"[a-zA-Z0-9._\-]+\"/g, Value: `assetName: "${process.env.ASSET_NAME}"` },
            { Pattern: /title: \"[a-zA-Z0-9._ \-]+\"/g, Value: `title: "${process.env.APP_NAME}"` },
            { Pattern: /url: \"[a-zA-Z0-9._\-]+\"/g, Value: `url: "${process.env.SHARE_URL}"` }
        ];
        await stringReplace(chatbotEventsPathInput, chatbotEventsPathOutput, chatbotEventsReplaces);
        
        var chatbotMessageTemplatesPathInput:string = `./src/backend/ChatbotMessageTemplates.ts`;
        var chatbotMessageTemplatesPathOutput:string = `./src/backend/ChatbotMessageTemplates.ts`;
        var chatbotMessageTemplatesReplaces:Replace[] = [
            { Pattern: /[a-zA-Z0-9._\-]+: \".\/src\/[a-zA-Z0-9._\-]+.png\"/g, Value: `${process.env.ASSET_NAME}: "./src/${process.env.ASSET_NAME}.png"` }
        ];
        await stringReplace(chatbotMessageTemplatesPathInput, chatbotMessageTemplatesPathOutput, chatbotMessageTemplatesReplaces);
        
        var typesTemplatesPathInput:string = `./src/backend/Types.ts`;
        var typesTemplatesPathOutput:string = `./src/backend/Types.ts`;
        var typesTemplatesReplaces:Replace[] = [
            { Pattern: /AssetNames = tuple\(\"[a-zA-Z0-9._\-]+\"\);/g, Value: `AssetNames = tuple("${process.env.ASSET_NAME}");` }
        ];
        await stringReplace(typesTemplatesPathInput, typesTemplatesPathOutput, typesTemplatesReplaces);
        
        if (useReplicant) {
            var ownReplicantRCJsonPathInput:string = `./replicantrcs/.replicantrc.${appName}.${platform}`;
            var ownReplicantRCJsonPathOutput:string = `./.replicantrc`;
            await stringReplace(ownReplicantRCJsonPathInput, ownReplicantRCJsonPathOutput);
        }
        
        console.log(`-- wrapper create --`);
        await MakeWrapper();

        console.log(`-- wrapper process --`);
        await PostProcessWrapper();

        // console.log(`-- wrapper upload --`);
        // await UploadWrapper();
        // console.log(`-- wrapper complete --`);
    }

})();