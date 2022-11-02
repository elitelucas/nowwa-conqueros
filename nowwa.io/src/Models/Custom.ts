import mongoose from 'mongoose';
import { WithRequired } from '../UTIL/Utils';

export type CustomType = {
    schemaName      : string,
    schemaFields?   : {[key:string]:
        string |
        number |
        boolean | 
        object
    }
};

export type CustomDocument = mongoose.Document & WithRequired<CustomType, 'schemaFields'>;

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