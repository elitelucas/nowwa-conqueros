import mongoose from 'mongoose';
import { WithRequired } from '../UTIL/Utils';
import { FiledocDocument, FiledocSchema } from './Filedoc';
import bcrypt from "bcrypt";

type verifyPasswordFunction = (candidatePassword: string, cb: (error: Error | undefined, isMatch: boolean) => void) => void;

type addFileFunction = (filedoc: FiledocDocument, cb: (error: Error | undefined) => void) => void;

export type UserType = {
    username: string,
    email?: string,
    isEmailVerified: boolean,
    password: string,
    files: FiledocDocument[]
};

export type UserDocument = mongoose.Document & WithRequired<UserType, 'email'> & {
    verifyPassword: verifyPasswordFunction,
    addFile: addFileFunction
};

export const UserSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String
    },
    files: {
        type: [FiledocSchema],
        default: []
    }
}, {
    strict: false
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

UserSchema.methods.verifyPassword = function (this: UserDocument, candidatePassword: string, cb: (error: Error | undefined, isMatch: boolean) => void) {
    // console.log(`this.username: ${this.username} | candidatePassword: ${candidatePassword} | this.password: ${this.password}`);
    bcrypt.compare(candidatePassword, this.password, function (error, isMatch) {
        cb(error, isMatch);
    });
};

export const User = mongoose.model("Users", UserSchema); 
