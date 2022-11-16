import multer from "multer";
import path from "path";
import { fileUpload } from "../CONFIG/CONFIG";
import EXPRESS from "../EXPRESS/EXPRESS";

class FILE {

    private static storage: multer.StorageEngine;

    public static async init(): Promise<any> {

        this.storage = multer.diskStorage({
            destination: (req, file, callback) => {
                let tmpDestination: string = path.resolve(__dirname, '..', '..', '..', 'storage', 'temp');
                callback(null, tmpDestination);
            },
            filename: (req, file, callback) => {
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
                console.log(`uploaded file: ${file.originalname}`);
                callback(null, file.originalname);
            }
        });

        this.webhookFileUpload();
        return Promise.resolve();
    }

    private static webhookFileUpload() {

        var upload = multer({ storage: this.storage });

        EXPRESS.app.use(`${fileUpload}`, upload.array('files'), async (req, res) => {

            console.log(`<-- request upload`);

            var files = req.files;
            console.log(JSON.stringify(files));
            res.status(200).send({
                success: true
            });

        });
    }
    /*=============== 


    GET  
    

    ================*/

    public static async get(query: any): Promise<any> {

    };

    /*=============== 


    SET  
    

    ================*/

    public static async set(query: any): Promise<any> {

    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change(query: any): Promise<any> {

    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove(query: any): Promise<any> {

    };

    /*=============== 


    QUERY  
    

    ================*/

    private static getQuery(vars: any) {
        if (vars.where) return vars;

        var query: any = { where: {}, values: {} };
        var where: any = {};

        query.where = where;

        if (vars.uID) where.uID = vars.uID;

        return query;
    }
};

export default FILE;
