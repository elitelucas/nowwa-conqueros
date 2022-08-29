import { EnvType, load } from 'ts-dotenv';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

let Environment = {
    VERSION             : String,
    
    CORE_URL            : String,
    CORE_PORT           : Number,
    CORE_USE_SSL        : Boolean,

    EXPRESS_SECRET      : String, 

    MONGODB_HOST        : String,
    MONGODB_PORT        : Number,
    MONGODB_DB          : String,
    MONGODB_USER        : String,
    MONGODB_PASS        : String,
    MONGODB_CERT        : String,

    CLOUDINARY_NAME     : String,
    CLOUDINARY_KEY      : String,
    CLOUDINARY_SECRET   : String,

    SOCKET_PORT         : Number,
}

export default Environment;

var environment:string = (argv as any).env;
console.log(`environment: ${environment}`);

let envPath:string = path.resolve(__dirname, `../../.env.${environment}`);
console.log(`load .env from: ${envPath}`);

export const env:EnvType<typeof Environment> = load(Environment, {
    path: envPath,
    encoding: 'utf-8',
});

console.log(`env.CORE_USE_SSL: ${env.CORE_USE_SSL}`);
console.log(`env.CORE_PORT: ${env.CORE_PORT}`);
console.log(`env.CORE_URL: ${env.CORE_URL}`);

export const baseUrl:string = 
    (env.CORE_USE_SSL ? `https` : `http`) +
    `://` +
    `${env.CORE_URL}` +
    `:` +
    `${env.CORE_PORT}`;

export const authenticationUrl:string = `/authentication`;

export const authenticationFullUrl:string = `${baseUrl}${authenticationUrl}`;

export const storageUrl:string = `/storage`;

export const storageFullUrl:string = `${baseUrl}${storageUrl}`;

export const toyListUrl:string = `/toyList`;

export const toyListFullUrl:string = `${baseUrl}${toyListUrl}`;

export const toyBuildUrl:string = `/toyBuild`;

export const toyBuildFullUrl:string = `${baseUrl}${toyBuildUrl}`;

export const toyStatusUrl:string = `/toyStatus`;

export const toyStatusFullUrl:string = `${baseUrl}${toyStatusUrl}`;