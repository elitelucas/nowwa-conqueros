import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Zip from 'adm-zip';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import https from 'https';
import http from 'http';
import formdata from 'form-data';
 
function getBranches(config) {
    return new Promise((resolve, reject) => {
        console.log(config.playcanvas.project_id);
        console.log(config.authToken);
        console.log("✔️ Requested branch list from Playcanvas");
        let url = 'https://playcanvas.com/api/projects/' + config.playcanvas.project_id + '/branches';

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.authToken
            }
        })
        .then(res => {
            if (res.status !== 200) {
                throw new Error("Error: status code " + res.status);
            }
            return res.json();
        })
        .then(branches => {
            resolve(branches);
        })
        .catch(reject);
    });
}

function processBranches (branches) {
    return new Promise((resolve, reject) => {
        console.log("↪️ Processing branch list from Playcanvas");

        let branchData = [];

        let results = branches.result;
        for (let i = 0; i < results.length; i++) {
            let result = results[i];
            branchData.push({
                name: result.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(),
                id: result.id
            });
        }

        resolve(branchData);
    });
}
 
async function archiveBranches(config, branchData) {
    console.log("↪️ Start archiving all " + branchData.length + " branches...");

    // Stict rate limit is 5 requests a miniute so we will keep track of this
    // and wait when need after 5 jobs
    const maxJobs = 5;
    const durationMs = 60 * 1000;
    let startTime = Date.now();
    let currentJobCount = 0;

    let nowDate = new Date(startTime);
    let day = ('0' + nowDate.getDate()).slice(-2);
    let month = ('0' + nowDate.getMonth()).slice(-2);
    let year = nowDate.getFullYear();
    let nowDateString = `${year}-${month}-${day}`;

    for (let i = 0; i < branchData.length; i++) {
        let branch = branchData[i];
        console.log("↪️ " + (i+1) + " of " + branchData.length + " branches: " + branch.name);
        await archiveProject(config, branch.name, branch.id, "temp/out");

        let zipName = `${config.playcanvas.name}_Archive_${branch.name}.zip`;
        let zipPath = `temp/out/${zipName}`;
        let newZipName = nowDateString + zipName;
        await UploadArchive(zipPath, newZipName);

        currentJobCount++;

        if (currentJobCount === maxJobs) {
            // Make sure we don't go other the strict rate limit
            let jobDurationMs = (Date.now() - startTime);

            if (jobDurationMs < durationMs) {
                console.log("↪️ Waiting " + Math.floor(jobDurationMs / 1000) + "s to stay within API rate limits...");
                await sleep(durationMs - jobDurationMs);
            }

            startTime = Date.now();
            currentJobCount = 0;
        }
    }
}
function readConfig() {
    const env = dotenv.config().parsed;
    const configStr = fs.readFileSync('./src/playcanvas.json', 'utf-8');
    const config = JSON.parse(configStr);

    // Add defaults if they don't exist
    config.csp = config.csp || {};
    config.csp['style-src'] = config.csp['style-src'] || [];
    config.csp['connect-src'] = config.csp['connect-src'] || [];
    config.csp.patch_preload_bundles = config.csp.patch_preload_bundles || false;

    config.one_page = config.one_page || {};
    config.one_page.patch_xhr_out = config.one_page.patch_xhr_out || false;
    config.one_page.inline_game_scripts = config.one_page.inline_game_scripts || false;
    config.one_page.mraid_support = config.one_page.mraid_support || false;
    config.one_page.snapchat_cta = config.one_page.snapchat_cta || false;

    // Mon 17 May 2021: Backwards compatibility when this used to be a boolean
    // and convert to an object
    var onePageExternFiles = config.one_page.extern_files;
    if (onePageExternFiles) {
        if (typeof onePageExternFiles === 'boolean') {
            onePageExternFiles = {
                enabled: onePageExternFiles
            }
        }
    }

    config.one_page.compress_engine = config.one_page.compress_engine || '';

    onePageExternFiles = onePageExternFiles || { enabled: false };
    onePageExternFiles.folder_name = onePageExternFiles.folder_name || '';
    onePageExternFiles.external_url_prefix = onePageExternFiles.external_url_prefix || '';

    config.one_page.extern_files = onePageExternFiles;

    return config;
}

function pollJob(config, jobId) {
    var self = this;
    return new Promise((resolve, reject) => {
        console.log("↪️ Polling job ", jobId)
        fetch('https://playcanvas.com/api/jobs/' + jobId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.authToken
            }
        })
        .then(res => res.json())
        .then((json) => {
            if (json.status == "complete") {
                console.log("✔️ Job complete!",)
                resolve(json.data)
            } else if (json.status == "error") {
                console.log("   job error ", json.messages)
                reject(new Error(json.messages.join(';')))
            } else if (json.status == "running") {
                console.log("   job still running");
                return waitAndRetry(config, jobId, resolve);
            }
        })
    });
}

