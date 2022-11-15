import dotenv from 'dotenv';

class CONFIG 
{
    private static _vars: CONFIG.Config;

    public static get vars(): CONFIG.Config 
    {
        if (!this._vars) {
            this._vars = this.MainConfig;
        }
        return this._vars;
    }

    private static GetFullUrl(port: number, url: string, useSsl: boolean): string 
    {
        return (useSsl ? `https` : `http`) +
            `://` +
            `${url}` +
            `:` +
            `${port}`;
    }

    private static get MainConfig(): CONFIG.Config 
    {
        dotenv.config();

        let corePort: number = parseInt(process.env.CORE_PORT as string);
        let coreHost: string = process.env.CORE_HOST as string;
        let coreUseSsl: boolean = process.env.CORE_USE_SSL as string == 'true';
        let coreFullUrl: string = this.GetFullUrl(corePort, coreHost, coreUseSsl);

        let publicPort: number = parseInt(process.env.PUBLIC_PORT as string);
        let publicHost: string = process.env.PUBLIC_HOST as string;
        let publicUseSsl: boolean = process.env.PUBLIC_USE_SSL as string == 'true';
        let publicFullUrl: string = this.GetFullUrl(publicPort, publicHost, publicUseSsl);

        console.log(publicFullUrl);

        return {

            VERSION: "0.0.2",

            ENVIRONMENT: this.parseEnvironment(process.env.ENVIRONMENT as string),

            EXPRESS_SECRET: process.env.EXPRESS_SECRET as string,

            MONGODB_HOST: process.env.MONGODB_HOST as string,
            MONGODB_PORT: parseInt(process.env.MONGODB_PORT as string),
            MONGODB_DB: process.env.MONGODB_DB as string,
            MONGODB_USER: process.env.MONGODB_USER as string,
            MONGODB_PASS: process.env.MONGODB_PASS as string,
            MONGODB_CERT: process.env.MONGODB_CERT as string,

            CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
            CLOUDINARY_KEY: process.env.CLOUDINARY_KEY as string,
            CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET as string,

            SOCKET_PORT: parseInt(process.env.SOCKET_PORT as string),

            CORE_PORT: corePort,
            CORE_FULL_URL: coreFullUrl,
            PUBLIC_FULL_URL: publicFullUrl,

            NAKAMA_PORT: parseInt(process.env.NAKAMA_PORT as string),
            NAKAMA_HOST: process.env.NAKAMA_HOST as string,
            NAKAMA_HTTP_KEY: process.env.NAKAMA_HTTP_KEY as string,
            NAKAMA_SERVER_KEY: process.env.NAKAMA_SERVER_KEY as string,
            NAKAMA_USE_SSL: process.env.NAKAMA_USE_SSL as string == 'true',

            TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID as string,
            TWITTER_CALLBACK_URL: `${publicFullUrl}${twitterCallbackUrl}`,
            TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT_SECRET as string,

            DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID as string,
            DISCORD_CALLBACK_URL: `${publicFullUrl}${discordCallbackUrl}`,
            DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET as string,

            SNAPCHAT_CLIENT_ID: process.env.SNAPCHAT_CLIENT_ID as string,
            SNAPCHAT_CALLBACK_URL: `${publicFullUrl}${snapchatCallbackUrl}`,
            SNAPCHAT_CLIENT_SECRET: process.env.SNAPCHAT_CLIENT_SECRET as string,

            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
            GOOGLE_CALLBACK_URL: `${publicFullUrl}${googleCallbackUrl}`,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,

            VERIFY_EMAIL_SENDER: process.env.VERIFY_EMAIL_SENDER as string,
            VERIFY_EMAIL_PASSWORD: process.env.VERIFY_EMAIL_PASSWORD as string,

        };
    }
}

namespace CONFIG 
{
    export type Environment = 'ssl_development' | 'development' | 'production' | 'unknown';

    export const parseEnvironment = (input: string): Environment => 
    {
        if (input == 'development') {
            return 'development';
        } else if (input == 'production') {
            return 'production';
        } else if (input == 'ssl_development') {
            return 'ssl_development';
        } else {
            return 'unknown';
        }
    }

    export type Config = 
    {
        VERSION: string,

        ENVIRONMENT: Environment,

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

        CORE_PORT: number,
        CORE_FULL_URL: string,

        PUBLIC_FULL_URL: string,

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

export const twitterAuthUrl: string = `/twitterAuth`;
export const twitterCallbackUrl: string = `/twitterCallback`;

export const discordAuthUrl: string = `/discordAuth`;
export const discordCallbackUrl: string = `/discordCallback`;

export const googleAuthUrl: string = `/googleAuth`;
export const googleCallbackUrl: string = `/googleCallback`;

export const snapchatAuthUrl: string = `/snapchatAuth`;
export const snapchatCallbackUrl: string = `/snapchatCallback`;

export const emailVerify: string = `/emailVerify`;

export const authTokenize: string = `/authTokenize`;
export const authLinks: string = `/authLinks`;
export const authVerify: string = `/authVerify`;
export const authLogin: string = `/authLogin`;
export const authRegister: string = `/authRegister`;

export const storageUrl: string = `/storage`;

export const toyUrl: string = `/toy`;

export const toyListUrl: string = `/toyList`;
export const toyBuildUrl: string = `/toyBuild`;
export const toyStatusUrl: string = `/toyStatus`;