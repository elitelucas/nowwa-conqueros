import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';

class Environment {

    private static Instance: Environment;

    private static get MainConfig(): Environment.Config {
        return {

            VERSION: "0.0.1",

            EXPRESS_SECRET: "conqueros",

            MONGODB_HOST: "db-mongodb-conqueros-a434f3ba.mongo.ondigitalocean.com",
            MONGODB_PORT: 27017,
            MONGODB_DB: "admin",
            MONGODB_USER: "doadmin",
            MONGODB_PASS: "Hi730Rw829Pk4J1q",
            MONGODB_CERT: "certificates/db.ca-certificate.crt",

            CLOUDINARY_NAME: "gearball",
            CLOUDINARY_KEY: "155952797698712",
            CLOUDINARY_SECRET: "_qyQf6rr2QpB_-grhKotmrF-twQ",

            SOCKET_PORT: 9003,
            PORT: 0,
            URL: "0.0.0.0",
            USE_SSL: false,

            NAKAMA_PORT: 7350,
            NAKAMA_HOST: "127.0.0.1",
            NAKAMA_HTTP_KEY: "server-N0ww@",
            NAKAMA_SERVER_KEY: "server-N0ww@",
            NAKAMA_USE_SSL: false

        };
    }

    public static get CoreConfig(): Environment.Config {
        let config: Environment.Config = this.MainConfig;

        dotenv.config();

        config.URL = process.env.CORE_URL as string;
        config.PORT = parseInt(process.env.CORE_PORT as string);
        config.USE_SSL = process.env.CORE_USE_SSL as string == 'true';

        return config;
    }

    public static get CoreUrl(): string {
        let config: Environment.Config = this.CoreConfig;
        return (config.USE_SSL ? `https` : `http`) +
            `://` +
            `${config.URL}` +
            `:` +
            `${config.PORT}`;
    }
}

namespace Environment {
    export type Config = {
        VERSION: string,

        EXPRESS_SECRET: string,

        MONGODB_HOST: string,
        MONGODB_PORT: number,
        MONGODB_DB: string,
        MONGODB_USER: string,
        MONGODB_PASS: string,
        MONGODB_CERT: string,

        CLOUDINARY_NAME: string,
        CLOUDINARY_KEY: string,
        CLOUDINARY_SECRET: string,

        SOCKET_PORT: number,
        URL: string,
        PORT: number,
        USE_SSL: boolean,

        NAKAMA_HOST: string,
        NAKAMA_PORT: number,
        NAKAMA_SERVER_KEY: string,
        NAKAMA_HTTP_KEY: string,
        NAKAMA_USE_SSL: boolean
    };
}

export default Environment;

export const authenticationUrl: string = `/authentication`;
export const authenticationCoreUrl: string = `${Environment.CoreUrl}${authenticationUrl}`;

export const toyRoot: string = `/toy`;

export const storageUrl: string = `/storage`;
export const storageCoreUrl: string = `${Environment.CoreUrl}${storageUrl}`;

export const toyListUrl: string = `/toyList`;
export const toyListCoreUrl: string = `${Environment.CoreUrl}${toyListUrl}`;

export const toyBuildUrl: string = `/toyBuild`;
export const toyBuildCoreUrl: string = `${Environment.CoreUrl}${toyBuildUrl}`;

export const toyStatusUrl: string = `/toyStatus`;
export const toyStatusCoreUrl: string = `${Environment.CoreUrl}${toyStatusUrl}`;