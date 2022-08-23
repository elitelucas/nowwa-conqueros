require('dotenv').config();
const 
    del = require('del'),
    AdmZip = require('adm-zip'),
    { extractFull, add } = require('node-7z'),
    sevenBin = require('7zip-bin'),
    pathTo7zip = sevenBin.path7za,
    path = require('path'),
    concat = require('concat-files'),
    fs = require('fs');

function removeNullAndFalse(obj){
    removeNull(obj);
    removeFalse(obj);
}

function removeFalse(obj){
    for( let prop in obj){
        if( obj[prop] === false )
            delete(obj[prop]);

        // recursive
        if( typeof obj[prop] === "object" ){
            removeFalse(obj[prop]);
        }
    }
}

function removeNull(obj){
    for( let prop in obj){
        if( obj[prop] === null )
            delete(obj[prop]);

        // non recursive, it breaks the game
    }
}

function getCspMetadataTag(csps) {
    var tag = "<meta http-equiv=\"Content-Security-Policy\" content=\"{0}\" />"
    var content = "";
    for (var key in csps) {
        if (key !== 'patch_preload_bundles') {
            content += key;
            for (var i in csps[key]) {
                var value = csps[key][i];
                content += " " + value
            }
            content += "; "
        }
    }

    return tag.replace("{0}", content);
}

