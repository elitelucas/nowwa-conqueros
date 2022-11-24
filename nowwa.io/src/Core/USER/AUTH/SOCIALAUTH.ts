import { authLinks, authLogin, authRegister, authTokenize, authVerify } from "../../CONFIG/CONFIG";
import EXPRESS from "../../EXPRESS/EXPRESS";
import AUTH from "./AUTH";
import Discord from "./Discord";
import Google from "./Google";
import Snapchat from "./Snapchat";
import Twitter from "./Twitter";

import dotenv from 'dotenv';

dotenv.config(); 

class SOCIALAUTH {

    public static async init():Promise<void> {

        this.webhookAuthLinks();
        this.webhookAuthVerify();
        this.webhookAuthRegister();
        this.webhookAuthLogin();

        await Twitter.init();
        await Snapchat.init();
        await Discord.init();
        await Google.init();

        return Promise.resolve();

    }

    public static webhookAuthLinks() {
        EXPRESS.app.use(`${authLinks}`, (req, res) => {
            res.status(200).send({
                success: true,
                discord: Discord.AuthLink,
                snapchat: Snapchat.AuthLink,
                google: Google.AuthLink,
                twitter: Twitter.AuthLink
            });
        });
    }

    public static webhookAuthVerify() {
        EXPRESS.app.use(`${authVerify}`, async (req, res) => {
            let id: string = <string>req.body.id;
            let token: string = <string>req.body.token;
            let isMatch: boolean = await AUTH.verify(id, token);
            res.status(200).send({
                success: true,
                valid: isMatch
            });
        });
    }

    public static webhookAuthRegister() {
        EXPRESS.app.use(`${authRegister}`, async (req, res) => {
            let email: string = req.body.email;
            let password: string = req.body.password;
            let err;
            try {
                await AUTH.set({
                    username: email,
                    password: password
                });
            } catch (error) {
                err = error;
            }
            if (err) {
                res.send({
                    success: false,
                    error: (<Error>err).message
                });
            } else {
                res.send({
                    success: true
                });
            }
        });
    }

    public static webhookAuthLogin() {
        EXPRESS.app.use(`${authLogin}`, async (req, res) => {
            let email: string = req.body.email;
            let password: string = req.body.password;

            let user, err;

            try {
                user = await AUTH.get({
                    username: email,
                    password: password,
                });
            } catch (error) {
                err = error;
            }
            if (err) {
                res.send(
                    {
                        success: false,
                        error: (<Error>err).message
                    });
            } else {
                let token: string = await AUTH.tokenize(user.username);
                res.send(
                    {
                        success: true,
                        account:
                        {
                            id: user.username,
                            name: user.username,
                            token: token,
                            admin: user.admin,
                            friend_count: 0
                        }
                    });
            }
        });
    }
}

namespace SOCIALAUTH {

}

export default SOCIALAUTH;