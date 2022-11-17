import multer from "multer";
import path from "path";
import { fileUpload } from "../CONFIG/CONFIG";
import EXPRESS from "../EXPRESS/EXPRESS";
import DATA from "../DATA/DATA";

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

        this.webhookFileUpload();
        return Promise.resolve();
    }

    private static webhookFileUpload() 
    {
        var upload = multer({ storage: this.storage });

        EXPRESS.app.use( `${fileUpload}`, upload.array('files'), async( req, res ) => 
        {
            console.log( `<-- request upload` );

            var files = req.files;
            console.log( JSON.stringify(files) );

            res.status( 200 ).send({ success: true });

            // WRITE ENTRIES FOR FILES

            for( let n in files )
            {
                // FILE.set( { } )
            }

        });
    }

    /*=============== 


    SET  

    {
        name,
        location,
        avatarID
    }

    
 
    ================*/

    public static async set( query:any ) : Promise<any> 
    {
       var file = DATA.set( this.table, query );
       
       return Promise.resolve( file );
    };

    /*=============== 


    GET  
    

    ================*/

    public static async get( query:any ) : Promise<any> 
    {
        var file = DATA.get( this.table, query );
       
        return Promise.resolve( file );
    };


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

 
};

export default FILE;
