import express from 'express';
import Environment, { toyRoot, toyBuildUrl, toyListUrl } from './Environment';
import path from 'path';
import fs, { readdirSync } from 'fs';
import PlayCanvas from './Playcanvas';
import { extractFull, add, rename } from "node-7z";
import { stringReplace, Replace, removeNullAndFalse, removeNull } from "./Utils";
import sevenBin from '7zip-bin';
import del from 'del';
import { copyFile } from "fs/promises";
import { type } from "os";
import { config } from 'yargs';
import Status from './Status';

class Game {

    private static Instance:Game;

    private static RootFolder:string = `../../storage/toy`;

    /**
     * Initialize game module.
     */
    public static async AsyncInit (app:express.Express, env:Environment.Config):Promise<void> {
        Game.Instance = new Game();
        Game.WebhookList(app);
        Game.WebhookBuild(app);
        return Promise.resolve();
    }

    /**
     * Webhook for listing toy games. 
     * @param app @type {express.Express}
     */
    public static WebhookList (app:express.Express):void {
        app.use(`${toyListUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let fullPath:string = path.join(__dirname, `${Game.RootFolder}`);
            // console.log(`Game : ${fullPath}`);
            if (fs.existsSync(fullPath)) {
                let stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fs.readdir(fullPath, (err, contents) => {
                        if (err) {
                            throw err;
                        }

                        // TODO : read config files

                        let configs:Game.Config[] = [];
                        
                        contents.forEach(content => {
                            let contentPath:string = path.join(fullPath, content);
                            let isFile:boolean = fs.statSync(contentPath).isFile();
                            if (isFile) {
                                let extension:string = contentPath.substring(contentPath.lastIndexOf(`.`));
                                // console.log(`extension: ${extension}`);
                                if (extension == `.json`) {
                                    // console.log(`config file: ${contentPath}`);
                                    let config = JSON.parse(fs.readFileSync(contentPath, { encoding: 'utf8', flag: 'r' })) as Game.Config;
                                    
                                    let platformWeb:Game.Platform = 'Web';
                                    let platformWebFolder:string = path.join(fullPath, `${config.game.Folder}`, `${platformWeb}`);
                                    if (fs.existsSync(platformWebFolder)) {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = {};
                                        }
                                        config.builds[platformWeb.toString()] = `${toyRoot}/${config.game.Folder}/${platformWeb}`;
                                    }
                                    
                                    let platformSnapchat:Game.Platform = 'Snapchat';
                                    let platformSnapchatFolder:string = path.join(fullPath, `${config.game.Folder}`, `${platformSnapchat}`);
                                    if (fs.existsSync(platformSnapchatFolder)) {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = {};
                                        }
                                        config.builds[platformSnapchat.toString()] = `${toyRoot}/${config.game.Folder}/${platformSnapchat}`;
                                    }

                                    let platformAndroid:Game.Platform = 'Android';
                                    let apkPath:string = Game.CheckExistingApk(config);
                                    if (apkPath != '') {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = {};
                                        }
                                        config.builds[platformAndroid.toString()] = `${toyRoot}/${config.game.Folder}/${platformAndroid}/${apkPath}`;
                                    }
                                    
                                    configs.push(config);
                                }
                            }
                        });
                        
                        let output = JSON.stringify({configs:configs});
                        res.status(200).send(`${output}`);
                    });
                } else {
                    res.status(500).send(`NOT DIRECTORY | fullPath: ${fullPath}`);
                }
            } else {
                res.status(500).send(`NOT EXISTS | fullPath: ${fullPath}`);
            }
            
        });
    }

    /**
     * Check if there is an existing apk
     */
    private static CheckExistingApk (config:Game.Config):string {
        let fullPath:string = path.join(__dirname, `${Game.RootFolder}`);

        let platformAndroid:Game.Platform = 'Android';
        let platformAndroidFolder:string = path.join(fullPath, `${config.game.Folder}`, `${platformAndroid}`);
        let output:string = '';
        if (fs.existsSync(platformAndroidFolder)) {
            let stat = fs.statSync(platformAndroidFolder);
            if (stat.isDirectory()) {
                let contents = fs.readdirSync(platformAndroidFolder);
                contents.forEach(content => {
                    var contentPath = path.join(platformAndroidFolder, content);
                    var isFile:boolean = fs.statSync(contentPath).isFile();
                    if (isFile) {
                        let extension = content.split('.').pop();
                        if (extension == 'apk') {
                            output = content;
                        }
                    }
                });
            }
        }
        
        return output;
    }

    /**
     * Webhook for build toy games. 
     * @param app @type {express.Express}
     */
    public static WebhookBuild (app:express.Express):void {
        app.use(`${toyBuildUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            if (Status.CurrentStatus.Activity != 'None') {
                console.log(`Game.CurrentActivity: ${Status.CurrentStatus.Activity}`);
                res.status(500).send(`PLAYCANVAS BUSY | `);
            } else {
                let url:URL = new URL(`${Environment.CoreUrl}${req.originalUrl}`);

                let configName:string = url.searchParams.get('n') as string;
                let backend:Game.Backend = url.searchParams.get('b') as Game.Backend;
                let platform:Game.Platform = url.searchParams.get('p') as Game.Platform;
                let useVConsole:boolean = (url.searchParams.get('d') as string) == '1';
                let version:string = url.searchParams.get('v') as string;

                let configPath:string = path.join(__dirname, `${Game.RootFolder}/${configName}.json`);
                if (!fs.existsSync(`${configPath}`)) {
                    res.status(200).send(JSON.stringify({
                        success: false,
                        value:'config not found'
                    }));
                } else {
                    let config:Game.Config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' })) as Game.Config;

                    config.game.Backend = backend;
                    config.game.Platform = platform;
                    config.game.UseVConsole = useVConsole;
                    config.playcanvas.version = version;

                    Status.CurrentStatus = {
                        Activity    : 'Build',
                        AppName     : config.playcanvas.name,
                        Platform    : config.game.Platform,
                        Version     : config.playcanvas.version
                    };

                    res.status(200).send(JSON.stringify({
                        success: true,
                        value:`building: [${config.playcanvas.name}] ver [${version}] for [${platform}]`
                    }));
                    let projectDirectory:string = path.join(__dirname, `${Game.RootFolder}/${config.game.Folder}`);
                    if (!fs.existsSync(projectDirectory)) {
                        fs.mkdirSync(projectDirectory);
                    }
                    let authToken = 'lJHHrNEjN3klG93krjX3CrCa8SLIydWy';

                    let androidDirectory:string = path.join(__dirname, `..`, `..`, `www`);

                    // TEST : remove this
                    // Game.PreProcess(config);
                    // return Promise.resolve();

                    // TODO : uncomment for actual build
                    PlayCanvas.Build(authToken, config, projectDirectory, true)
                    .then((zipPath:string) => {
                        console.log(`zipPath: ${zipPath}`);
                        if (config.game.Platform == 'Android') {
                            return Game.PreProcess(config)
                                .then(() => {
                                    return Game.PostProcess(zipPath, `${androidDirectory}`, config);
                                });
                        } else {
                            return Game.PostProcess(zipPath, `${projectDirectory}/${config.game.Platform}`, config);
                        }
                    }) 
                    .then(async () => {
                        if (config.game.Platform == 'Android') {
                            console.log(`build android`);
                            let apkPath:string = Game.CheckExistingApk(config);
                            if (apkPath != '') {
                                let platformAndroid:Game.Platform = 'Android';
                                let oldApkPath:string = path.join(__dirname, `${Game.RootFolder}/${config.game.Folder}/${platformAndroid}/${apkPath}`);
                                del([`${oldApkPath}`]);
                            }
                            const { exec }    = require("child_process");
                            let result:boolean = false;
                            result = await new Promise<boolean>((resolve, reject) => {
                                var command:string = `cordova platform rm android`;
                                console.log(`execute: ${command}`);
                                exec(command, (error:any, stdout:any, stderr:any) => {
                                    if (error) {
                                        console.log(`error: ${error.message}`);
                                        console.log(`android: building: fail 1`);
                                        resolve(false);
                                        return;
                                    }
                                    resolve(true);
                                });
                            });
                            if (!result) {
                                return Promise.resolve(false);
                            }
                            result = await new Promise<boolean>((resolve, reject) => {
                                var command:string = `cordova platform add android`;
                                console.log(`execute: ${command}`);
                                exec(command, (error:any, stdout:any, stderr:any) => {
                                    if (error) {
                                        console.log(`error: ${error.message}`);
                                        console.log(`android: building: fail 2`);
                                        resolve(false);
                                        return;
                                    }
                                    resolve(true);
                                });
                            });
                            if (!result) {
                                return Promise.resolve(false);
                            }
                            result = await new Promise<boolean>((resolve, reject) => {
                                var command:string = `cordova build android`;
                                console.log(`execute: ${command}`);
                                exec(command, (error:any, stdout:any, stderr:any) => {
                                    if (error) {
                                        console.log(`error: ${error.message}`);
                                        console.log(`android: building: fail 3`);
                                        resolve(false);
                                        return;
                                    }
                                    // if (stderr) {
                                    //     console.log(`stderr: ${stderr}`);
                                    //     console.log(`android: building: fail 2`);
                                    //     resolve(false);
                                    //     return;
                                    // }
                                    console.log(`stdout: ${stdout}`);
                                    console.log(`android: building: success`);
                                    let apkSourceFolder:string = path.join(__dirname, `..`, `..`, `platforms/android/app/build/outputs/apk/debug`);
                                    let apkSource:string = path.join(apkSourceFolder, Game.DefaultAPKName);
                                    let apkDestinationFolder:string = path.join(`${projectDirectory}`,`${config.game.Platform}`);
                                    let apkDestination:string = path.join(apkDestinationFolder, `${config.playcanvas.name}_${config.playcanvas.version}_Build.apk`);
                                    if (!fs.existsSync(apkDestinationFolder)) {
                                        fs.mkdirSync(apkDestinationFolder);
                                    }
                                    fs.copyFileSync(apkSource, apkDestination);
                                    resolve(true);
                                });
                            });
                            return Promise.resolve(result);
                        } else {
                            return Promise.resolve(true);
                        }
                    })
                    .then((success:boolean) => {
                        if (config.game.Platform == 'Android') {
                            let wwwDirectory:string = path.join(__dirname, `..`, `..`, `www`);
                            del([`${wwwDirectory}**`]);
                        }

                        Status.CurrentStatus = {
                            Activity    : 'None',
                            AppName     : '',
                            Platform    : 'None',
                            Version     : ''
                        };
    
                    })
                    .catch((err:Error) => {
                        console.log(`error`, err);

                        Status.CurrentStatus = {
                            Activity    : 'None',
                            AppName     : '',
                            Platform    : 'None',
                            Version     : ''
                        };
    
                    });
                }
            }
        });
    }

}

