import mongoose from 'mongoose';
import bcrypt from "bcrypt";

type verifyPasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => void) => void;

export type UserDocument = mongoose.Document & {
    email           : string,
    isEmailVerified : boolean,
    password        : string,
    verifyPassword  : verifyPasswordFunction
};

const UserSchema = new mongoose.Schema<UserDocument>({
    email           : {
        type        : String,
    },
    isEmailVerified : {
        type        : Boolean,
        default     : false,
    },
    password        : {
        type        : String
    },
    dateCreated     : {
        type        : Date,
        default     : Date.now
    }
}, {
    strict          : false
});

UserSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.verifyPassword = function (this: any, candidatePassword:string, cb:(error:Error | undefined, isMatch:boolean) => void) {
    bcrypt.compare(candidatePassword, this.password, function (error, isMatch) {
        cb(error, isMatch);
    });
};

export default mongoose.model("Users", UserSchema); 
