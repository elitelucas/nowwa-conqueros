let Environment = {
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

    PUBLIC_URL          : String,
    PUBLIC_PORT         : Number,
    PUBLIC_USE_SSL      : Boolean,

    CORE_URL            : String,
    CORE_PORT           : Number,
    CORE_USE_SSL        : Boolean,
}

export default Environment;

type UrlComponents = {
    useSSL  : boolean,
    url     :string,
    port    :number
}

const CoreUrlComponents:UrlComponents = {
    port    : 9000,
    url     : "127.0.0.1",
    useSSL  : false
};

const PublicUrlComponents:UrlComponents = {
    port    : 9000,
    url     : "127.0.0.1",
    useSSL  : false
};

export const coreUrl:string = 
    (CoreUrlComponents.useSSL ? `https` : `http`) +
    `://` +
    `${CoreUrlComponents.url}` +
    `:` +
    `${CoreUrlComponents.port}`;

export const publicUrl:string = 
    (PublicUrlComponents.useSSL ? `https` : `http`) +
    `://` +
    `${PublicUrlComponents.url}` +
    `:` +
    `${PublicUrlComponents.port}`;

export const authenticationUrl:string = `/authentication`;
export const authenticationCoreUrl:string = `${coreUrl}${authenticationUrl}`;
export const authenticationPublicUrl:string = `${publicUrl}${authenticationUrl}`;

export const storageUrl:string = `/storage`;
export const storageCoreUrl:string = `${coreUrl}${storageUrl}`;
export const storagePublicUrl:string = `${publicUrl}${storageUrl}`;

export const toyListUrl:string = `/toyList`;
export const toyListCoreUrl:string = `${coreUrl}${toyListUrl}`;
export const toyListPublicUrl:string = `${publicUrl}${toyListUrl}`;

export const toyBuildUrl:string = `/toyBuild`;
export const toyBuildCoreUrl:string = `${coreUrl}${toyBuildUrl}`;
export const toyBuildPublicUrl:string = `${publicUrl}${toyBuildUrl}`;

export const toyStatusUrl:string = `/toyStatus`;
export const toyStatusCoreUrl:string = `${coreUrl}${toyStatusUrl}`;
export const toyStatusPublicUrl:string = `${publicUrl}${toyStatusUrl}`;