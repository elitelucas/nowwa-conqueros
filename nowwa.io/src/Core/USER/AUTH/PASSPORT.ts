import passport from "passport";
import passportLocal from 'passport-local';
import { resolve } from "path";

class PASSPORT
{
    public static async init()
    {
        passport.use( new passportLocal.Strategy(
        {
            passwordField: "password",
            usernameField: "email"
        }, (email, password, done) => {}));

        return resolve();
    }
};

export default PASSPORT;