import { extractFull, add, rename } from "node-7z";
import { stringReplace, Replace, removeNullAndFalse, removeNull } from "./Utilities";
import sevenBin from '7zip-bin';
import del from 'del';
import { copyFile } from "fs/promises";
import fs, { readdirSync } from 'fs';
import { type } from "os";

const pathTo7zip:string = sevenBin.path7za;

let CreateCSPMetadata = (csps:{[key:string]:string[]}) => {
    var tag:string = "<meta http-equiv=\"Content-Security-Policy\" content=\"{0}\" />"
    var content:string = "";
    for (var key in csps) {
        if (key !== 'patch_preload_bundles') {
            content += key;
            for (var i in csps[key]) {
                var value:string = csps[key][i];
                content += " " + value
            }
            content += "; "
        }
    }

    return tag.replace("{0}", content);
};

(async () => {

    require('dotenv').config();

    var appName:string = process.env.APP_NAME as string;
    var version:string = process.env.APP_VERSION as string;
    var assetName:string = process.env.ASSET_NAME as string;
    var platform:string = process.env.PLATFORM as string;
    var usePreloadBundle:boolean = (process.env.USE_PRELOAD_BUNDLE as string) == 'true';
    var useGCInstant:boolean = (process.env.USE_GCINSTANT as string) == 'true';
    var playcanvasNonMinified:boolean = (process.env.PLAYCANVAS_NON_MINIFIED as string) == 'true';
    var optimizeConfig:boolean = (process.env.OPTIMIZE_CONFIG as string) == 'true';
    var snapchatBackendUrl:string = process.env.SNAPCHAT_BACKEND_URL as string;
    var snapchatNoShareImage:boolean = (process.env.SNAPCHAT_NO_SHARE_IMAGE as string) == 'true';
    var useVConsole:boolean = (process.env.DEBUG_MODE as string) == 'true';
    var backend:string = process.env.BACKEND as string;

    let basePath:string = `./temp/extracted`;
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath);
    }

    let baseZip:string = `./temp/${appName}_${version}_Build.zip`;
    let preloadAndroidZip:string = `${basePath}/preload-android.zip`;
    let preloadIosZip:string = `${basePath}/preload-ios.zip`;

    if (!fs.existsSync(baseZip)) {
        return Promise.reject(new Error(`file [${baseZip}] does not exists!`));
    }

    // extract base.zip file
    await new Promise<void>((resolve, reject) => {

        console.log(`-- extracting base.zip file --`);

        const zipFile = extractFull(baseZip, basePath, { $bin: pathTo7zip, $progress: true, recursive: true }); 
        zipFile.on('data', function (data) {
            // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
        });
          
        zipFile.on('progress', function (progress) {
            // console.log(`progress: ${progress.percent}`); //? { percent: 67, fileCount: 5, file: undefinded }
        });

        zipFile.on('error', (err) =>{
            console.log(`err: ${JSON.stringify(err)}`);
        });

        zipFile.on('end', function () {
            // end of the operation, get the number of folders involved in the operation
            resolve();
        });

    });

    let indexHTML:string = `${basePath}/index.html`;
    let gamescriptsJS:string = `${basePath}/__game-scripts.js`;

    let filesToUpdate:string[] = [
        indexHTML, 
        gamescriptsJS,
    ];

    let renameTargets:string[][] = [];

    if (optimizeConfig) {
        let configJSON:string = `${basePath}/config.json`;
        filesToUpdate.push(configJSON);

        console.log(`-- optimize config.json --`);
        await new Promise<void>((resolve, reject)=>{
            fs.readFile(configJSON, 'utf8', function (errConfigJSON, dataConfigJSON) {
        
                if (errConfigJSON) {
                    console.log(errConfigJSON);
                    reject();
                    return;
                }
        
                const data = JSON.parse(dataConfigJSON);
                const keys = Object.keys( data.assets );
        
                keys.forEach( 
                    (key)=>{
                        const current = data.assets[key];
                        const light: {[key:string]:any} = {};
        
                        light.tags      = current.tags;
                        light.name      = current.name;
                        light.preload   = current.preload;
                        light.exclude   = current.exclude;
                        light.meta      = current.meta;
                        light.data      = current.data;
                        light.type      = current.type;
                        light.file      = current.file;
                        light.region    = current.region;
                        light.i18n      = current.i18n;
                        light.id        = current.id;
        
                        if (light.file) delete(light.file.hash);
                        if (light.file) delete(light.file.size);
        
                        if(typeof (light.i18n) !== 'undefined' && Object.keys(light.i18n).length === 0)
                            delete(light.i18n);
        
                        if(typeof (light.tags) !== 'undefined' && light.tags.length === 0 )
                            delete(light.tags);
        
                        removeNull(light);
                        if(light.meta){
                            removeNull(light.meta);
                            if( light.meta.compress)
                                removeNull(light.meta.compress);
                        }
        
                        if(light.data){
                            removeNull(light.data);
                        }
        
                        data.assets[key] = light;
                    }
                ); 
        
                var configJSONContent = JSON.stringify(data);
        
                fs.writeFile(configJSON, configJSONContent, 'utf8', function (errConfigJSONWrite) {
                    if (errConfigJSONWrite) {
                        console.log(errConfigJSONWrite);
                        reject();
                        return;
                    }
                    console.log(`success update: ${configJSON}`);
                    resolve();
                    return;
                });
        
            });
        });
    }

    async function addFileToZip (fileName:string, sourcePath:string, extractedPath:string, zipPath:string) {
        console.log(`-- add ${fileName} --`);
        filesToUpdate.push(extractedPath);
        await copyFile( `${sourcePath}`, extractedPath);
        
        renameTargets.push([fileName, zipPath]);
    }
    
    console.log(`-- update index.html --`);
    var indexHTMLReplaces:Replace[] = [
        { Pattern: /<head>/g, Value: `<head>\n\t<script>buildVersion="${version}";</script>` },
        { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Pragma" content="no-cache"/>` },
        { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate"/>` }
    ];

    if (useGCInstant) {
        console.log(`RPW.js is already uploaded`);
    }

    if (playcanvasNonMinified) {
        let playcanvasJSFilename:string = `playcanvas-stable.min.js`;
        let playcanvasJSSource:string = `./utils/${playcanvasJSFilename}`;
        let playcanvasJSExtracted:string = `${basePath}/${playcanvasJSFilename}`;
        let playcanvasJSZip:string = `${playcanvasJSFilename}`;

        await addFileToZip(playcanvasJSFilename, playcanvasJSSource, playcanvasJSExtracted, playcanvasJSZip);
    }

    if (useVConsole) {
        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>useVConsole=true;</script>` });
    }

    if (typeof (backend) != 'undefined') {
        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>backend="${backend}";</script>` });
    }

