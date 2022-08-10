var Environment = {
    VERSION             : String,
    
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

    MAIN_PORT           : Number,
    SOCKET_PORT         : Number,
}

export default Environment;

const useSSL:boolean = false;
const url:string = `127.0.0.1`;
const port:number = 9000;

export const baseUrl:string = 
    (useSSL ? `https` : `http`) +
    `://` +
    `${url}` +
    `:` +
    `${port}`;

export const authenticationUrl:string = `/authentication`;

export const authenticationFullUrl:string = `${baseUrl}${authenticationUrl}`;

export const storageUrl:string = `/storage`;

export const storageFullUrl:string = `${baseUrl}${storageUrl}`;

export const toyUrl:string = `/toy`;

export const toyFullUrl:string = `${baseUrl}${toyUrl}`;