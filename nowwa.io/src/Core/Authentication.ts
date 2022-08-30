import passport from 'passport';
import express from 'express';
import passportLocal from 'passport-local';
import { User, UserDocument } from '../Models/User';
import Environment, { authenticationCoreUrl } from './Environment';
import { EnvType } from 'ts-dotenv';

class Authentication {

    public static async AsyncInit (app:express.Express, env:EnvType<typeof Environment>):Promise<void> {
        Authentication.InitPassport();
        Authentication.WebhookLogin(app);
        Authentication.WebhookRegister(app);
        return Promise.resolve();
    }

    /**
     * Initialize Passport module.
     */
    private static InitPassport ():void {
        console.log(`init passport...`);
        passport.use(new passportLocal.Strategy({
            passwordField: "password",
            usernameField: "username"
        }, (username, password, done) => {
            User.findOne({ username: username }, async (error:Error, user?:any) => {
                if (error) { return done(error); }
                if (!user) { return done(new Error("user does not exists"), false); }
                user.verifyPassword(password, (error:Error, isMatch:boolean) => {
                    if (error) { return done(error); }
                    if (!isMatch) { return done(new Error("incorrect password"), false); }
                    return done(null, user);
                });
            });
        }));
    }

    /**
     * Webhook for Login. 
     * @param app @type {express.Express}
     */
    private static WebhookLogin (app:express.Express):void {
        let url:string = `/login`;
        app.use(`${authenticationCoreUrl}${url}`, (req, res) => {
            console.log(`<-- authentication - login`);
            let username:string = req.body.username;
            let password:string = req.body.password;
            let authentication:Authentication.Input = {
                Username: username,
                Password: password
            };
            Authentication.Login(authentication)
                .then((user) => {
                    res.send({ success: true, value: user });
                })
                .catch((error) => {
                    res.send({ success: false, error: error.message });
                });
        });
    }

    /**
     * Webhook for Register. 
     * @param app @type {express.Express}
     */
    private static WebhookRegister (app:express.Express):void {
        let url:string = `/register`;
        app.use(`${authenticationCoreUrl}${url}`, (req, res) => {
            console.log(`<-- authentication - register`);
            let username:string = req.body.username;
            let password:string = req.body.password;
            let authentication:Authentication.Input = {
                Username: username,
                Password: password
            };
            Authentication.Register(authentication)
                .then((user) => {
                    res.send({ success: true, value: user });
                })
                .catch((error) => {
                    res.send({ success: false, error: error.message });
                });
        });
    }

    /**
     * Login with provided username & password.
     * @param args @type {Authentication.Input} 
     */
    public static async Login (args:Authentication.Input):Promise<UserDocument> {
        return new Promise((resolve, reject) => {
            var req:any = { 
                body: { 
                    username: args.Username,
                    password: args.Password
                }
            };
            passport.authenticate('local', (error:Error, user:UserDocument) => {
                if (error) {
                    reject(error.message);
                } else {
                    resolve(user);
                }
            })(req, null);
        });
    }

    /**
     * Register with provided username & password.
     */
    public static async Register (args:Authentication.Input):Promise<UserDocument> {
        return new Promise((resolve, reject) => {
            User.findOne({ username: args.Username }, async (error:Error, user:UserDocument) => {
                if (error) { 
                    reject(error.message);
                    return;
                }
                if (user) { 
                    reject(new Error("user already exists!"));
                    return;
                } 
                const newUser = new User({ username: args.Username, password: args.Password });
                await newUser.save();
                resolve(newUser);
            });
        });
    }

}

namespace Authentication {

    /**
     * Input type for various authentication method.
     */
    export interface Input {
        Username:string;
        Password:string;
        RePassword?:string;
    }
}

export default Authentication;