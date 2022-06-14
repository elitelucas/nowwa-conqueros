import mongoose from 'mongoose';
import { WithRequired } from '../Utils';

export type CustomType = {
    schemaName      : string,
    schemaFields?   : {[key:string]:string}
};

type CustomDocument = mongoose.Document & WithRequired<CustomType, 'schemaFields'>;

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
        type        : mongoose.Schema.Types.Mixed
    }
}, {
    strict          : false
});

export const Custom = mongoose.model("Customs", CustomSchema); 