// FACEBOOK ONLY : start
    if (platform == 'fb') {
        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>platform="Facebook";</script>` });

        let fbappConfigJSON:string = `${basePath}/fbapp-config.json`;
        filesToUpdate.push(fbappConfigJSON);
        console.log(`-- add fbapp-config.json --`);
        await copyFile( `./utils/fbapp-config.json`, fbappConfigJSON);

        let startScriptJS:string = `${basePath}/__start__.js`;
        filesToUpdate.push(startScriptJS);
        console.log(`-- add __start__.js --`);
        await copyFile( `./utils/__start__.js`, startScriptJS);

        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script src="https://connect.facebook.net/en_US/fbinstant.latest.js"></script>` });
    }
// FACEBOOK ONLY : end

// SNAPCHAT ONLY : start
    if (platform == 'sc') {
        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>platform="Snapchat";</script>` });

        if (!snapchatNoShareImage) {
            
            let shareImageFilename:string = `share_image.png`;
            let shareImageSource:string = `./src/snapchat/${assetName}.png`;
            let shareImageExtracted:string = `${basePath}/files/assets/${shareImageFilename}`;
            let shareImageZip:string = `files/assets/${shareImageFilename}`;

            await addFileToZip(shareImageFilename, shareImageSource, shareImageExtracted, shareImageZip);
        }

        var csps = {
            "style-src": [
                "'self'",
                "'unsafe-inline'"
            ],
            "connect-src": [
                "'self'",
                "blob:",
                "data:",
                "https://www.google-analytics.com",
                "https://snapchat.com",
                "https://*.snapchat.com",
                "wss://*.games.snapchat.com",
                "https://*.games.snapchat.com"
            ]
        };

        if (useGCInstant) {
            csps["connect-src"].push("https://*.amplitude.com");
            csps["connect-src"].push("https://*.sentry.io");
        }

        var cspMetadata = CreateCSPMetadata(csps);
        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t${cspMetadata}` });

        if (typeof (snapchatBackendUrl) != 'undefined') {
            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>snapchatBackendUrl="${snapchatBackendUrl}";</script>` });
        }
    }
// SNAPCHAT ONLY : end
    await stringReplace(indexHTML, indexHTML, indexHTMLReplaces);
    
    if (usePreloadBundle) {
        
        console.log(`-- update preload-android.zip --`);
        await new Promise<void>((resolve, reject) => {

            const zipFile = add(preloadAndroidZip, filesToUpdate, { $bin: pathTo7zip, $progress: true, recursive: true }); 
            zipFile.on('data', function (data) {
                // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
            });
            
            zipFile.on('progress', function (progress) {
                // console.log(`progress: ${progress.percent} | file: ${progress.file}`); //? { percent: 67, fileCount: 5, file: undefinded }
            });

            zipFile.on('error', (err) =>{
                console.log(`err: ${JSON.stringify(err)}`);
            });

            zipFile.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });
        if (renameTargets.length > 0) {
            await new Promise<void>((resolve, reject) => {
        
                const zipFile = rename(preloadAndroidZip, renameTargets, { $bin: pathTo7zip, $progress: true, recursive: true }); 
                zipFile.on('data', function (data) {
                    // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
                });
                
                zipFile.on('progress', function (progress) {
                    // console.log(`progress: ${progress.percent} | file: ${progress.file}`); //? { percent: 67, fileCount: 5, file: undefinded }
                });
        
                zipFile.on('error', (err) =>{
                    console.log(`err: ${JSON.stringify(err)}`);
                });
        
                zipFile.on('end', function () {
                    // end of the operation, get the number of folders involved in the operation
                    resolve();
                });
        
            });
        }

        console.log(`-- update preload-ios.zip --`);
        await new Promise<void>((resolve, reject) => {

            const zipFile = add(preloadIosZip, filesToUpdate, { $bin: pathTo7zip, $progress: true, recursive: true }); 
            zipFile.on('data', function (data) {
                // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
            });
            
            zipFile.on('progress', function (progress) {
                // console.log(`progress: ${progress.percent} | file: ${progress.file}`); //? { percent: 67, fileCount: 5, file: undefinded }
            });

            zipFile.on('error', (err) =>{
                console.log(`err: ${JSON.stringify(err)}`);
            });

            zipFile.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });
        if (renameTargets.length > 0) {
            await new Promise<void>((resolve, reject) => {

                const zipFile = rename(preloadIosZip, renameTargets, { $bin: pathTo7zip, $progress: true, recursive: true }); 
                zipFile.on('data', function (data) {
                    // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
                });
                
                zipFile.on('progress', function (progress) {
                    // console.log(`progress: ${progress.percent} | file: ${progress.file}`); //? { percent: 67, fileCount: 5, file: undefinded }
                });

                zipFile.on('error', (err) =>{
                    console.log(`err: ${JSON.stringify(err)}`);
                });

                zipFile.on('end', function () {
                    // end of the operation, get the number of folders involved in the operation
                    resolve();
                });

            });
        }
            
    }

    let preloadBundles:string[] = [];
    if (usePreloadBundle) {
        preloadBundles.push(preloadAndroidZip);
        preloadBundles.push(preloadIosZip);
    }

    console.log(`-- update base.zip --`);
    await new Promise<void>((resolve, reject) => {

        const zipFile = add(baseZip, [...filesToUpdate, ...preloadBundles], { $bin: pathTo7zip, $progress: true, recursive: true }); 
        zipFile.on('data', function (data) {
            // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
        });
          
        zipFile.on('progress', function (progress) {
            // console.log(`progress: ${progress.percent} | file: ${progress.file}`); //? { percent: 67, fileCount: 5, file: undefinded }
        });

        zipFile.on('error', (err) =>{
            console.log(`err: ${JSON.stringify(err)}`);
        });

        zipFile.on('end', function () {
            // end of the operation, get the number of folders involved in the operation
            resolve();
        });

    });
    if (renameTargets.length > 0) {
        await new Promise<void>((resolve, reject) => {

            const zipFile = rename(baseZip, renameTargets, { $bin: pathTo7zip, $progress: true, recursive: true }); 
            zipFile.on('data', function (data) {
                // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
            });
            
            zipFile.on('progress', function (progress) {
                // console.log(`progress: ${progress.percent} | file: ${progress.file}`); //? { percent: 67, fileCount: 5, file: undefinded }
            });

            zipFile.on('error', (err) =>{
                console.log(`err: ${JSON.stringify(err)}`);
            });

            zipFile.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });
    }
    
    // await del([`${basePath}**`,`${basePath}`,`${zipPath}`]);
    await del([`${basePath}**`,`${basePath}`]);

    console.log('done');

})();