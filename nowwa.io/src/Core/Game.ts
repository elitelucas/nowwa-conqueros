import express from 'express';
import { EnvType } from 'ts-dotenv';
import Environment, { baseUrl, buildUrl, toyUrl } from './Environment';
import path from 'path';
import fs from 'fs';
import { debug } from 'console';
import PlayCanvas from './Playcanvas';

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
        app.use(`${toyUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let fullPath:string = path.join(__dirname, `${Game.RootFolder}`);
            console.log(`Game : ${fullPath}`);
            if (fs.existsSync(fullPath)) {
                let stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fs.readdir(fullPath, (err, contents) => {
                        if (err) {
                            throw err;
                        }

                        // TODO : read config files

                        let configFiles:any[] = [];
                        
                        contents.forEach(content => {
                            let contentPath:string = path.join(fullPath, content);
                            let isFile:boolean = fs.statSync(contentPath).isFile();
                            if (isFile) {
                                let extension:string = contentPath.substring(contentPath.lastIndexOf(`.`));
                                console.log(`extension: ${extension}`);
                                if (extension == `.json`) {
                                    console.log(`config file: ${contentPath}`);
                                    let configFile = JSON.parse(fs.readFileSync(contentPath, { encoding: 'utf8', flag: 'r' }));
                                    configFiles.push(configFile);
                                }
                            }
                        });
                        
                        let output = JSON.stringify({configs:configFiles});
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
        app.use(`${buildUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            if (PlayCanvas.CurrentActivity != 'None') {
                console.log(`PlayCanvas.CurrentActivity: ${PlayCanvas.CurrentActivity}`);
                res.status(500).send(`PLAYCANVAS BUSY | `);
            } else {
                let url:URL = new URL(`${baseUrl}${req.originalUrl}`);
                let projectName:string = url.searchParams.get('n') as string;
                let projectId:number = parseInt(url.searchParams.get('p') as string);
                let branchId:string = url.searchParams.get('b') as string;
                let scenes = url.searchParams.get('s') as string;
                let sceneNumbers = scenes.indexOf(',') >= 0 ? scenes.split(',').map(Number) : [parseInt(scenes)];
                res.status(200).send(JSON.stringify({
                    sceneNumbers: sceneNumbers,
                    projectId: projectId,
                    projectName: projectName,
                    branchId: branchId,
                    url: url.toString()
                }));

                // let authToken = 'lJHHrNEjN3klG93krjX3CrCa8SLIydWy';
                // let config:PlayCanvas.Config = {
                //     playcanvas: {
                //         project_id: projectId,
                //         name: projectName,
                //         scenes: [1333566],
                //         branch_id: "6065dec4-aa07-441a-8e26-df8d0b179209",
                //         description: "",
                //         preload_bundle: true,
                //         version: "",
                //         release_notes: "",
                //         scripts_concatenate: true,
                //         scripts_minify: true,
                //         scripts_sourcemaps : false,
                //     },
                //     csp: {
                //         "style-src": [
                //             'self',
                //             'unsafe-inline'
                //         ],
                //         "connect-src": [
                //             'self',
                //             'blob:',
                //             'data:',
                //             'https://www.google-analytics.com'
                //         ]
                //     },
                //     one_page: {
                //         patch_xhr_out: false,
                //         inline_game_scripts: false,
                //         extern_files: false
                //     }
                // }
                // let directory:string = path.join(__dirname, `${Game.RootFolder}/Woodturning 3D`);
                // PlayCanvas.Build(authToken, config, directory, true)
                // .then((zipPath:string) => {
                //     console.log(`zipPath: ${zipPath}`);
                //     let output = JSON.stringify({path:zipPath});
                //     res.status(200).send(`${output}`);
                // })
                // .catch((err:Error) => {
                //     console.log(`error`, err);
                //     res.status(500).send(`PLAYCANVAS ERROR | ${JSON.stringify(err)}`);
                // });
            }
        });
    }

}

namespace Game {

}

export default Game;