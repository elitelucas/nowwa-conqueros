import express from 'express';
import CONFIG, { toyUrl, toyBuildUrl, toyListUrl } from '../CONFIG/CONFIG';
import path from 'path';
import fs from 'fs';
import PlayCanvas from './Playcanvas';
import { extractFull, add, rename } from "node-7z";
import { stringReplace, Replace, removeNullAndFalse, removeNull } from "../../UTIL/Utils";
import sevenBin from '7zip-bin';
import del from 'del';
import Status from './Status';
import EXPRESS from '../EXPRESS/EXPRESS';

class Build {

    private static Instance: Build;

    private static RootFolder: string = `../../../storage/toy`;

    /**
     * Initialize game module.
     */
    public static async AsyncInit(): Promise<void> 
    {
        Build.Instance = new Build();
        Build.WebhookList();
        Build.WebhookBuild();
        return Promise.resolve();
    }


    public static WebhookList(): void 
    {
        EXPRESS.app.use(`${toyListUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let fullPath: string = path.join(__dirname, `${Build.RootFolder}`);
            // console.log(`Game : ${fullPath}`);
            if (fs.existsSync(fullPath)) {
                let stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fs.readdir(fullPath, (err, contents) => {
                        if (err) {
                            throw err;
                        }

                        // TODO : read config files

                        let configs: Build.Config[] = [];

                        contents.forEach(content => {
                            let contentPath: string = path.join(fullPath, content);
                            let isFile: boolean = fs.statSync(contentPath).isFile();
                            if (isFile) {
                                let extension: string = contentPath.substring(contentPath.lastIndexOf(`.`));
                                // console.log(`extension: ${extension}`);
                                if (extension == `.json`) {
                                    // console.log(`config file: ${contentPath}`);
                                    let config = JSON.parse(fs.readFileSync(contentPath, { encoding: 'utf8', flag: 'r' })) as Build.Config;

                                    let platformWeb: Build.Platform = 'Web';
                                    let platformWebFolder: string = path.join(fullPath, `${config.game.Folder}`, `${platformWeb}`);
                                    if (fs.existsSync(platformWebFolder)) {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = {};
                                        }
                                        config.builds[platformWeb.toString()] = `${toyUrl}/${config.game.Folder}/${platformWeb}/`;
                                    }

                                    let platformSnapchat: Build.Platform = 'Snapchat';
                                    let platformSnapchatFolder: string = path.join(fullPath, `${config.game.Folder}`, `${platformSnapchat}`);
                                    if (fs.existsSync(platformSnapchatFolder)) {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = {};
                                        }
                                        config.builds[platformSnapchat.toString()] = `${toyUrl}/${config.game.Folder}/${platformSnapchat}/`;
                                    }

                                    let platformAndroid: Build.Platform = 'Android';
                                    let apkPath: string = Build.CheckExistingApk(config);
                                    if (apkPath != '') {
                                        if (typeof config.builds == 'undefined') {
                                            config.builds = {};
                                        }
                                        config.builds[platformAndroid.toString()] = `${toyUrl}/${config.game.Folder}/${platformAndroid}/${apkPath}`;
                                    }

                                    configs.push(config);
                                }
                            }
                        });

                        let output = JSON.stringify({ configs: configs });
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
     * Do Android build process (after post processing).
     * @param config 
     * @returns 
     */
    private static AndroidProcess = async (config: Build.Config) => {
        let projectDirectory: string = path.join(__dirname, `${Build.RootFolder}/${config.game.Folder}`);
        console.log(`build android`);
        const { spawn } = require("child_process");
        await new Promise<void>((resolve, reject) => {
            let apkPath: string = Build.CheckExistingApk(config);
            if (apkPath != '') {
                let platformAndroid: Build.Platform = 'Android';
                let oldApkPath: string = path.join(__dirname, `${Build.RootFolder}/${config.game.Folder}/${platformAndroid}/${apkPath}`);
                del([`${oldApkPath}`]);
            }
            resolve();
        });
        let commands: string[] = [
            `cordova platform rm android`,
            `cordova platform add android@^11.0.0`,
            `cordova prepare android`,
            `cordova build android`
        ];
        for (let i = 0; i < commands.length; i++) {
            var command: string = commands[i];
            console.log(`execute: ${command}`);
            await new Promise<void>((resolve, reject) => {
                let task = spawn(command, { shell: true, windowsHide: false });
                task.stdout.on('data', (data: any) => {
                    console.log(`= stdout =`);
                    console.log(`${data}`);
                });
                task.stderr.on('data', (data: any) => {
                    console.log(`= stderr =`);
                    console.log(`${data}`);
                });
                task.on('error', (err: any) => {
                    console.log(`error: ${err.message}`);
                    console.log(`android: building: fail: ${command}`);
                    reject(err);
                    return;
                });
                task.on('exit', (code: any) => {
                    console.log(`code: ${code}`);
                    resolve();
                });
            });
        }
        await new Promise<void>((resolve, reject) => 
        {
            let apkSourceFolder: string = path.join(__dirname, `..`, `..`, `platforms/android/app/build/outputs/apk/debug`);
            let apkSource: string = path.join(apkSourceFolder, Build.DefaultAPKName);
            let apkDestinationFolder: string = path.join(`${projectDirectory}`, `${config.game.Platform}`);
            let apkDestination: string = path.join(apkDestinationFolder, `${config.playcanvas.name}_${config.playcanvas.version}_Build.apk`);
            if (!fs.existsSync(apkDestinationFolder)) {
                fs.mkdirSync(apkDestinationFolder);
            }
            console.log(`android: destination: ${apkDestination}`);
            fs.copyFileSync(apkSource, apkDestination);
            resolve();
        });
        console.log(`android: building: success`);
        return Promise.resolve(true);
    };

    /**
     * Do iOS build process (after post processing).
     * @param config 
     */
    private static iOSProcess = async (config: Build.Config) => {
        console.log(`build ios`);
        const { spawn } = require("child_process");
        let isSkipping: boolean = false;
        let actualMessage: string = `auto build ios | project: ${config.playcanvas.name} | version: ${config.playcanvas.version}`;
        let skipMessage: string = "[skip ci]";
        let commitMessage: string = isSkipping ? skipMessage : '' + ` | ${actualMessage}`;
        let commands: string[] = [
            `cd ../cordova-ios && git pull && git add . && git commit -m "${commitMessage}" && git push`,
        ];
        for (let i = 0; i < commands.length; i++) {
            var command: string = commands[i];
            console.log(`execute: ${command}`);
            await new Promise<void>((resolve, reject) => {
                let task = spawn(command, { shell: true, windowsHide: false });
                task.stdout.on('data', (data: any) => {
                    console.log(`= stdout =`);
                    console.log(`${data}`);
                });
                task.stderr.on('data', (data: any) => {
                    console.log(`= stderr =`);
                    console.log(`${data}`);
                });
                task.on('error', (err: any) => {
                    console.log(`error: ${err.message}`);
                    console.log(`ios: building: fail: ${command}`);
                    reject(err);
                    return;
                });
                task.on('exit', (code: any) => {
                    console.log(`code: ${code}`);
                    resolve();
                });
            });
        }
        console.log(`ios: building: success`);
        return Promise.resolve(true);
    };

    /**
     * Check if there is an existing apk
     */
    private static CheckExistingApk(config: Build.Config): string {
        let fullPath: string = path.join(__dirname, `${Build.RootFolder}`);

        let platformAndroid: Build.Platform = 'Android';
        let platformAndroidFolder: string = path.join(fullPath, `${config.game.Folder}`, `${platformAndroid}`);
        let output: string = '';
        if (fs.existsSync(platformAndroidFolder)) {
            let stat = fs.statSync(platformAndroidFolder);
            if (stat.isDirectory()) {
                let contents = fs.readdirSync(platformAndroidFolder);
                contents.forEach(content => {
                    var contentPath = path.join(platformAndroidFolder, content);
                    var isFile: boolean = fs.statSync(contentPath).isFile();
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

    public static WebhookBuild(): void 
    {
        EXPRESS.app.use(`${toyBuildUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            if (Status.CurrentStatus.Activity != 'None') {
                console.log(`Game.CurrentActivity: ${Status.CurrentStatus.Activity}`);
                res.status(500).send(`PLAYCANVAS BUSY | `);
            } else {
                let url: URL = new URL(`${CONFIG.PublicUrl}${req.originalUrl}`);

                let configName: string = url.searchParams.get('n') as string;
                let backend: Build.Backend = url.searchParams.get('b') as Build.Backend;
                let platform: Build.Platform = url.searchParams.get('p') as Build.Platform;
                let useVConsole: boolean = (url.searchParams.get('d') as string) == '1';
                let version: string = url.searchParams.get('v') as string;

                let configPath: string = path.join(__dirname, `${Build.RootFolder}/${configName}.json`);
                if (!fs.existsSync(`${configPath}`)) {
                    res.status(200).send(JSON.stringify({
                        success: false,
                        value: 'config not found'
                    }));
                } else {
                    let config: Build.Config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf8', flag: 'r' })) as Build.Config;

                    config.game.Backend = backend;
                    config.game.Platform = platform;
                    config.game.UseVConsole = useVConsole;
                    config.playcanvas.version = version;

                    Status.CurrentStatus = {
                        Activity: 'Build',
                        AppName: config.playcanvas.name,
                        Platform: config.game.Platform,
                        Version: config.playcanvas.version
                    };

                    res.status(200).send(JSON.stringify({
                        success: true,
                        value: `building: [${config.playcanvas.name}] ver [${version}] for [${platform}]`
                    }));
                    let projectDirectory: string = path.join(__dirname, `${Build.RootFolder}/${config.game.Folder}`);
                    if (!fs.existsSync(projectDirectory)) {
                        fs.mkdirSync(projectDirectory);
                    }
                    let authToken = 'lJHHrNEjN3klG93krjX3CrCa8SLIydWy';

                    // TEST : uncomment this
                    // Build.PreProcess(config);
                    // console.log(`Platform: ${config.game.Platform}`);
                    // Status.CurrentStatus = Status.DetailDefault;
                    // return Promise.resolve();

                    // TEST : build only
                    // PlayCanvas.Build(authToken, config, projectDirectory, true)
                    //     .then((zipPath: string) => {
                    //         console.log(`zipPath: ${zipPath}`);
                    //     })
                    //     .catch((err: Error) => {
                    //         console.log(`error`, err);

                    //         console.log(`build error: ${err.message}`);

                    //     })
                    //     .finally(() => {
                    //         Status.CurrentStatus = Status.DetailDefault;
                    //     });
                    // return Promise.resolve();

                    PlayCanvas.Build(authToken, config, projectDirectory, true)
                        .then((zipPath: string) => {
                            return new Promise<string>((resolve, reject) => {
                                Build.PreProcess(config)
                                    .then(() => {
                                        resolve(zipPath);
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    })
                            });
                        })
                        .then((zipPath: string) => {
                            console.log(`zipPath: ${zipPath}`);
                            if (config.game.Platform == 'Android') {
                                let androidDirectory: string = path.join(__dirname, `..`, `..`, `www`);
                                del([`${androidDirectory} ** `]);
                                return Build.PostProcess(zipPath, `${androidDirectory}`, config);
                            } else if (config.game.Platform == 'iOS') {
                                let iosDirectory: string = path.join(__dirname, `..`, `..`, `..`, `cordova-ios`, `www`);
                                del([`${iosDirectory} ** `]);
                                return Build.PostProcess(zipPath, `${iosDirectory}`, config);
                            } else {
                                return Build.PostProcess(zipPath, `${projectDirectory}/${config.game.Platform}`, config);
                            }
                        })
                        .then(async () => {
                            if (config.game.Platform == 'Android') {
                                return Build.AndroidProcess(config);
                            } else if (config.game.Platform == 'iOS') {
                                return Build.iOSProcess(config);
                            } else {
                                return Promise.resolve(true);
                            }
                        })
                        .then((success: boolean) => {
                            if (config.game.Platform == 'Android' || config.game.Platform == 'iOS') {
                                // del([`${wwwDirectory} ** `]);
                            }

                            console.log(`build finished: ${success}`);

                        })
                        .catch((err: Error) => {
                            console.log(`error`, err);

                            console.log(`build error: ${err.message}`);

                        })
                        .finally(() => {
                            Status.CurrentStatus = Status.DetailDefault;
                        });
                }
            }
        });
    }

}

