import express from 'express';
import { EnvType } from 'ts-dotenv';
import Environment, { storageUrl } from './Environment';
import path from 'path';
import fs from 'fs';

class Storage {

    private static Instance:Storage;

    private static VisibleExtensions:string[] = ['html','png','jpg'];

    /**
     * Initialize storage module.
     */
    public static async AsyncInit (app:express.Express, env:EnvType<typeof Environment>):Promise<void> {
        Storage.Instance = new Storage();
        Storage.WebhookFiles(app);
        Storage.WebhookExplorer(app);
        // Storage.WebhookDefaultFiles(app);
        return Promise.resolve();
    }

    /**
     * Webhook for exploring files. 
     * @param app @type {express.Express}
     */
    public static WebhookExplorer (app:express.Express):void {
        app.use(`${storageUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let folderPath:string = req.url;
            let fullPath:string = path.join(__dirname, `../Pages`, folderPath);
            if (fs.existsSync(fullPath)) {
                let stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fs.readdir(fullPath, (err, files) => {
                        if (err) {
                            throw err;
                        }

                        let filePaths:string[] = [];
                        let folderPaths:string[] = [];
                        
                        files.forEach(filePath => {
                            var newPath = path.join(fullPath, filePath);
                            var isDirectory:boolean = fs.statSync(newPath).isDirectory();
                            // var isFile:boolean = fs.statSync(newPath).isFile();
                            if (!isDirectory) {
                                let extension = filePath.split('.').pop();
                                console.log(`extension: ${extension}`);
                                if (extension && Storage.VisibleExtensions.includes(extension.toLowerCase())) {
                                    filePaths.push(filePath);
                                }
                            } else { 
                                folderPaths.push(filePath);
                            }
                        });
                        
                        let output = JSON.stringify({files:filePaths, folders: folderPaths});
                        res.status(200).send(`${output}`);
                    });
                } else {
                    res.status(200).send(`NOT DIRECTORY | fullPath: ${fullPath}`);
                }
            } else {
                res.status(200).send(`NOT EXISTS | fullPath: ${fullPath}`);
            }
            
        });
    }

    /**
     * Webhook for accessing files directly. 
     * @param app @type {express.Express}
     */
    private static WebhookFiles (app:express.Express):void {
        let rootPath:string = path.join(__dirname, `../Pages`);
        console.log(`rootPath: ${rootPath}`);
        app.use('/', express.static(rootPath));
    }
}

namespace Storage {

}

export default Storage;