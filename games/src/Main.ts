import express, { response } from 'express';
import serveStatic from 'serve-static';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { load } from 'ts-dotenv';
import Environment from './Environment';
import crypto from 'crypto';
import { PlayCanvas, PlayCanvasConfig } from './Playcanvas';
import { extractFull } from "node-7z";
import sevenBin from '7zip-bin';
import del from 'del';
import { exec } from 'child_process';

const pathTo7zip:string = sevenBin.path7za;

console.log(`project path: ${__dirname}`);

const envPath = path.resolve(__dirname, `../.env`);
console.log(`load .env from: ${envPath}`);
const env = load(Environment, {
    path: envPath,
    encoding: 'utf-8',
}); 

class Main {

    private port:number = 9001;

    private app:express.Express;

    private secret:string = "conqueros";

    constructor () {
        this.app = express();
        this.currentBranchId = "";
        this.isStillArchiving = false;
        this.Initialize();
    }


    /**
     * Initialize necessary components.
     */
    private async Initialize () {
        console.log(`initialize...`);
        await this.InitExpress();
    }

    /**
     * Initialize express.
     */
    private async InitExpress ():Promise<void> {
        try {
            console.log(`init express...`);
    
            var self:Main = this;

            self.app.enable('strict routing');
            self.app
                .use(express.json())
                .use(express.urlencoded({
                    extended            :false
                }))
                .use(cors())
                .use(session({ 
                    genid               : () => crypto.randomBytes(48).toString('hex'),
                    secret              : self.secret,
                    resave              : true,
                    saveUninitialized   : true,
                    cookie              : {
                        maxAge          : (1000 * 60 * 100)
                    }
                }));

            self.ExpressGetDefault();
    
            console.log(`set port...`);
            self.app.listen(self.port);
            console.log(`listening on port ${self.port}`);
        }
        catch (error) {
            console.error(<Error>error);
        }
    }


