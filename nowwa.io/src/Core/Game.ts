import express from 'express';
import { EnvType } from 'ts-dotenv';
import Environment, { toyUrl } from './Environment';
import path from 'path';
import fs from 'fs';
import { debug } from 'console';

class Game {

    private static Instance:Game;

    private static RootFolder:string = `../../storage/toy`;

    /**
     * Initialize game module.
     */
    public static async AsyncInit (app:express.Express, env:EnvType<typeof Environment>):Promise<void> {
        Game.Instance = new Game();
        Game.WebhookList(app);
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

}

namespace Game {

}

export default Game;