import multer from "multer";
import path from "path";
import fs from 'fs';
import CONFIG, { fileGet, fileUpload } from "../CONFIG/CONFIG";
import EXPRESS from "../EXPRESS/EXPRESS";
import DATA from "../DATA/DATA";
import { file } from "googleapis/build/src/apis/file";
import ITEM from "../ITEM/ITEM";

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
        let tmp = Object.entries({
            fileName: params.fileName,
            avatarID: params.avatarID
        });
        let searchParams:URLSearchParams = new URLSearchParams();
        tmp.forEach(element => searchParams.append(element[0], element[1].toString()));
        let directUrl:string = `${CONFIG.vars.PUBLIC_FULL_URL}${fileGet}?${searchParams.toString()}`;

        return Promise.resolve( directUrl );
    }

    public static async list(params:{ avatarID:string }):Promise<any> 
    {
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
    } 

    /*=============== 


    SET  

    {
        name (filename),
        content,
        avatarID
    }

    ================*/

    public static async set( params:FILE.UploadParams):Promise<any> 
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

        var file = await DATA.set( this.table, 
        {
            name        : params.fileName,
            avatarID    : params.avatarID,
            url         : url,
            type        : "file"
        });

        let instance = ITEM.set( file );

        return Promise.resolve( instance );
    }

 

    /*=============== 


    GET  
 

    ================*/

    public static async get( query:any ) : Promise<any> 
    {
        // If I receive the url, I can composite the web link and return it without consulting mongo

        var file = DATA.get( this.table, query );
       
        return Promise.resolve( file );
    };


    /*=============== 

    // EXPRESS!!!!!
    
    // WEB GET with post variables stuff
    // that composites the url and returns it so it can cached by the browser  
  

    ================*/

    public static webhookFileGet() {
        EXPRESS.app.use(`${fileGet}`, (req, res) => {

            const { fileID, avatarID, fileName } = req.query;
            let url: string = path.resolve( __dirname, '..', '..', '..', 'items', <string>avatarID, <string>fileName );
            res.sendFile(url);
            
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

    export type UploadParams = Ownership & {
        fileName: string;
        content: File;
    };
}

export default FILE;
