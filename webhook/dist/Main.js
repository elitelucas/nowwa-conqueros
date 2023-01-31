"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
class Main {
    /**
     * Initialize necessary components.
     */
    constructor() {
        var app = (0, express_1.default)()
            .use(express_1.default.json())
            .use(express_1.default.urlencoded({
            extended: false
        }));
        app.use('/test', (req, res) => {
            console.log(`[Express] /test/`);
            res.status(200).send('test');
        });
        app.use('/pull', (req, res) => {
            console.log(`[Express] /pull/`);
            res.status(200).send('pull');
            this.pull();
        });
        app.listen(9900);
    }
    pull() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let command = `cd .. && git pull git@gitlab.com:nowwa/conqueros/main.git`;
                let task = (0, child_process_1.spawn)(command, { shell: true, windowsHide: false });
                yield new Promise((resolve, reject) => {
                    task.stdout.on('data', (data) => {
                        console.log(`= stdout =`);
                        console.log(`${data}`);
                    });
                    task.stderr.on('data', (data) => {
                        console.log(`= stderr =`);
                        console.log(`${data}`);
                    });
                    task.on('exit', (code) => {
                        console.log(`code: ${code}`);
                        resolve();
                    });
                });
                console.log(`=== success ===`);
            }
            catch (err) {
                console.log(`=== error ===`);
                console.log(`${err}`);
            }
        });
    }
}
exports.default = Main;
var c = new Main();
