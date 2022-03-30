import cloudinary from 'cloudinary';

type DBConfig = {
    HOST        : string,
    PORT        : number,
    DB          : string
    USER        : string,
    PASS        : string 
}

const dbConfig:DBConfig = {
    HOST        : "db-mongodb-conqueros-a434f3ba.mongo.ondigitalocean.com",
    PORT        : 27017,
    DB          : "admin",
    USER        : "doadmin",
    PASS        : "Hi730Rw829Pk4J1q"
};

const cloudinaryConfig:cloudinary.ConfigOptions = {
    cloud_name  : "gearball",
    api_key     : "155952797698712",
    api_secret  : "_qyQf6rr2QpB_-grhKotmrF-twQ"
};

export default {
    Database    : dbConfig,
    Cloudinary  : cloudinaryConfig
};