    private isStillArchiving:boolean;
    private currentBranchId:string;
    /**
     * Set express response for GET default '/' call.
     */
    private async ExpressGetDefault () {
        console.log(`set express get default...`);
    
        var self:Main = this;
    
        self.app.use((req, res, next) => {
            var adjustedUrl = req.url;
            if (adjustedUrl.indexOf('//') == 0) {
                adjustedUrl = adjustedUrl.slice(1);
            } 
            if (!adjustedUrl.match(/\.[a-zA-Z0-9_\-]+$/g) && (adjustedUrl[adjustedUrl.length - 1] != '/')) {
                let baseUrl:string = `http://127.0.0.1:9001`;
                // let baseUrl:string = `http://127.0.0.1:9001/games`;
                res.redirect(`${baseUrl}/games${adjustedUrl}/`);
            } else if (adjustedUrl.indexOf('/toybuild/') == 0) {
                console.log(`adjustedUrl: ${adjustedUrl}`);
                if (this.isStillArchiving) {
                    res.status(200).send(`BUSY - still processing branch ID: ${this.currentBranchId}`);
                } else {
                        
                    let authToken:string = 'lJHHrNEjN3klG93krjX3CrCa8SLIydWy';
                    let projectId:number = 873503;
                    const url = new URL('http://origin.com/' +
                        (adjustedUrl.slice('/toybuild/'.length).slice(0, -1)));
                    let branchId = url.searchParams.get('branch') as string;
                    let scenes = url.searchParams.get('scenes') as string;
                    let sceneNumbers = scenes.indexOf(',') >= 0 ? scenes.split(',').map(Number) : [parseInt(scenes)];

                    let startTime = Date.now();
                    let nowDate = new Date(startTime);
                    let seconds = ('0' + nowDate.getSeconds()).slice(-2);
                    let minutes = ('0' + nowDate.getMinutes()).slice(-2);
                    let hours = ('0' + nowDate.getHours()).slice(-2);
                    let day = ('0' + nowDate.getDate()).slice(-2);
                    let month = ('0' + (nowDate.getMonth() + 1)).slice(-2);
                    let year = nowDate.getFullYear();
                    let nowDateString = `${year}-${month}-${day}_${hours}_${minutes}_${seconds}`;

                    (async () => {
                        let branches = await PlayCanvas.GetBranches(authToken, projectId);
                        let found:boolean = false;
                        
                        for (let i = 0; i < branches.result.length; i++) {
                            let branchData = branches.result[i];
                            if (branchId == branchData.id) {
                                let branchName = branchData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                                found = true;
                                res.status(200).send(`branch ID: [${branchName}] is being exported...`);
                                console.log(`-------`);
                                this.isStillArchiving = true;
                                this.currentBranchId = branchId;
                                let config:PlayCanvasConfig = {
                                    playcanvas: {
                                        project_id: projectId,
                                        name: branchName,
                                        scenes: sceneNumbers,
                                        branch_id: branchId,
                                        description: "",
                                        preload_bundle: true,
                                        version: "",
                                        release_notes: "",
                                        scripts_concatenate: true,
                                        scripts_minify: true,
                                        scripts_sourcemaps : false,
                                    },

                                }
                                // let zipPath:string = await PlayCanvas.Build(authToken, config, `./public`, true);
                                let zipPath:string = `./public/${branchName}__Build.zip`;
                                console.log(`zipPath: ${zipPath}`);
                                let targetPath:string = `./public/${branchName}`;
                                if (!fs.existsSync(targetPath)) {
                                    fs.mkdirSync(targetPath);
                                }
                                console.log(`targetPath: ${targetPath}`);

                                // let commandUnzip:string = `unzip -o ${zipPath} -d ${targetPath}`;
                                let commandUnzip:string = `Expand-Archive -Force ${zipPath} ${targetPath}`;
                                console.log(`command: ${commandUnzip}`);
                                await (new Promise<void>((resolve, reject) => {
                                    exec(commandUnzip, {'shell':'powershell.exe'}, (err, stdout, stderr) => {
                                        if (err) {
                                            console.log(`err: ${err}`);
                                            reject();
                                            return;
                                        }
                                        if (stdout) {
                                            console.log(`stdout: ${stdout}`);
                                            resolve();
                                            return;
                                        }
                                        if (stderr) {
                                            console.log(`stdout: ${stderr}`);
                                            resolve();
                                            return;
                                        }
                                        resolve();
                                    }); 
                                }));
                                console.log(`unzipped`);
                                
                                let content = fs.readFileSync(`${targetPath}/index.html`, { encoding: 'utf8', flag: 'r' });

                                let globalPlatform = url.searchParams.get('platform');
                                if (globalPlatform != null) {
                                    content = content.replace(/<head>/g, `<head>\n\t<script>platform="${globalPlatform}";</script>`);
                                }
                                let globalVersion = url.searchParams.get('version');
                                if (globalVersion != null) {
                                    content = content.replace(/<head>/g, `<head>\n\t<script>version="${globalVersion}";</script>`);
                                }
                                let globalBackend = url.searchParams.get('backend');
                                if (globalBackend != null) {
                                    content = content.replace(/<head>/g, `<head>\n\t<script>backend="${globalBackend}";</script>`);
                                }
                                fs.writeFileSync(`${targetPath}/index.html`, content, { encoding: 'utf8', flag: 'w' });
                                
                                let commandDelete:string = `rm ${zipPath}`;
                                console.log(`command: ${commandDelete}`);
                                await (new Promise((resolve, reject) => {
                                    exec(commandDelete, {'shell':'powershell.exe'}, resolve); 
                                }));
                                console.log(`deleted`);
                                
                                this.isStillArchiving = false;
                            }
                        }
                        if (!found) {
                            res.status(200).send(`branch ID: ${branchId} is not found`);
                        }
                    })();
                }
            } else {
                next();
            }
        });
        self.app.use(serveStatic(path.join(__dirname, '../public'), { index: ['index.html', 'index.htm'] }))
    }

}

new Main();