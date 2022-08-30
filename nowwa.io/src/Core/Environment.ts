import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

class Environment {

    private static Instance:Environment;

    private static get MainConfig():Environment.Config {
        return {

            VERSION             : "0.0.1",
            
            EXPRESS_SECRET      : "conqueros", 
        
            MONGODB_HOST        : "db-mongodb-conqueros-a434f3ba.mongo.ondigitalocean.com",
            MONGODB_PORT        : 27017,
            MONGODB_DB          : "admin",
            MONGODB_USER        : "doadmin",
            MONGODB_PASS        : "Hi730Rw829Pk4J1q",
            MONGODB_CERT        : "certificates/db.ca-certificate.crt",
        
            CLOUDINARY_NAME     : "gearball",
            CLOUDINARY_KEY      : "155952797698712",
            CLOUDINARY_SECRET   : "_qyQf6rr2QpB_-grhKotmrF-twQ",
        
            SOCKET_PORT         : 9003,
            PORT                : 0,
            URL                 : "0.0.0.0",
            USE_SSL             : false
        };
    }

    public static get PublicConfig():Environment.Config {
        let config:Environment.Config = this.MainConfig;

        config.URL = "127.0.0.1";
        config.PORT = 9000;
        config.USE_SSL = false;

        // config.URL = "nowwa.io";
        // config.PORT = 443;
        // config.USE_SSL = true;

        return config;
    }

    public static get CoreConfig():Environment.Config {
        let config:Environment.Config = this.MainConfig;
        config.URL = "127.0.0.1";
        config.PORT = 9000;
        config.USE_SSL = false;
        return config;
    }

    public static get CoreUrl():string { 
        let config:Environment.Config = this.CoreConfig;
        return (config.USE_SSL ? `https` : `http`) +
        `://` +
        `${config.URL}` +
        `:` +
        `${config.PORT}`;
    }

    public static get PublicUrl():string { 
        let config:Environment.Config = this.PublicConfig;
        return (config.USE_SSL ? `https` : `http`) +
        `://` +
        `${config.URL}` +
        `:` +
        `${config.PORT}`;
    }

}

namespace Environment {
    export type Config = {
        VERSION             : string,
        
        EXPRESS_SECRET      : string, 
    
        MONGODB_HOST        : string,
        MONGODB_PORT        : number,
        MONGODB_DB          : string,
        MONGODB_USER        : string,
        MONGODB_PASS        : string,
        MONGODB_CERT        : string,
    
        CLOUDINARY_NAME     : string,
        CLOUDINARY_KEY      : string,
        CLOUDINARY_SECRET   : string,
    
        SOCKET_PORT         : number,
    
        URL                 : string,
        PORT                : number,
        USE_SSL             : boolean,
    };
}

export default Environment;

export const authenticationUrl:string = `/authentication`;
export const authenticationCoreUrl:string = `${Environment.CoreUrl}${authenticationUrl}`;
export const authenticationPublicUrl:string = `${Environment.PublicUrl}${authenticationUrl}`;

export const storageUrl:string = `/storage`;
export const storageCoreUrl:string = `${Environment.CoreUrl}${storageUrl}`;
export const storagePublicUrl:string = `${Environment.PublicUrl}${storageUrl}`;

export const toyListUrl:string = `/toyList`;
export const toyListCoreUrl:string = `${Environment.CoreUrl}${toyListUrl}`;
export const toyListPublicUrl:string = `${Environment.PublicUrl}${toyListUrl}`;

export const toyBuildUrl:string = `/toyBuild`;
export const toyBuildCoreUrl:string = `${Environment.CoreUrl}${toyBuildUrl}`;
export const toyBuildPublicUrl:string = `${Environment.PublicUrl}${toyBuildUrl}`;

export const toyStatusUrl:string = `/toyStatus`;
export const toyStatusCoreUrl:string = `${Environment.CoreUrl}${toyStatusUrl}`;
export const toyStatusPublicUrl:string = `${Environment.PublicUrl}${toyStatusUrl}`;