namespace Build 
{
    export type Backend = `Replicant` | `Cookies` | `Nakama` | `None`;
    export type Platform = `Facebook` | `Snapchat` | `Web` | `Android` | `iOS` | `None`;

    const pathTo7zip: string = sevenBin.path7za;

    export const DefaultAPKName: string = `app-debug.apk`;

    const CreateCSPMetadata = (csps: { [key: string]: string[] }) => 
    {
        var tag: string = "<meta http-equiv=\"Content-Security-Policy\" content=\"{0}\" />"
        var content: string = "";
        for (var key in csps) {
            if (key !== 'patch_preload_bundles') {
                content += key;
                for (var i in csps[key]) {
                    var value: string = csps[key][i];
                    content += " " + value
                }
                content += "; "
            }
        }

        return tag.replace("{0}", content);
    };

    export type Config = {
        game: {
            Config: string;
            Folder: string;
            Backend: Backend;
            Platform: Platform;
            SnapchatBackendUrl: string;
            SnapchatNoShareImage: boolean;
            SnapchatShareImage: string;
            Thumbnail: string;
            UseVConsole: boolean;
            UseGCInstant: boolean;
            UseOptimizedConfig: boolean;
        },
        builds: { [platform: string]: string },
    } & PlayCanvas.Config;

