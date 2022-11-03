import passport from "passport";
import passportLocal from 'passport-local';

class PASSPORT
{
    public static init()
    {
        passport.use( new passportLocal.Strategy(
        {
            passwordField: "password",
            usernameField: "email"
        }, (email, password, done) => {}));
    }
};

export default PASSPORT;