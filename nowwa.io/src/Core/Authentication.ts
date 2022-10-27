import passport from 'passport';
import express from 'express';
import passportLocal from 'passport-local';
import { User, UserDocument } from '../Models/User';
import Environment, { authenticationCoreUrl, authenticationLoginUrl, authenticationRegisterUrl, authenticationUrl } from './Environment';
import Database from './DEPRECATED/Database';
import bcrypt from "bcrypt";
import { CustomDocument } from '../Models/Custom';

class Authentication {

    public static async AsyncInit(app: express.Express, env: Environment.Config): Promise<void> {
        Authentication.InitPassport();
        Authentication.InitAuthentication();
        Authentication.WebhookLogin(app);
        Authentication.WebhookRegister(app);
        return Promise.resolve();
    }

    private static async InitAuthentication(): Promise<void> {
        let entity = await Database.StructureLoad([Authentication.entityTableName]);
        if (entity.length == 0) {
            Database.StructureSave(Authentication.entityTableName, {
                add: {
                    email: 'string',
                    password: 'string',
                    admin: 'boolean'
                },
            });
            entity = await Database.StructureLoad(['entity']);
        }
    }

    /**
     * Hash a string.
     */
    public static async Hash(input: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) { reject(err); }
                bcrypt.hash(input, salt, (err, output) => {
                    if (err) { reject(err); }
                    resolve(output);
                });
            });
        });
    }

    /**
     * Match a string with the hash.
     */
    public static async Match(input: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(input, hash, (err, isMatch) => {
                if (err) { reject(err); }
                resolve(isMatch);
            });
        });
    }

    /**
     * Check if user is an admin.
     */
    public static async Verify(token: string, id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let adminId: string = `${id}admin`;
            bcrypt.compare(adminId, token, (err, isMatch) => {
                if (err) { reject(err); }
                if (isMatch) {
                    resolve(true);
                }
                bcrypt.compare(id, token, (err, isMatch) => {
                    if (err) { reject(err); }
                    resolve(isMatch);
                });
            });
        });
    }

    /**
     * Initialize Passport module.
     */
    private static InitPassport(): void {
        console.log(`init passport...`);
        passport.use(new passportLocal.Strategy({
            passwordField: "password",
            usernameField: "username"
        }, (username, password, done) => {
            // User.findOne({ username: username }, async (error: Error, user?: any) => {
            //     if (error) { return done(error); }
            //     if (!user) { return done(new Error("user does not exists"), false); }
            //     user.verifyPassword(password, (error: Error, isMatch: boolean) => {
            //         if (error) { return done(error); }
            //         if (!isMatch) { return done(new Error("incorrect password"), false); }
            //         return done(null, user);
            //     });
            // });
        }));

        // passport.use(new passportTwitter.Strategy({
        //     callbackURL: '/oauth/callback/twitter.com',
        //     consumerKey: 'YLF6rHO3h35jWwmv3KWdhpaMB',
        //     consumerSecret: 'oTcahDYemJLTeCimUYcTHWBXfG6Jc0gVvRm7vJCukmyjxvCmQx'
        // }, (accessToken, refreshToken, profile, done) => {
        //     console.log(`Profile: ${profile.id}`);
        // }));
    }

    /**
     * Webhook for Login. 
     * @param app @type {express.Express}
     */
    private static WebhookLogin(app: express.Express): void {
        app.use(`${authenticationLoginUrl}`, (req, res) => {
            // console.log(`<-- authentication - login`);
            let username: string = req.body.username;
            let password: string = req.body.password;
            let authentication: Authentication.Input = {
                email: username,
                password: password
            };
            Authentication.Login(authentication)
                .then((user) => {
                    let admin = (user as any as Authentication.entityStructure).admin;
                    let userId = `${user._id}${admin ? 'admin' : ''}`
                    this.Hash(userId)
                        .then((hash) => {
                            res.send({
                                success: true, value: {
                                    id: user._id,
                                    token: hash,
                                    admin: admin
                                }
                            });
                        })
                        .catch((error) => {
                            res.send({ success: false, error: error.message });
                        });
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
    private static WebhookRegister(app: express.Express): void {
        app.use(`${authenticationRegisterUrl}`, (req, res) => {
            // console.log(`<-- authentication - register`);
            let username: string = req.body.username;
            let password: string = req.body.password;
            let authentication: Authentication.Input = {
                email: username,
                password: password
            };
            Authentication.Register(authentication)
                .then((user) => {
                    res.send({ success: true });
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
    public static async Login(args: Authentication.Input): Promise<CustomDocument> {
        // return new Promise((resolve, reject) => {
        //     var req: any = {
        //         body: {
        //             username: args.Username,
        //             password: args.Password
        //         }
        //     };
        //     passport.authenticate('local', (error: Error, user: UserDocument) => {
        //         if (error) {
        //             reject(error.message);
        //         } else {
        //             resolve(user);
        //         }
        //     })(req, null);
        // });
        let entities = await Database.DataLoad(Authentication.entityTableName, {
            where: {
                email: args.email
            }
        });
        if (entities.length == 0) {
            return Promise.reject(new Error('user does not exists...'));
        }
        let entity: Authentication.entityStructure = entities[0] as any;
        let isMatch: boolean = await Authentication.Match(args.password, entity.password);
        if (!isMatch) {
            return Promise.reject(new Error('incorrect password...'));
        }
        return Promise.resolve(entity as any);
    }

    /**
     * Register with provided username & password.
     */
    public static async Register(args: Authentication.Input): Promise<CustomDocument> {
        // return new Promise((resolve, reject) => {
        //     User.findOne({ username: args.Username }, async (error: Error, user: UserDocument) => {
        //         if (error) {
        //             reject(error.message);
        //             return;
        //         }
        //         if (user) {
        //             reject(new Error("user already exists!"));
        //             return;
        //         }
        //         const newUser = new User({ username: args.Username, password: args.Password });
        //         await newUser.save();
        //         resolve(newUser);
        //     });
        // });
        let entities = await Database.DataLoad(Authentication.entityTableName, {
            where: {
                email: args.email
            }
        });
        if (entities.length > 0) {
            return Promise.reject(new Error('user already exists...'));
        }
        let hash = await Authentication.Hash(args.password);
        console.log(`hashed: ${hash}`);
        let fields: Authentication.entityStructure = {
            email: args.email,
            password: hash,
            admin: false,
        }
        let entity = await Database.DataSave(Authentication.entityTableName, {
            values: fields
        });
        return Promise.resolve(entity);
    }

}

namespace Authentication {

    /**
     * Input type for various authentication method.
     */
    export interface Input {
        email: string;
        password: string;
    }

    export interface Output {
        id: string;
        token: string;
    }

    export const entityTableName: string = 'entity';
    export type entityStructure = {
        email: string,
        password: string,
        admin: boolean
    };
}

export default Authentication;