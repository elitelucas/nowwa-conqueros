import multer from "multer";
import path from "path";
import fs from 'fs';
import CONFIG, { fileGet, fileUpload } from "../CONFIG/CONFIG";
import EXPRESS from "../EXPRESS/EXPRESS";
import DATA from "../DATA/DATA";
import { file } from "googleapis/build/src/apis/file";
import ITEM from "../ITEM/ITEM";
import mongoose from "mongoose";

class FILE 
{
    private static table    : string = "files";
    private static storage  : multer.StorageEngine;

    public static async init(): Promise<any> 
    {
        this.storage = multer.diskStorage(
        {
            destination : ( req, file, callback) => 
            {
                let tmpDestination: string = path.resolve( __dirname, '..', '..', '..', 'storage', 'temp' );
                callback(null, tmpDestination);
            },

            filename : ( req, file, callback ) => 
            {
                /*
                var extensionRegex:RegExp = /[^.]+$/i;
                var extension = file.originalname.match(extensionRegex);
                if (extension != null) {
                    var extensionName = extension[0];
                    var fieldName:string = file.fieldname;
                    callback(null, `${fieldName}.${extensionName}`);
                }
                callback(null, `${fieldName}.${extensionName}`);
                */
                console.log( `uploaded file: ${file.originalname}` );
                callback( null, file.originalname );
            }
        });

        this.webhookFileGet();
        return Promise.resolve();
    }

    // private static webhookFileUpload() 
    // {
    //     var upload = multer({ storage: this.storage });

    //     EXPRESS.app.use( `${fileUpload}`, upload.array('files'), async( req, res ) => 
    //     {
    //         console.log( `<-- request upload` );

    //         var files = req.files;
    //         console.log( JSON.stringify(files) );

    //         res.status( 200 ).send({ success: true });

    //         // WRITE ENTRIES FOR FILES

    //         for( let n in files )
    //         {
    //             // FILE.set( { } )
    //         }

    //     });
    // }


    private static async write( params:{ fileName: string, content:any, avatarID:string }):Promise<any> 
    {
        let rootUrl:string = path.resolve(__dirname, '..', '..', '..', 'items');
        if (!fs.existsSync(rootUrl)) {
            fs.mkdirSync(rootUrl);
        }

        let url: string = path.resolve( __dirname, '..', '..', '..', 'items', params.avatarID );

        if (!fs.existsSync(url)) 
        {
            fs.mkdirSync(url);
        }

        fs.writeFileSync(`${url}/${params.fileName}`, params.content as any);

        // FIX URL GARY!
        let directUrl:string = `${params.avatarID}/${params.fileName}`;

        return Promise.resolve( directUrl );
    }

    /*=============== 


    SET  

    {
        name (filename),
        content,
        avatarID
    }

    ================*/

    public static async set( params:FILE.GetParams):Promise<any> 
    {
        // FILE is uploaded by Avatar id
        // FILE is stored on the dabase 

        let url = await this.write(
        {
            fileName    : params.fileName,
            content     : params.content,
            avatarID    : params.avatarID
        });

        // CREATE ENTRY IN DATABASE

        // video (mp4?)
        // image (png, jpg, gif, whatever )
        // zips

        let instance = ITEM.set( {
            avatarID: new mongoose.Types.ObjectId(params.avatarID),
            url: url,
            type: "file",
            fileName: params.fileName
        } );
        
        return Promise.resolve( instance );
    }

 

    /*=============== 


    GET  
 

    ================*/

    // public static async get( query:any ) : Promise<any> 
    // {
    //     // If I receive the url, I can composite the web link and return it without consulting mongo

    //     var file = DATA.get( this.table, query );
       
    //     return Promise.resolve( file );
    // };

    public static async get(params:{ avatarID:string }):Promise<any> 
    {
        let items = await ITEM.get({
            avatarID: new mongoose.Types.ObjectId(params.avatarID),
        });
        return Promise.resolve(items);
        /*
        let rootUrl:string = path.resolve(__dirname, '..', '..', '..', 'items');
        if (!fs.existsSync(rootUrl)) {
            fs.mkdirSync(rootUrl);
        }

        let url: string = path.resolve( __dirname, '..', '..', '..', 'items', params.avatarID );
        if (!fs.existsSync(url)) {
            fs.mkdirSync(url);
        }
        let paths:string[] = fs.readdirSync(url);

        let files: string[] = [];
        let urls: string[] = [];
        
        for (let i:number = 0; i < paths.length; i++) {
            let content:string = paths[i];
            var contentPath = path.join(url, content);
            var isDirectory: boolean = fs.statSync(contentPath).isDirectory();
            if (!isDirectory) {
                files.push(content);
            } else {
                urls.push(content);
            }
        }

        let output = {files: files, folders: urls};
        return Promise.resolve(output);
        */
    } 


    /*=============== 

    // EXPRESS!!!!!
    
    // WEB GET with post variables stuff
    // that composites the url and returns it so it can cached by the browser  
  

    ================*/

    public static webhookFileGet() {
        EXPRESS.app.use(`${fileGet}`, (req, res) => {

            let paths:string[] = req.url.split('/');
            if (paths[0] == '') paths.splice(0,1);
            if (paths[paths.length - 1] == '') paths.splice(paths.length - 1,1);

            let url: string = path.resolve( __dirname, '..', '..', '..', 'items', ...paths );
            if (fs.existsSync(url)) {
                res.sendFile(url);
            } else {
                res.status(404).send();
            }
            
        });
    }


    /*=============== 


    CHANGE  
    

    ================*/

    public static async change( query:any ) : Promise<any> 
    {
        var file = DATA.change( this.table, query );
       
        return Promise.resolve( file );     
    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( query:any ) : Promise<any> 
    {
        var file = DATA.change( this.table, query );

        // DELETE FILE FROM HARD DRIVE NOW
       
        return Promise.resolve( file );  
    };

 
}

namespace FILE 
{
    export type Ownership = 
    {
        avatarID: string;
    };

    export type GetParams = Ownership & {
        fileName: string;
        content: File;
    };
}

export default FILE;
