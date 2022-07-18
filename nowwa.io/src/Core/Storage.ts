import express from 'express';
import { EnvType } from 'ts-dotenv';
import Environment from './Environment';
import path from 'path';
import fs from 'fs';

class Storage {

    private static Instance:Storage;

    private static BaseUrl:string = `/storage`;

    public static FileUrl:string = `${Storage.BaseUrl}/files`; 

    /**
     * Initialize storage module.
     */
    public static async AsyncInit (app:express.Express, env:EnvType<typeof Environment>):Promise<void> {
        Storage.Instance = new Storage();
        Storage.WebhookFiles(app);
        Storage.WebhookDefaultFiles(app);
        return Promise.resolve();
    }

    /**
     * Webhook for accessing files directly. 
     * @param app @type {express.Express}
     */
    private static WebhookFiles (app:express.Express):void {
        let url:string = `/files`;
        app.use(`${Storage.BaseUrl}${url}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let filePath:string = req.url;
            var fullPath:string = path.join(__dirname, `../../files`, filePath);
            if (fs.existsSync(fullPath)) {
                fs.createReadStream(fullPath).pipe(res);
            } 
            else 
            {
                res.status(200).send(JSON.stringify(`file [${filePath}] does not exsits`));
            }
        });
    }

    /**
     * Webhook for accessing files directly. 
     * @param app @type {express.Express}
     */
    private static WebhookDefaultFiles (app:express.Express):void {
        let urls:string[] = [
            `/favicon.ico/`,
            `/apple-touch-icon-precomposed.png/`,
            `/apple-touch-icon.png/`
        ];
        for (let i:number = 0; i < urls.length; i++) {
            app.use(`${urls[i]}`, async (req, res) => {
                // console.log(`<-- storage - default files`);
                let filePath:string = req.baseUrl;
                var fullPath:string = path.join(__dirname, `../../files`, filePath);
                // console.log(`fullPath`, fullPath);
                fs.createReadStream(fullPath).pipe(res);
            });
        }
    }

    /**
     * Webhook for custom path serving.
     */
    public static WebhookCustomPath (externalPath:string, internalPath:string, app:express.Express):void {
        app.all(`${externalPath}/*`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let filePath:string = req.url.replace(externalPath, '');
            var fullPath:string = path.join(__dirname, `./${internalPath}`, filePath);
            // console.log(`fullPath`, fullPath);
            if (fs.existsSync(fullPath)) {
                fs.createReadStream(fullPath).pipe(res);
            } 
            else 
            {
                res.status(200).send(`path [${externalPath}${filePath}] does not exists`);
            }
        });
    }
}

namespace Storage {

}

export default Storage;