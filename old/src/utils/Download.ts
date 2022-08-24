import PlayCanvas from "./Playcanvas"; 
import { load } from 'ts-dotenv';
import fs from 'fs';
import path from 'path';

require('dotenv').config();

var authToken:string = process.env.PLAYCANVAS_AUTH_TOKEN as string;
const envPath:string = path.resolve(__dirname, `../../playcanvas.json`);
const config:PlayCanvas.Config = JSON.parse(fs.readFileSync(envPath, 'utf8'));
config.playcanvas.name = process.env.APP_NAME as string;

(async () => {
    await PlayCanvas.Build(authToken, config, path.resolve(__dirname, `../../temp`));
})();