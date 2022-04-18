import mongoose from 'mongoose';

export type CustomType = {
    schemaName      : string,
    schemaFields?    : {[key:string]:string}
};

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type MongooseCustomType = WithRequired<CustomType, 'schemaFields'>;

type CustomDocument = mongoose.Document & MongooseCustomType;

const CustomSchema = new mongoose.Schema<CustomDocument>({
    schemaName          : {
        type        : String,
        unique      : true
    },
}, {
    strict          : false
});

export const Custom = mongoose.model("Customs", CustomSchema); 