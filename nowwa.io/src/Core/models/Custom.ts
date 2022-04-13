import mongoose from 'mongoose';

export type CustomDocument = mongoose.Document & {
    name            : string,
    value           : string
};

const CustomSchema = new mongoose.Schema<CustomDocument>({
    name            : {
        type        : String,
    },
    value           : {
        type        : String,
    },
}, {
    strict          : false
});


export default mongoose.model("Customs", CustomSchema); 