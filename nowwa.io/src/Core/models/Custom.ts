import mongoose from 'mongoose';

export type CustomType = {
    schemaName      : string,
    schemaFields?   : {[key:string]:string}
};

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type MongooseCustomType = WithRequired<CustomType, 'schemaFields'>;

type CustomDocument = mongoose.Document & MongooseCustomType;

export enum CustomProperty {
    schemaName      = 'schemaName',
    schemaFields    = 'schemaFields'
};

const CustomSchema = new mongoose.Schema<CustomDocument>({
    schemaName      : {
        type        : String,
        unique      : true
    },
    schemaFields    : {
        type        : Map,
        of          : String
    }
}, {
    strict          : true
});

export const Custom = mongoose.model("Customs", CustomSchema); 