namespace Game {

    export type Backend = `Replicant` | `Cookies` | `Nakama` | `None`; 
    export type Platform = `Facebook` | `Snapchat` | `Web` | `Android` | `None`; 

    const pathTo7zip:string = sevenBin.path7za;

    export const DefaultAPKName:string = `app-debug.apk`;
    
    const CreateCSPMetadata = (csps:{[key:string]:string[]}) => {
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

    export type Config = {
        game   : {
            Config                  : string;
            Folder                  : string;
            Backend                 : Backend;
            Platform                : Platform;
            SnapchatBackendUrl      : string;
            SnapchatNoShareImage    : boolean;
            SnapchatShareImage      : string;
            Thumbnail               : string;
            UseVConsole             : boolean;
            UseGCInstant            : boolean;
            UseOptimizedConfig      : boolean;
        },
        builds : {[platform:string]:string},
    } & PlayCanvas.Config;

    export const PreProcess = async (config:Config) => {
        let rootFolder:string = path.join(__dirname, `..`, `..`);
        let configXMLPath:string = path.join(rootFolder, `config.xml`);
        let packageJSONPath:string = path.join(rootFolder, `package.json`);

        let configXMLContent:string = fs.readFileSync(configXMLPath, { encoding: 'utf8' });
        configXMLContent = configXMLContent.replace(/widget[ ]*id=\"[a-zA-Z0-9.\-]*\"/g, `widget id="com.nowwa.${config.game.Config}"`);
        configXMLContent = configXMLContent.replace(/android-packageName[ ]*=\"[a-zA-Z0-9.\-]*\"/g, `android-packageName="com.nowwa.${config.game.Config}"`);
        configXMLContent = configXMLContent.replace(/version=\"[a-zA-Z0-9._\-]*\"/g, `version="${config.playcanvas.version}"`);
        configXMLContent = configXMLContent.replace(/\<name\>[a-zA-Z0-9.\-]*\<\/name\>/g, `<name>${config.playcanvas.name}</name>`);
        fs.writeFileSync(configXMLPath, configXMLContent, { encoding: 'utf8' });

        let packageJSONContent:string = fs.readFileSync(packageJSONPath, { encoding: 'utf8' });
        packageJSONContent = packageJSONContent.replace(/\"name\"[ ]*:[ ]*\"[a-zA-Z0-9.\-]*\"/g, `"name": "${config.game.Config}"`);
        packageJSONContent = packageJSONContent.replace(/\"displayName\"[ ]*:[ ]*\"[a-zA-Z0-9.\-]*\"/g, `"displayName": "${config.playcanvas.name}"`);
        packageJSONContent = packageJSONContent.replace(/\"version\"[ ]*:[ ]*\"[a-zA-Z0-9.\-]*\"/g, `"version": "${config.playcanvas.version}"`);
        fs.writeFileSync(packageJSONPath, packageJSONContent, { encoding: 'utf8' });

        return Promise.resolve();
    };

    export const PostProcess = async (zipPath:string, extractPath:string, config:Config) => {
    
        console.log(`extract path: ${extractPath}`);
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }
    
        let preloadAndroidZip:string = `${extractPath}/preload-android.zip`;
        let preloadIosZip:string = `${extractPath}/preload-ios.zip`;
    
        if (!fs.existsSync(zipPath)) {
            return Promise.reject(new Error(`file [${zipPath}] does not exists!`));
        }
        
        // extract base.zip file
        await new Promise<void>((resolve, reject) => {
    
            console.log(`-- extracting base.zip file --`);
    
            const zipFile = extractFull(zipPath, extractPath, { $bin: pathTo7zip, $progress: true, recursive: true }); 
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
    
        let indexHTML:string = `${extractPath}/index.html`;
        let gamescriptsJS:string = `${extractPath}/__game-scripts.js`;
    
        let filesToUpdate:string[] = [
            indexHTML, 
            gamescriptsJS,
        ];
    
        let renameTargets:string[][] = [];
    
        if (config.game.UseOptimizedConfig) {
            let configJSON:string = `${extractPath}/config.json`;
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
            { Pattern: /<head>/g, Value: `<head>\n\t<script>buildVersion="${config.playcanvas.version}";</script>` },
            { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Pragma" content="no-cache"/>` },
            { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate"/>` }
        ];
    
        if (!config.playcanvas.scripts_minify) {
            let playcanvasJSFilename:string = `playcanvas-stable.min.js`;
            let playcanvasJSSource:string = path.join(__dirname, `../../src/Utils/playcanvas-stable.js`);
            let playcanvasJSExtracted:string = `${extractPath}/${playcanvasJSFilename}`;
            let playcanvasJSZip:string = `${playcanvasJSFilename}`;
    
            await addFileToZip(playcanvasJSFilename, playcanvasJSSource, playcanvasJSExtracted, playcanvasJSZip);
        }

        if (config.game.UseVConsole) {
            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>useVConsole=true;</script>` });
        }
    
        if (typeof (config.game.Backend) != 'undefined') {
            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>backend="${config.game.Backend}";</script>` });
        }
    
    // FACEBOOK ONLY : start
        if (config.game.Platform == 'Facebook') {
    
            let fbappConfigJSON:string = `${extractPath}/fbapp-config.json`;
            filesToUpdate.push(fbappConfigJSON);
            console.log(`-- add fbapp-config.json --`);
            await copyFile( `./utils/fbapp-config.json`, fbappConfigJSON);
    
            let startScriptJS:string = `${extractPath}/__start__.js`;
            filesToUpdate.push(startScriptJS);
            console.log(`-- add __start__.js --`);
            await copyFile( `./utils/__start__.js`, startScriptJS);
    
            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script src="https://connect.facebook.net/en_US/fbinstant.latest.js"></script>` });
        }
    // FACEBOOK ONLY : end
    
    // SNAPCHAT ONLY : start
        if (config.game.Platform == 'Snapchat') {
    
            if (!config.game.SnapchatNoShareImage) {
                
                let shareImageFilename:string = `share_image.png`;
                let shareImageSource:string = path.join(__dirname,`..`,`..`,`${config.game.SnapchatShareImage}`);
                let shareImageExtracted:string = `${extractPath}/files/assets/${shareImageFilename}`;
                let shareImageZip:string = `files/assets/${shareImageFilename}`;

                console.log(`shareImageSource: ${shareImageSource}`);
    
                await addFileToZip(shareImageFilename, shareImageSource, shareImageExtracted, shareImageZip);
            }
    
            if (typeof (config.game.SnapchatBackendUrl) != 'undefined') {
                indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>snapchatBackendUrl="${config.game.SnapchatBackendUrl}";</script>` });
            }
    
            if (config.game.UseGCInstant) {
                config.csp["connect-src"].push("https://*.amplitude.com");
                config.csp["connect-src"].push("https://*.sentry.io");
            }
        }
    // SNAPCHAT ONLY : end

    // WEB ONLY : start
        if (config.game.Platform == 'Web') {
            
        }
    // WEB ONLY : end

        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>platform="${config.game.Platform}";</script>` });
    
        var cspMetadata = CreateCSPMetadata(config.csp);
        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t${cspMetadata}` });

        await stringReplace(indexHTML, indexHTML, indexHTMLReplaces);
        
        if (config.playcanvas.preload_bundle) {
            
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
        if (config.playcanvas.preload_bundle) {
            preloadBundles.push(preloadAndroidZip);
            preloadBundles.push(preloadIosZip);
        }
    
        console.log(`-- update base.zip --`);
        await new Promise<void>((resolve, reject) => {
    
            const zipFile = add(zipPath, [...filesToUpdate, ...preloadBundles], { $bin: pathTo7zip, $progress: true, recursive: true }); 
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
    
                const zipFile = rename(zipPath, renameTargets, { $bin: pathTo7zip, $progress: true, recursive: true }); 
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
        
        if (config.game.Platform == 'Web' || config.game.Platform == 'Snapchat' || config.game.Platform == 'Android') {
            await del([`${zipPath}`]);
        }
        if (config.game.Platform == 'Facebook') {
            await del([`${extractPath}**`,`${extractPath}`]);
        }
    
        console.log('PostProcess: done');
    
    };
}

export default Game;