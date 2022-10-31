import express from 'express';
import Environment, { storageUrl } from '../Environment';
import path from 'path';
import fs from 'fs';

class Storage {

    private static Instance: Storage;

    private static VisibleExtensions: string[] = ['html', 'png', 'jpg', 'txt', 'js'];

    private static RootFolder: string = `../../storage`;

    /**
     * Initialize storage module.
     */
    public static async AsyncInit(app: express.Express, env: Environment.Config): Promise<void> {
        Storage.Instance = new Storage();
        Storage.WebhookFiles(app);
        Storage.WebhookExplorer(app);
        return Promise.resolve();
    }

    /**
     * Webhook for exploring files. 
     * @param app @type {express.Express}
     */
    public static WebhookExplorer(app: express.Express): void {
        app.use(`${storageUrl}`, async (req, res) => {
            // console.log(`<-- storage - files`);
            let folderPath: string = req.url;
            let fullPath: string = path.join(__dirname, `${Storage.RootFolder}`, folderPath);
            fullPath = decodeURI(fullPath);
            if (fs.existsSync(fullPath)) {
                let stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    fs.readdir(fullPath, (err, contents) => {
                        if (err) {
                            throw err;
                        }

                        let filePaths: string[] = [];
                        let folderPaths: string[] = [];

                        contents.forEach(content => {
                            var contentPath = path.join(fullPath, content);
                            var isDirectory: boolean = fs.statSync(contentPath).isDirectory();
                            if (!isDirectory) {
                                let extension = content.split('.').pop();
                                if (extension && Storage.VisibleExtensions.includes(extension.toLowerCase())) {
                                    filePaths.push(content);
                                }
                            } else {
                                folderPaths.push(content);
                            }
                        });

                        let output = JSON.stringify({ files: filePaths, folders: folderPaths });
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
     * Webhook for accessing files directly. 
     * @param app @type {express.Express}
     */
    private static WebhookFiles(app: express.Express): void {
        let rootPath: string = path.join(__dirname, `${Storage.RootFolder}`);
        console.log(`rootPath: ${rootPath}`);
        app.use('/', express.static(rootPath));
    }
}

namespace Storage {

}

export default Storage;