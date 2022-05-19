import * as fs from 'fs';
import http from 'http';
import FormData from 'form-data';
import path from 'path';

var TestUpload = async function  () {
    try {
        var filepath:string = path.join(__dirname,'../test/hob.txt');

        var formData = new FormData();

        formData.append('file', fs.createReadStream(filepath));

        const options = {
            hostname: '127.0.0.1',
            port: 9002,
            path: '/upload',
            method: 'POST',
            headers: formData.getHeaders()
        };
          
        const req = http.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);
          
            res.on('data', d => {
              process.stdout.write(d);
            });
        });
          
        req.on('error', error => {
            console.error(error);
        });
          
        formData.pipe(req);
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

TestUpload();