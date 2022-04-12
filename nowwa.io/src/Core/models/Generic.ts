import mongoose from 'mongoose';

export type GenericDocument = mongoose.Document & {
    value           : string
};

const GenericSchema = new mongoose.Schema<GenericDocument>({
    value           : {
        type        : String,
    },
}, {
    strict          : false
});


export default mongoose.model("Generics", GenericSchema); 