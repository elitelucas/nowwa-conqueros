import mongoose from 'mongoose';

export type FiledocType = {
    filename        : string,
    fileurl         : string,
    extension       : string
}

export type FiledocDocument = mongoose.Document & FiledocType;

export const FiledocSchema = new mongoose.Schema<FiledocDocument>({
    filename    : {
        type    : String
    },
    fileurl    : {
        type    : String
    },
    extension    : {
        type    : String
    }
}, {
    strict          : false
});

export const Filedoc = mongoose.model("Filedocs", FiledocSchema); 
