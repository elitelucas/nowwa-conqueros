import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const ThirdPartyProviderSchema = new mongoose.Schema({
    providerName    : {
        type        : String,
        default     : null,
    },
    providerId      : {
        type        : String,
        default     : null,
    },
    providerData    : {
        type        : {},
        default     : null,
    }
});

const UserSchema = new mongoose.Schema({
    userName        : {
        type        : String,
        unique      : true,
    },
    email           : {
        type        : String,
        required    : true,
        unique      : true,
    },
    isEmailVerified : {
        type        : Boolean,
        default     : false,
    },
    password        : {
        type        : String,
    },
    thirdPartyAuth  : [ThirdPartyProviderSchema],
    dateCreated     : {
        type        : Date,
        default     : Date.now
    }
}, {
    strict          : false
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model("Users", UserSchema as mongoose.PassportLocalSchema); 
