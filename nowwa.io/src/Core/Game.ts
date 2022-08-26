import express from 'express';
import { EnvType } from 'ts-dotenv';
import Environment, { baseUrl, toyBuildUrl, storageFullUrl, storageUrl, toyListUrl as toyListUrl } from './Environment';
import path from 'path';
import fs, { readdirSync } from 'fs';
import PlayCanvas from './Playcanvas';
import { extractFull, add, rename } from "node-7z";
import { stringReplace, Replace, removeNullAndFalse, removeNull } from "./Utils";
import sevenBin from '7zip-bin';
import del from 'del';
import { copyFile } from "fs/promises";
import { type } from "os";

class Game {

    private static Instance:Game;

    private static RootFolder:string = `../../storage/toy`;

    /**
     * Initialize game module.
     */
    public static async AsyncInit (app:express.Express, env:EnvType<typeof Environment>):Promise<void> {
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

                        let configs:any[] = [];
                        
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
                                    let platformWebFolder:string = path.join(fullPath, `${config.playcanvas.name}`, `${platformWeb}`);
                                    if (fs.existsSync(platformWebFolder)) {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = [];
                                        }
                                        config.builds.push(platformWeb);
                                    }
                                    
                                    let platformSnapchat:Game.Platform = 'Snapchat';
                                    let platformSnapchatFolder:string = path.join(fullPath, `${config.playcanvas.name}`, `${platformSnapchat}`);
                                    if (fs.existsSync(platformSnapchatFolder)) {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = [];
                                        }
                                        config.builds.push(platformSnapchat);
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
     * Webhook for build toy games. 
     * @param app @type {express.Express}
     */
    public static WebhookBuild (app:express.Express):void {
        app.use(`${toyBuildUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            if (PlayCanvas.CurrentStatus.Activity != 'None') {
                console.log(`PlayCanvas.CurrentActivity: ${PlayCanvas.CurrentStatus.Activity}`);
                res.status(500).send(`PLAYCANVAS BUSY | `);
            } else {
                let url:URL = new URL(`${baseUrl}${req.originalUrl}`);

                let configName:string = url.searchParams.get('n') as string;
                let backend:Game.Backend = url.searchParams.get('b') as Game.Backend;
                let platform:Game.Platform = url.searchParams.get('p') as Game.Platform;
                let useVConsole:boolean = (url.searchParams.get('d') as string) == '1';
                let version:string = url.searchParams.get('v') as string;

                let configPath:string = path.join(__dirname, `${Game.RootFolder}/${configName}.json`);
                console.log(`configPath: ${configPath}`);
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

                    res.status(200).send(JSON.stringify({
                        success: true,
                        value:`building: [${config.playcanvas.name}] ver [${version}] for [${platform}]`
                    }));
                    let directory:string = path.join(__dirname, `${Game.RootFolder}/${config.playcanvas.name}`);
                    if (!fs.existsSync(directory)) {
                        fs.mkdirSync(directory);
                    }
                    let authToken = 'lJHHrNEjN3klG93krjX3CrCa8SLIydWy';

                    console.log(`config.playcanvas.version: ${config.playcanvas.version}`);
                    console.log(`version: ${version}`);

                    // TODO : uncomment for actual build
                    PlayCanvas.Build(authToken, config, directory, true)
                    .then((zipPath:string) => {
                        console.log(`zipPath: ${zipPath}`);
                        return Game.PostProcess(zipPath, `${directory}/${config.game.Platform}`,config);
                    })
                    .then(() => {
                        console.log(`post process done`);
                    })
                    .catch((err:Error) => {
                        console.log(`error`, err);
                    });

                    // HACK : bypass download build
                    // let zipPath = `${directory}/${config.playcanvas.name}_${config.playcanvas.version}_Build.zip`;
                    // Game.PostProcess(zipPath, `${directory}/${config.game.Platform}`, config);
                }
            }
        });
    }

}

namespace Game {

    export type Backend = `Replicant` | `Cookies` | `Nakama`; 
    export type Platform = `Facebook` | `Snapchat` | `Web`; 

    const pathTo7zip:string = sevenBin.path7za;
    
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
        builds : Platform[],
    } & PlayCanvas.Config;

    export const PostProcess = async (baseZip:string, basePath:string, config:Config, zipBack:boolean = false) => {
    
        console.log(`extract path: ${basePath}`);
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath);
        }
    
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
    
        if (config.game.UseOptimizedConfig) {
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
            { Pattern: /<head>/g, Value: `<head>\n\t<script>buildVersion="${config.playcanvas.version}";</script>` },
            { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Pragma" content="no-cache"/>` },
            { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate"/>` }
        ];
    
        if (!config.playcanvas.scripts_minify) {
            let playcanvasJSFilename:string = `playcanvas-stable.min.js`;
            let playcanvasJSSource:string = path.join(__dirname, `../../src/Utils/playcanvas-stable.js`);
            let playcanvasJSExtracted:string = `${basePath}/${playcanvasJSFilename}`;
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
        if (config.game.Platform == 'Snapchat') {
            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>platform="Snapchat";</script>` });
    
            if (!config.game.SnapchatNoShareImage) {
                
                let shareImageFilename:string = `share_image.png`;
                let shareImageSource:string = path.join(__dirname,`..`,`..`,`${config.game.SnapchatShareImage}`);
                let shareImageExtracted:string = `${basePath}/files/assets/${shareImageFilename}`;
                let shareImageZip:string = `files/assets/${shareImageFilename}`;

                console.log(`shareImageSource: ${shareImageSource}`);
    
                await addFileToZip(shareImageFilename, shareImageSource, shareImageExtracted, shareImageZip);
            }
    
            if (config.game.UseGCInstant) {
                config.csp["connect-src"].push("https://*.amplitude.com");
                config.csp["connect-src"].push("https://*.sentry.io");
            }
    
            if (typeof (config.game.SnapchatBackendUrl) != 'undefined') {
                indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>snapchatBackendUrl="${config.game.SnapchatBackendUrl}";</script>` });
            }
        }
    // SNAPCHAT ONLY : end

    // WEB ONLY : start
        if (config.game.Platform == 'Web') {
            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>platform="Web";</script>` });
        }
    // WEB ONLY : end
    
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
        
        if (config.game.Platform == 'Web' || config.game.Platform == 'Snapchat') {
            await del([`${baseZip}`]);
        }
        if (config.game.Platform != 'Web' && config.game.Platform != 'Snapchat') {
            await del([`${basePath}**`,`${basePath}`]);
        }
    
        console.log('done');
    
    };
}

export default Game;