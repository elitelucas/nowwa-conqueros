import express from 'express';
import CONFIG, { storageUrl } from '../CONFIG/CONFIG';
import path from 'path';
import fs from 'fs';
import EXPRESS from '../EXPRESS/EXPRESS';

class Storage {
    private static Instance: Storage;

    private static VisibleExtensions: string[] = ['html', 'png', 'jpg', 'txt', 'js'];

    private static RootFolder: string = `../../../storage`;

    /**
     * Initialize storage module.
     */
    public static async AsyncInit(): Promise<void> {
        Storage.Instance = new Storage();
        Storage.WebhookFiles();
        Storage.WebhookExplorer();
        return Promise.resolve();
    }


    public static WebhookExplorer(): void {
        EXPRESS.app.use(`${storageUrl}`, async (req, res) => {
            console.log(`<-- storage - explorer`);
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
                                // let extension = content.split('.').pop();
                                // if (extension && Storage.VisibleExtensions.includes(extension.toLowerCase())) {
                                filePaths.push(content);
                                // }
                            } else {
                                folderPaths.push(content);
                            }
                        });

                        let output = JSON.stringify({ success: true, files: filePaths, folders: folderPaths });
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

    private static WebhookFiles(): void {
        let rootPath: string = path.join(__dirname, `${Storage.RootFolder}`);
        console.log(`rootPath: ${rootPath}`);
        EXPRESS.app.use('/', (req, res, next) => {
            return (express.static(rootPath))(req, res, next);
        });
    }
}

namespace Storage {

}

export default Storage;