    export const PreProcess = async (config: Config) => {

        if (config.game.Platform == 'Android' || config.game.Platform == 'iOS') {
            let rootFolder: string = path.join(__dirname, `..`, `..`);
            if (config.game.Platform == 'iOS') {
                rootFolder = path.join(rootFolder, `..`, `cordova-ios`);
            }

            let configXMLPath: string = path.join(rootFolder, `config.xml`);
            let configXMLContent: string = fs.readFileSync(configXMLPath, { encoding: 'utf8' });
            configXMLContent = configXMLContent.replace(/widget[ ]*id=\"[a-zA-Z0-9.\-]*\"/g, `widget id="com.nowwa.${config.game.Config}"`);
            configXMLContent = configXMLContent.replace(/android-packageName[ ]*=\"[a-zA-Z0-9.\-]*\"/g, `android-packageName="com.nowwa.${config.game.Config}"`);
            configXMLContent = configXMLContent.replace(/version=\"[a-zA-Z0-9._\-]*\"/g, `version="${config.playcanvas.version}"`);
            configXMLContent = configXMLContent.replace(/\<name\>[a-zA-Z0-9._\- ]*\<\/name\>/g, `<name>${config.playcanvas.name}</name>`);
            fs.writeFileSync(configXMLPath, configXMLContent, { encoding: 'utf8' });

            if (config.game.Platform == 'Android') {
                let packageJSONPath: string = path.join(rootFolder, `package.json`);
                let packageJSONContent: string = fs.readFileSync(packageJSONPath, { encoding: 'utf8' });
                packageJSONContent = packageJSONContent.replace(/\"name\"[ ]*:[ ]*\"[a-zA-Z0-9.\-]*\"/g, `"name": "${config.game.Config}"`);
                packageJSONContent = packageJSONContent.replace(/\"displayName\"[ ]*:[ ]*\"[a-zA-Z0-9.\-]*\"/g, `"displayName": "${config.playcanvas.name}"`);
                packageJSONContent = packageJSONContent.replace(/\"version\"[ ]*:[ ]*\"[a-zA-Z0-9.\-]*\"/g, `"version": "${config.playcanvas.version}"`);
                fs.writeFileSync(packageJSONPath, packageJSONContent, { encoding: 'utf8' });
            }

            if (config.game.Platform == 'iOS') {
                let codemagicYAMLPath: string = path.join(rootFolder, `codemagic.yaml`);
                let codemagicYAMLContent: string = fs.readFileSync(codemagicYAMLPath, { encoding: 'utf8' });
                codemagicYAMLContent = codemagicYAMLContent.replace(/bundle_identifier: [a-zA-Z0-9.\-]*/g, `bundle_identifier: com.nowwa.${config.game.Config}`);
                codemagicYAMLContent = codemagicYAMLContent.replace(/XCODE_WORKSPACE: \"platforms\/ios\/[a-zA-Z0-9._\- ]*.xcworkspace\"/g, `XCODE_WORKSPACE: "platforms/ios/${config.playcanvas.name}.xcworkspace"`);
                codemagicYAMLContent = codemagicYAMLContent.replace(/XCODE_SCHEME: \"[a-zA-Z0-9._\- ]*\"/g, `XCODE_SCHEME: "${config.playcanvas.name}"`);
                fs.writeFileSync(codemagicYAMLPath, codemagicYAMLContent, { encoding: 'utf8' });
            }
        }

        return Promise.resolve();
    };

    export const PostProcess = async (zipPath: string, extractPath: string, config: Config) => {

        console.log(`extract path: ${extractPath}`);
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath);
        }

        let preloadAndroidZip: string = `${extractPath}/preload-android.zip`;
        let preloadIosZip: string = `${extractPath}/preload-ios.zip`;

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

            zipFile.on('error', (err) => {
                console.log(`err: ${JSON.stringify(err)}`);
            });

            zipFile.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });

        let indexHTML: string = `${extractPath}/index.html`;
        let gamescriptsJS: string = `${extractPath}/__game-scripts.js`;

        let filesToUpdate: string[] = [
            indexHTML,
            gamescriptsJS,
        ];

        let renameTargets: string[][] = [];

        if (config.game.UseOptimizedConfig) {
            let configJSON: string = `${extractPath}/config.json`;
            filesToUpdate.push(configJSON);

            console.log(`-- optimize config.json --`);
            await new Promise<void>((resolve, reject) => {
                fs.readFile(configJSON, 'utf8', function (errConfigJSON, dataConfigJSON) {

                    if (errConfigJSON) {
                        console.log(errConfigJSON);
                        reject();
                        return;
                    }

                    const data = JSON.parse(dataConfigJSON);
                    const keys = Object.keys(data.assets);

                    keys.forEach(
                        (key) => {
                            const current = data.assets[key];
                            const light: { [key: string]: any } = {};

                            light.tags = current.tags;
                            light.name = current.name;
                            light.preload = current.preload;
                            light.exclude = current.exclude;
                            light.meta = current.meta;
                            light.data = current.data;
                            light.type = current.type;
                            light.file = current.file;
                            light.region = current.region;
                            light.i18n = current.i18n;
                            light.id = current.id;

                            if (light.file) delete (light.file.hash);
                            if (light.file) delete (light.file.size);

                            if (typeof (light.i18n) !== 'undefined' && Object.keys(light.i18n).length === 0)
                                delete (light.i18n);

                            if (typeof (light.tags) !== 'undefined' && light.tags.length === 0)
                                delete (light.tags);

                            removeNull(light);
                            if (light.meta) {
                                removeNull(light.meta);
                                if (light.meta.compress)
                                    removeNull(light.meta.compress);
                            }

                            if (light.data) {
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

        async function addFileToZip(fileName: string, sourcePath: string, extractedPath: string, zipPath: string) {
            console.log(`-- add ${fileName} --`);
            filesToUpdate.push(extractedPath);
            fs.copyFileSync(sourcePath, extractedPath);

            renameTargets.push([fileName, zipPath]);
        }

        console.log(`-- update index.html --`);
        var indexHTMLReplaces: Replace[] = [
            { Pattern: /<head>/g, Value: `<head>\n\t<script>buildVersion="${config.playcanvas.version}";</script>` },
            { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Pragma" content="no-cache"/>` },
            { Pattern: /<head>/g, Value: `<head>\n\t<meta http-equiv="Cache-control" content="no-cache, no-store, must-revalidate"/>` }
        ];

        if (!config.playcanvas.scripts_minify) {
            let playcanvasJSFilename: string = `playcanvas-stable.min.js`;
            let playcanvasJSSource: string = path.join(__dirname, `../../src/Utils/${playcanvasJSFilename}`);
            let playcanvasJSExtracted: string = `${extractPath}/${playcanvasJSFilename}`;
            let playcanvasJSZip: string = `${playcanvasJSFilename}`;

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

            let fbappConfigJSON: string = `${extractPath}/fbapp-config.json`;
            filesToUpdate.push(fbappConfigJSON);
            console.log(`-- add fbapp-config.json --`);
            fs.copyFileSync(`./utils/fbapp-config.json`, fbappConfigJSON);

            let startScriptJS: string = `${extractPath}/__start__.js`;
            filesToUpdate.push(startScriptJS);
            console.log(`-- add __start__.js --`);
            fs.copyFileSync(`./utils/__start__.js`, startScriptJS);

            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script src="https://connect.facebook.net/en_US/fbinstant.latest.js"></script>` });
        }
        // FACEBOOK ONLY : end

        // SNAPCHAT ONLY : start
        if (config.game.Platform == 'Snapchat') {

            var cspMetadata = CreateCSPMetadata(config.csp);
            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t${cspMetadata}` });

            if (!config.game.SnapchatNoShareImage) {

                let shareImageFilename: string = `share_image.png`;
                let shareImageSource: string = path.join(__dirname, `..`, `..`, `${config.game.SnapchatShareImage}`);
                let shareImageExtracted: string = `${extractPath}/files/assets/${shareImageFilename}`;
                let shareImageZip: string = `files/assets/${shareImageFilename}`;
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

            let onesignalSDKFilename: string = `OneSignalSDK.js`;
            let onesignalSDKSource: string = path.join(__dirname, `..`, `..`, `/src/Utils/${onesignalSDKFilename}`);
            let onesignalSDKExtracted: string = `${extractPath}/${onesignalSDKFilename}`;

            fs.copyFileSync(onesignalSDKSource, onesignalSDKExtracted);

            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script src="${onesignalSDKFilename}" async=""></script>` });

            let onesignalFilename: string = `onesignal-web.js`;
            let onesignalSource: string = path.join(__dirname, `..`, `..`, `/src/Utils/${onesignalFilename}`);
            let onesignalExtracted: string = `${extractPath}/${onesignalFilename}`;

            fs.copyFileSync(onesignalSource, onesignalExtracted);

            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script type="text/javascript" src="${onesignalFilename}"></script>` });
        }
        // WEB ONLY : end

        // ANDROID ONLY : start
        if (config.game.Platform == 'Android') {

            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script type="text/javascript" src="cordova.js"></script>` });

            let onesignalFilename: string = `onesignal.js`;
            let onesignalSource: string = path.join(__dirname, `..`, `..`, `/src/Utils/${onesignalFilename}`);
            let onesignalExtracted: string = `${extractPath}/${onesignalFilename}`;
            let onesignalZip: string = `${onesignalFilename}`;

            await addFileToZip(onesignalFilename, onesignalSource, onesignalExtracted, onesignalZip);

            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script type="text/javascript" src="${onesignalFilename}"></script>` });
        }
        // ANDROID ONLY : end

        // IOS ONLY : start
        if (config.game.Platform == 'iOS') {

            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script type="text/javascript" src="cordova.js"></script>` });

            let onesignalFilename: string = `onesignal.js`;
            let onesignalSource: string = path.join(__dirname, `..`, `..`, `/src/Utils/${onesignalFilename}`);
            let onesignalExtracted: string = `${extractPath}/${onesignalFilename}`;
            let onesignalZip: string = `${onesignalFilename}`;

            await addFileToZip(onesignalFilename, onesignalSource, onesignalExtracted, onesignalZip);

            indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script type="text/javascript" src="${onesignalFilename}"></script>` });
        }
        // IOS ONLY : end

        indexHTMLReplaces.splice(0, 0, { Pattern: /<head>/g, Value: `<head>\n\t<script>platform="${config.game.Platform}";</script>` });

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

                zipFile.on('error', (err) => {
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

                    zipFile.on('error', (err) => {
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

                zipFile.on('error', (err) => {
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

                    zipFile.on('error', (err) => {
                        console.log(`err: ${JSON.stringify(err)}`);
                    });

                    zipFile.on('end', function () {
                        // end of the operation, get the number of folders involved in the operation
                        resolve();
                    });

                });
            }

        }

        let preloadBundles: string[] = [];
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

            zipFile.on('error', (err) => {
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

                zipFile.on('error', (err) => {
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
            await del([`${extractPath}**`, `${extractPath}`]);
        }

        console.log('PostProcess: done');

    };
}

export default Build;