(async ()=>{

    var platform = process.env.PLATFORM;
    var environment = process.env.NODE_ENV;

    if (platform == 'fb' || platform == 'mock') { // facebook - playco

        var files = [];
        files.push(`./utils/postprocess-prefix.js`);
        files.push(`./dist/Wrapper.js`);
        files.push(`./utils/postprocess-suffix.js`);

        var filename = `./dist/${process.env.OUTPUT_FILE}`;

        await new Promise((resolve,reject)=>{
            concat(files, filename, function(err) {
                if (err) {
                    console.log(err);
                    reject();
                    return; 
                }
                console.log('success concat files');
                resolve();
            });
        });

        await new Promise((resolve,reject)=>{
            fs.readFile(filename, 'utf8', function (err,data) {
                if (err) {
                    console.log(err);
                    reject();
                    return; 
                }
            
                var endOfChunk = 'var $946c485706e48c1f$export$2e2bcd8739ae039';
                var endOfChunkIndex = data.indexOf(endOfChunk);
                console.log('unknown var chunk index: ' + endOfChunkIndex);
                if (endOfChunkIndex >= 0) {
                    var firstVar = `var $946c485706e48c1f$import$4f1f131d5e9c7574 = {};\n`;
                    var secondVar = `var $946c485706e48c1f$import$5ecbb526cd5c0bbc = {};\n`;
                    
                    data = data.slice(0, endOfChunkIndex) + firstVar + secondVar + data.slice(endOfChunkIndex);
                    console.log('chunk replaced!');
                }

                var endOfPlatform = 'switch(undefined)';
                var endOfPlatformIndex = data.indexOf(endOfPlatform);
                if (endOfPlatformIndex >= 0) {
                    data = data.replace(endOfPlatform, `switch('${process.env.PLATFORM}')`);
                    console.log('platform replaced!');
                }

                data = data.replace(/\%2F/g,'/');
                data = data.replace(/\%2B/g,'+');
                data = data.replace(/\%3A/g,':');
                data = data.replace(/\%3B/g,';');
                    
                fs.writeFile(filename, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err);
                        reject();
                        return;
                    }
                    console.log('fixed parcel issue');
                    resolve();
                });
            });
        });
        
    } 
    else if (platform == 'sc') { // snapchat

        let basePath = `./temp/extracted/`;
        if (!fs.existsSync(basePath)) {
            fs.mkdirSync(basePath);
        }

        await new Promise((resolve, reject) => {

            console.log(`-- extracting original zip file --`);

            const zipFile2 = extractFull(`./temp/${process.env.APP_NAME}_Download.zip`, basePath, { $bin: pathTo7zip, $progress: true, recursive: true }); 
            zipFile2.on('data', function (data) {
                // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
            });
              
            zipFile2.on('progress', function (progress) {
                // console.log(`progress: ${progress.percent}`); //? { percent: 67, fileCount: 5, file: undefinded }
            });
    
            zipFile2.on('error', (err) =>{
                console.log(`err: ${JSON.stringify(err)}`);
            });
    
            zipFile2.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });
    
        let indexHTML = `${basePath}index.html`;
        let preloadAndroidZip = `${basePath}preload-android.zip`;
        let preloadIosZip = `${basePath}preload-ios.zip`;
        let configJSON = `${basePath}config.json`;

        let indexHTMLContent = await new Promise((resolve, reject)=>{
            fs.readFile(indexHTML, 'utf8', function (errIndexHTMLRead, dataIndexHTML) {
                if (errIndexHTMLRead) {
                    console.log(errIndexHTMLRead);
                    reject();
                    return; 
                }

                var csps = {
                    "style-src": [
                        "'self'",
                        "'unsafe-inline'"
                    ],
                    "connect-src": [
                        "'self'",
                        "blob:",
                        "data:",
                        "https://www.google-analytics.com",
                        "https://snapchat.com",
                        "https://*.snapchat.com",
                        "wss://*.games.snapchat.com",
                        "https://*.games.snapchat.com"
                    ]
                };
                var cspMetadata = getCspMetadataTag(csps);
                var indexWithCsp = dataIndexHTML.replace("<head>", "<head>\n\t\t"+cspMetadata);
                if (indexWithCsp.indexOf('</html>\n') > 0) 
                {
                    indexWithCsp = indexWithCsp.replace("</html>\n", "</html>");
                }
                indexWithCsp = indexWithCsp.replace(/\t/g,"    ");
                    
                fs.writeFile(indexHTML, indexWithCsp, 'utf8', function (errIndexHTMLWrite) {
                    if (errIndexHTMLWrite) {
                        console.log(errIndexHTMLWrite);
                        reject();
                        return;
                    }
                    console.log(`success replace: ${indexHTML}`);
                    resolve(indexWithCsp);
                    return;
                });
            });
        });

        await new Promise((resolve, reject)=>{
            fs.readFile(configJSON, 'utf8', function (errConfigJSON, dataConfigJSON) {

                if (errConfigJSON) {
                    console.log(errConfigJSON);
                    reject();
                    return;
                }

                const data = JSON.parse(dataConfigJSON);
                const keys = Object.keys( data.assets );

                keys.forEach( 
                    (key)=>{
                        const current = data.assets[key];
                        const light = {};

                        light.tags      = current.tags;
                        light.name      = current.name;
                        light.preload   = current.preload;
                        light.exclude   = current.exclude;
                        light.meta      = current.meta;
                        light.data      = current.data;
                        light.type      = current.type;
                        light.file      = current.file;
                        light.region    = current.region;
                        light.i18n      = current.i18n;
                        light.id        = current.id;


                        if( light.file !== null ){
                            delete(light.file.hash);
                            delete(light.file.size);
                        }

                        if( Object.keys(light.i18n).length === 0)
                            delete(light.i18n);

                        if( light.tags.length === 0 )
                            delete(light.tags);

                        removeNullAndFalse(light);
                        if( light.meta){
                            removeNullAndFalse(light.meta);
                            if( light.meta.compress)
                                removeNullAndFalse(light.meta.compress);
                        }

                        if( light.data){
                            removeNullAndFalse(light.data);
                        }

                        data.assets[key] = light;
                    }
                ); 

                var configJSONContent = JSON.stringify(data);

                fs.writeFile(configJSON, configJSONContent, 'utf8', function (errConfigJSONWrite) {
                    if (errConfigJSONWrite) {
                        console.log(errConfigJSONWrite);
                        reject();
                        return;
                    }
                    console.log(`success update: ${configJSON}`);
                    resolve();
                    return;
                });

            });
        });

        await new Promise((resolve, reject) => {

            console.log(`-- update index.html, config.json on android zip --`);

            const zipFile2 = add(preloadAndroidZip, [indexHTML, configJSON], { $bin: pathTo7zip, $progress: true, recursive: true }); 
            zipFile2.on('data', function (data) {
                // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
            });
              
            zipFile2.on('progress', function (progress) {
                // console.log(`progress: ${progress.percent}`); //? { percent: 67, fileCount: 5, file: undefinded }
            });
    
            zipFile2.on('error', (err) =>{
                console.log(`err: ${JSON.stringify(err)}`);
            });
    
            zipFile2.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });
        

        await new Promise((resolve, reject) => {

            console.log(`-- update index.html, config.json on ios zip --`);

            const zipFile2 = add(preloadIosZip, [indexHTML, configJSON], { $bin: pathTo7zip, $progress: true, recursive: true }); 
            zipFile2.on('data', function (data) {
                // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
            });
              
            zipFile2.on('progress', function (progress) {
                // console.log(`progress: ${progress.percent}`); //? { percent: 67, fileCount: 5, file: undefinded }
            });
    
            zipFile2.on('error', (err) =>{
                console.log(`err: ${JSON.stringify(err)}`);
            });
    
            zipFile2.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });

        await new Promise((resolve, reject) => {

            console.log(`-- update index.html, config.json, preload-android.zip, preload-ios.zip on base zip --`);

            const zipFile2 = add(`./temp/${process.env.APP_NAME}_Download.zip`, [indexHTML, configJSON, preloadAndroidZip, preloadIosZip], { $bin: pathTo7zip, $progress: true, recursive: true }); 
            zipFile2.on('data', function (data) {
                // doStuffWith(data); //? { status: 'extracted', file: 'extracted/file.txt" }
            });
              
            zipFile2.on('progress', function (progress) {
                // console.log(`progress: ${progress.percent} | file: ${progress.file}`); //? { percent: 67, fileCount: 5, file: undefinded }
            });
    
            zipFile2.on('error', (err) =>{
                console.log(`err: ${JSON.stringify(err)}`);
            });
    
            zipFile2.on('end', function () {
                // end of the operation, get the number of folders involved in the operation
                resolve();
            });

        });

        await del([`${basePath}**`,`${basePath}`]);
        await new Promise((resolve, reject) => {
            fs.rename(`./temp/${process.env.APP_NAME}_Download.zip`, `./temp/${process.env.APP_NAME}.${process.env.APP_VERSION}._Upload.zip`, function(err) {
                if ( err ) reject();
                else resolve();
            });
        })
        console.log(`success`);
    }

})();