function waitAndRetry(config, jobId, callback) {
    return new Promise(resolve => {
        console.log("   will wait 1s and then retry")
        sleep(1000)
        .then(() => pollJob(config, jobId))
        .then(callback); // nested promises anyone?
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadProject(config, directory) {
    return new Promise((resolve, reject) => {
        console.log("✔️ Requested build from Playcanvas")
        fetch('https://playcanvas.com/api/apps/download', {
            method: 'POST',
            body: JSON.stringify({
                "project_id": parseInt(config.playcanvas.project_id),
                "name": config.playcanvas.name,
                "scenes": config.playcanvas.scenes,
                "branch_id": config.playcanvas.branch_id,
                "description": config.playcanvas.description,
                "preload_bundle": config.playcanvas.preload_bundle,
                "version": config.playcanvas.version,
                "release_notes": config.playcanvas.release_notes,
                "scripts_concatenate": config.playcanvas.scripts_concatenate,
                "scripts_minify": config.playcanvas.scripts_minify,
                "optimize_scene_format": config.playcanvas.optimize_scene_format,
                "engine_version": config.playcanvas.engine_version
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.authToken
            }
        })
        .then(res => {
            if (res.status !== 201) {
                throw new Error("Error: status code " + res.status);
            }
            return res.json();
        })
        .then(buildJob => pollJob(config, buildJob.id))
        .then(json => {
            console.log("✔ Downloading zip", json.download_url);
            return fetch(json.download_url, {method: 'GET'})
        })
        .then(res => res.buffer())
        .then(buffer => {
            let output = path.resolve(__dirname, directory + "/" + config.playcanvas.name + '_Download.zip');
            if (!fs.existsSync(path.dirname(output))) {
                fs.mkdirSync(path.dirname(output), {recursive:true});
            }
            fs.writeFileSync(output, buffer, 'binary')
            resolve(output);
        })
        .catch(reject);
    });
}

function archiveProject(config, branchName, branchId, directory) {
    return new Promise((resolve, reject) => {
        console.log("✔️ Requested archive from Playcanvas")
        fetch('https://playcanvas.com/api/projects/' + config.playcanvas.project_id + '/export', {
            method: 'POST',
            body: JSON.stringify({
                "branch_id": branchId
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.authToken
            }
        })
        .then(res => {
            if (res.status !== 200) {
                throw new Error("Error: status code " + res.status);
            }
            return res.json();
        })
        .then(buildJob => pollJob(config, buildJob.id))
        .then(json => {
            console.log("✔ Downloading zip", json.url);
            return fetch(json.url, {method: 'GET'})
        })
        .then(res => res.buffer())
        .then(buffer => {
            let output = path.resolve(__dirname, directory + "/" + config.playcanvas.name + '_Archive_' + branchName + '.zip');
            if (!fs.existsSync(path.dirname(output))) {
                fs.mkdirSync(path.dirname(output), {recursive:true});
            }
            fs.writeFileSync(output, buffer, 'binary')
            resolve(output);
        })
        .catch(reject);
    });
}

function unzipProject(zipLocation, unzipFolderName) {
    return new Promise((resolve, reject) => {
        console.log('✔️ Unzipping ', zipLocation);
        var zipFile = new Zip(zipLocation);
        try {
            var tempFolder = path.resolve(path.dirname(zipLocation), unzipFolderName);
            if (fs.existsSync(tempFolder)) {
                fs.rmdirSync(tempFolder, {recursive:true});
            }
            fs.mkdirSync(tempFolder);
            zipFile.extractAllTo(tempFolder, true);
            resolve(tempFolder);
        } catch (e) {
            reject(e);
        }
    });
}

function zipProject(rootFolder, targetLocation) {
    return new Promise((resolve, reject) => {
        console.log("✔️ Zipping it all back again")
        let output = path.resolve(__dirname, targetLocation);
        var zip = new Zip();
        zip.addLocalFolder(rootFolder);
        if (!fs.existsSync(path.dirname(output))) {
            fs.mkdirSync(path.dirname(output));
        }
        zip.writeZip(output);
        fs.rmdirSync(rootFolder, {recursive:true});
        resolve(output);
    });
}

function UploadArchive (inputFilePath, outputFileName) {
    return new Promise((resolve,reject) => {
        const platform = 'UNIX';
        //@ts-ignore
        const host = platform == 'UNIX' ? 'nowwa.io' : '127.0.0.1';
        //@ts-ignore
        const urlPath = platform == 'UNIX' ? '/storage/upload' : '/upload';
        //@ts-ignore
        const port = platform == 'UNIX' ? 443 : 9002;
        //@ts-ignore
        const protocol = platform == 'UNIX' ? https : http;
        
        var filepath = path.join(__dirname, inputFilePath);

        console.log(`about to upload zip: ${outputFileName}`);
        console.log(filepath);

        var formData = new formdata();
        formData.append('file', fs.createReadStream(filepath));
        const extraHeaders = {
            filename: outputFileName
        };
        const options = {
            host: host,
            path: urlPath,
            method: 'POST',
            port: port,
            headers: {
                ...formData.getHeaders(),
                'content-disposition': JSON.stringify(extraHeaders)
            }
        };
        const req = protocol.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', d => {
                resolve();
            });
        });
        req.on('error', error => {
            console.error(error);
        });
        formData.pipe(req);
    });
};

const config = readConfig();

getBranches(config)
    .then(processBranches)
    .then((branchData) => archiveBranches(config, branchData))
    .then(() => console.log("Success"))
    .catch(err => console.log("Error", err));