import dotenv from 'dotenv';

class CONFIG {
    public static vars: CONFIG.Config;

    public static init() {
        let test = this.CoreConfig;
    }

    private static get MainConfig(): CONFIG.Config {
        return {

            VERSION: "0.0.1",

            EXPRESS_SECRET: "conqueros",

            MONGODB_HOST: "db-mongodb-conqueros-a434f3ba.mongo.ondigitalocean.com",
            MONGODB_PORT: 27017,
            MONGODB_DB: "admin",
            MONGODB_USER: "doadmin",
            MONGODB_PASS: "Hi730Rw829Pk4J1q",
            MONGODB_CERT: "certificates/db.ca-certificate.crt",

            CLOUDINARY_NAME: "gearball",
            CLOUDINARY_KEY: "155952797698712",
            CLOUDINARY_SECRET: "_qyQf6rr2QpB_-grhKotmrF-twQ",

            SOCKET_PORT: 9003,
            PORT: 0,
            URL: "0.0.0.0",
            USE_SSL: false,

            NAKAMA_PORT: 7350,
            NAKAMA_HOST: "127.0.0.1",
            NAKAMA_HTTP_KEY: "server-N0ww@",
            NAKAMA_SERVER_KEY: "server-N0ww@",
            NAKAMA_USE_SSL: false,

            TWITTER_CLIENT_ID: "Y0hRYi1qaC1mU0ZYdTgtbGZXNVA6MTpjaQ",
            TWITTER_CALLBACK_URL: `https://nowwa.io/twitterCallback`,
            TWITTER_CLIENT_SECRET: `tWeyCLNxn1XKcSzarGw4H5t3RdVBu2u0W5Yrux9MRMRzFvSpqM`,

            DISCORD_CLIENT_ID: "1037020376892452864",
            DISCORD_CALLBACK_URL: `https://nowwa.io/discordCallback`,
            DISCORD_CLIENT_SECRET: `laUsJFYDewoElB51evKhJZx4cjm-9w4g`,

            SNAPCHAT_CLIENT_ID: "e6a503b3-6929-4feb-a6d9-b1dc0bd963ed",
            SNAPCHAT_CALLBACK_URL: `https://nowwa.io/snapchatCallback`,
            SNAPCHAT_CLIENT_SECRET: `CqbjgYrWsK-8xmZW_CLWJ4xfc6DR4RvPegGlx590hGI`,

            GOOGLE_CLIENT_ID: "494971460278-q1luigu21k84335c5v5gc29m5v39kc9v.apps.googleusercontent.com",
            GOOGLE_CALLBACK_URL: `https://nowwa.io/googleCallback`,
            GOOGLE_CLIENT_SECRET: `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`,

            VERIFY_EMAIL_SENDER: `lanting.dlapan@gmail.com`,
            VERIFY_EMAIL_PASSWORD: `ydkcknektbfmjmtm`

        };
    }

    public static get CoreConfig(): CONFIG.Config {
        let config: CONFIG.Config = this.vars = this.MainConfig;

        dotenv.config();

        config.URL = process.env.CORE_URL as string;
        config.PORT = parseInt(process.env.CORE_PORT as string);
        config.USE_SSL = process.env.CORE_USE_SSL as string == 'true';

        return config;
    }

    public static get PublicConfig(): CONFIG.Config {
        let config: CONFIG.Config = this.vars = this.MainConfig;

        dotenv.config();

        config.URL = process.env.PUBLIC_URL as string;
        config.PORT = parseInt(process.env.PUBLIC_PORT as string);
        config.USE_SSL = process.env.PUBLIC_USE_SSL as string == 'true';

        return config;
    }

    public static get CoreUrl(): string {
        let config: CONFIG.Config = this.CoreConfig;
        return (config.USE_SSL ? `https` : `http`) +
            `://` +
            `${config.URL}` +
            `:` +
            `${config.PORT}`;
    }

    public static get PublicUrl(): string {
        let config: CONFIG.Config = this.PublicConfig;
        return (config.USE_SSL ? `https` : `http`) +
            `://` +
            `${config.URL}` +
            `:` +
            `${config.PORT}`;
    }
}

namespace CONFIG {
    export type Config = {
        VERSION: string,

        EXPRESS_SECRET: string,

        MONGODB_HOST: string,
        MONGODB_PORT: number,
        MONGODB_DB: string,
        MONGODB_USER: string,
        MONGODB_PASS: string,
        MONGODB_CERT: string,

        CLOUDINARY_NAME: string,
        CLOUDINARY_KEY: string,
        CLOUDINARY_SECRET: string,

        SOCKET_PORT: number,
        URL: string,
        PORT: number,
        USE_SSL: boolean,

        NAKAMA_HOST: string,
        NAKAMA_PORT: number,
        NAKAMA_SERVER_KEY: string,
        NAKAMA_HTTP_KEY: string,
        NAKAMA_USE_SSL: boolean,

        TWITTER_CLIENT_ID: string,
        TWITTER_CALLBACK_URL: string,
        TWITTER_CLIENT_SECRET: string,

        DISCORD_CLIENT_ID: string,
        DISCORD_CALLBACK_URL: string,
        DISCORD_CLIENT_SECRET: string,

        SNAPCHAT_CLIENT_ID: string,
        SNAPCHAT_CALLBACK_URL: string,
        SNAPCHAT_CLIENT_SECRET: string,

        GOOGLE_CLIENT_ID: string,
        GOOGLE_CALLBACK_URL: string,
        GOOGLE_CLIENT_SECRET: string,

        VERIFY_EMAIL_SENDER: string,
        VERIFY_EMAIL_PASSWORD: string,
    };
}

export default CONFIG;

export const authenticationUrl: string = `/authentication`;

export const authenticationRegisterUrl: string = `/authRegister`;
export const authenticationLoginUrl: string = `/authLogin`;
export const authenticationVerifyUrl: string = `/authVerify`;
export const authenticationHashUrl: string = `/authHash`;

export const twitterAuthUrl: string = `/twitterAuth`;
export const twitterCallbackUrl: string = `/twitterCallback`;

export const discordCallbackUrl: string = `/discordCallback`;

export const googleAuthUrl: string = `/googleAuth`;
export const googleCallbackUrl: string = `/googleCallback`;

export const snapchatCallbackUrl: string = `/snapchatCallback`;

export const storageUrl: string = `/storage`;

export const toyUrl: string = `/toy`;

export const toyListUrl: string = `/toyList`;
export const toyBuildUrl: string = `/toyBuild`;
export const toyStatusUrl: string = `/toyStatus`;