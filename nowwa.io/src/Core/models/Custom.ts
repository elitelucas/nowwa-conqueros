import mongoose from 'mongoose';

export type CustomDocument = mongoose.Document & {
    name            : string,
    value           : {[key:string]:string}
};

const CustomSchema = new mongoose.Schema<CustomDocument>({
    name            : {
        type        : String,
        unique      : true
    },
}, {
    strict          : false
});


export default mongoose.model("Customs", CustomSchema); 