import fetch, { Response } from 'node-fetch';
import fs from 'fs';
import path from 'path';
    
export type PlayCanvasConfig = {
    playcanvas              :{
        project_id              :number;
        name                    :string;
        scenes                  :number[];
        branch_id               :string;
        description?            :string;
        preload_bundle?         :boolean;
        version?                :string;
        release_notes?          :string;
        scripts_concatenate?    :boolean;
        scripts_sourcemaps?     :boolean;
        scripts_minify?         :boolean;
        optimize_scene_format?  :boolean;
    };
    csp                     :{
        "style-src"             :string[];
        "connect-src"           :string[];
    } & {[key:string]           :string[]};
    one_page?               :{
        patch_xhr_out?          :boolean;
        inline_game_scripts?    :boolean;
        extern_files?           :boolean;
    };
    upload?                 :{
        bearer                  :string;
        asset_id                :string;
        branch_id               :string;
        browsers                :"> 1%" | "> 10%";
    };
}

export class PlayCanvas {

    private static async Sleep (ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private static async WaitAndRetry (authToken:string, jobId:any, callback:any, noLog?:boolean) {
        return new Promise(resolve => {
            if (!noLog) console.log("   will wait 1s and then retry")
            this.Sleep(1000)
            .then(() => this.PollJob(authToken, jobId, noLog))
            .then(callback); // nested promises anyone?
        })
    }

    private static async PollJob (authToken:string, jobId:any, noLog?:boolean) {
        return new Promise((resolve, reject) => {
            if (!noLog) console.log("↪️ Polling job ", jobId)
            fetch('https://playcanvas.com/api/jobs/' + jobId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                }
            })
            .then((res:Response) => res.json())
            .then((json:any) => {
                if (json.status == "complete") {
                    console.log("✔️ Job complete!",)
                    resolve(json.data)
                } else if (json.status == "error") {
                    console.log("   job error ", json.messages)
                    reject(new Error(json.messages.join(';')))
                } else if (json.status == "running") {
                    if (!noLog) console.log("   job still running");
                    return this.WaitAndRetry(authToken, jobId, resolve, noLog);
                }
            })
        });
    }
 
    public static async GetBranches (authToken:string, projectId:number) {
        return new Promise<any>((resolve, reject) => {
            console.log("✔️ Requested branch list from Playcanvas");
            let url = 'https://playcanvas.com/api/projects/' + projectId + '/branches';
    
            fetch(url, {
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

    public static async ArchiveAll (authToken:string, projectId:number, directory:string, noLog?:boolean) {
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

    public static async Archive (authToken:string, projectId:number, branchId:string, branchName:string, projectVersion:string, directory:string, noLog?:boolean) {
        return new Promise((resolve, reject) => {
            console.log("✔️ Requested archive from Playcanvas");
            fetch('https://playcanvas.com/api/projects/' + projectId + '/export', {
                method: 'POST',
                body: JSON.stringify({
                    "branch_id": branchId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + authToken
                }
            })
            .then((res:Response) => {
                if (res.status !== 200) {
                    throw new Error("Error: status code " + res.status);
                }
                return res.json();
            })
            .then((buildJob:any) => this.PollJob(authToken, buildJob.id, noLog))
            .then((json:any) => {
                console.log("✔ Downloading zip", json.url);
                return fetch(json.url, {method: 'GET'})
            })
            .then((res:Response) => res.arrayBuffer())
            .then((arrayBuffer:ArrayBuffer) => {
                let output:string = `${directory}/${branchName}_${projectVersion}_Archive.zip`;
                if (!fs.existsSync(path.dirname(output))) {
                    fs.mkdirSync(path.dirname(output), {recursive:true});
                }
                fs.writeFileSync(output, Buffer.from(arrayBuffer), 'binary')
                resolve(output);
            })
            .catch(reject);
        });
    }

    public static async Build (authToken:string, config:PlayCanvasConfig, directory:string, noLog?:boolean) {
        return new Promise((resolve, reject) => {
            console.log("✔️ Requested build from Playcanvas")
            fetch('https://playcanvas.com/api/apps/download', {
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
            .then((res:Response) => {
                if (res.status !== 201) {
                    throw new Error("Error: status code " + res.status);
                }
                return res.json();
            })
            .then((buildJob:any) => this.PollJob(authToken, buildJob.id, noLog))
            .then((json:any) => {
                console.log("✔ Downloading zip", json.download_url);
                return fetch(json.download_url, {method: 'GET'})
            })
            .then((res:Response) => res.arrayBuffer())
            .then((arrayBuffer:ArrayBuffer) => {
                let output:string = `${directory}/${config.playcanvas.name}_${config.playcanvas.version}_Build.zip`;
                console.log(`saving to ${output}`);
                if (!fs.existsSync(path.dirname(output))) {
                    fs.mkdirSync(path.dirname(output), {recursive:true});
                }
                fs.writeFileSync(output, Buffer.from(arrayBuffer), 'binary')
                resolve(output);
            })
            .catch(reject);
        });
    }

    public static async MockBusy ():Promise<void> {
        return new Promise((resolve, reject) => {
            let delay:number = 5000;
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }

}