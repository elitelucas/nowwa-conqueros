"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayCanvas = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PlayCanvas {
    static async Sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async WaitAndRetry(authToken, jobId, callback, noLog) {
        return new Promise(resolve => {
            if (!noLog)
                console.log("   will wait 1s and then retry");
            this.Sleep(1000)
                .then(() => this.PollJob(authToken, jobId))
                .then(callback); // nested promises anyone?
        });
    }
    static async PollJob(authToken, jobId, noLog) {
        return new Promise((resolve, reject) => {
            if (!noLog)
                console.log("↪️ Polling job ", jobId);
            (0, node_fetch_1.default)('https://playcanvas.com/api/jobs/' + jobId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                }
            })
                .then((res) => res.json())
                .then((json) => {
                if (json.status == "complete") {
                    console.log("✔️ Job complete!");
                    resolve(json.data);
                }
                else if (json.status == "error") {
                    console.log("   job error ", json.messages);
                    reject(new Error(json.messages.join(';')));
                }
                else if (json.status == "running") {
                    if (!noLog)
                        console.log("   job still running");
                    return this.WaitAndRetry(authToken, jobId, resolve);
                }
            });
        });
    }
    static async GetBranches(authToken, projectId, noLog) {
        return new Promise((resolve, reject) => {
            console.log("✔️ Requested branch list from Playcanvas");
            let url = 'https://playcanvas.com/api/projects/' + projectId + '/branches';
            (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
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
    static async ArchiveAll(authToken, projectId, directory, noLog) {
        let branches = (await this.GetBranches(authToken, projectId));
        let startTime = Date.now();
        let nowDate = new Date(startTime);
        let day = ('0' + nowDate.getDate()).slice(-2);
        let month = ('0' + (nowDate.getMonth() + 1)).slice(-2);
        let year = nowDate.getFullYear();
        let nowDateString = `${year}-${month}-${day}`;
        for (let i = 0; i < branches.result.length; i++) {
            let branchData = branches.result[i];
            let branchName = branchData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            let branchId = branchData.id;
            await this.Archive(authToken, projectId, branchId, branchName, nowDateString, directory, noLog);
        }
    }
    static async Archive(authToken, projectId, branchId, branchName, projectVersion, directory, noLog) {
        return new Promise((resolve, reject) => {
            console.log("✔️ Requested archive from Playcanvas");
            (0, node_fetch_1.default)('https://playcanvas.com/api/projects/' + projectId + '/export', {
                method: 'POST',
                body: JSON.stringify({
                    "branch_id": branchId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                }
            })
                .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Error: status code " + res.status);
                }
                return res.json();
            })
                .then((buildJob) => this.PollJob(authToken, buildJob.id, noLog))
                .then((json) => {
                console.log("✔ Downloading zip", json.url);
                return (0, node_fetch_1.default)(json.url, { method: 'GET' });
            })
                .then((res) => res.arrayBuffer())
                .then((arrayBuffer) => {
                let output = `${directory}/${branchName}_${projectVersion}_Archive.zip`;
                if (!fs_1.default.existsSync(path_1.default.dirname(output))) {
                    fs_1.default.mkdirSync(path_1.default.dirname(output), { recursive: true });
                }
                fs_1.default.writeFileSync(output, Buffer.from(arrayBuffer), 'binary');
                resolve(output);
            })
                .catch(reject);
        });
    }
    static async Build(authToken, config, directory, noLog) {
        return new Promise((resolve, reject) => {
            console.log("✔️ Requested build from Playcanvas");
            (0, node_fetch_1.default)('https://playcanvas.com/api/apps/download', {
                method: 'POST',
                body: JSON.stringify({
                    "project_id": config.playcanvas.project_id,
                    "name": config.playcanvas.name,
                    "scenes": config.playcanvas.scenes,
                    "branch_id": config.playcanvas.branch_id,
                    "description": config.playcanvas.description,
                    "preload_bundle": config.playcanvas.preload_bundle,
                    "version": config.playcanvas.version,
                    "release_notes": config.playcanvas.release_notes,
                    "scripts_concatenate": config.playcanvas.scripts_concatenate,
                    "scripts_minify": config.playcanvas.scripts_minify,
                    "optimize_scene_format": config.playcanvas.optimize_scene_format
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                }
            })
                .then((res) => {
                if (res.status !== 201) {
                    throw new Error("Error: status code " + res.status);
                }
                return res.json();
            })
                .then((buildJob) => this.PollJob(authToken, buildJob.id, noLog))
                .then((json) => {
                console.log("✔ Downloading zip", json.download_url);
                return (0, node_fetch_1.default)(json.download_url, { method: 'GET' });
            })
                .then((res) => res.arrayBuffer())
                .then((arrayBuffer) => {
                let output = `${directory}/${config.playcanvas.name}_${config.playcanvas.version}_Build.zip`;
                console.log(`saving to ${output}`);
                if (!fs_1.default.existsSync(path_1.default.dirname(output))) {
                    fs_1.default.mkdirSync(path_1.default.dirname(output), { recursive: true });
                }
                fs_1.default.writeFileSync(output, Buffer.from(arrayBuffer), 'binary');
                resolve(output);
            })
                .catch(reject);
        });
    }
}
exports.PlayCanvas = PlayCanvas;
