import DATA from "../DATA/DATA";
import EMAIL from "./EMAIL";
import DATE from '../../UTIL/DATE';
import USERNAME_CONTACTS from "./USERNAME_CONTACTS";
import USERNAME_PROXY from "./USERNAME_PROXY";
import LOG from "../../UTIL/LOG";
import AVATAR from "./TRIBE/AVATAR";
import mongoose from "mongoose";
import { BASETYPE } from "../HELPERS";

class USERNAME {
    private static table: string = "usernames";

    /*=============== 


    SET  
    

    ================*/

    public static async set(vars: any): Promise<any> {
        let user;

        try {
            user = await DATA.getOne(this.table, { username: vars.username });
        } catch (error) {
            // if user does not exists, then proceed
            console.log(`user does not exists! continue...`);
        }

        if (user) return Promise.reject(LOG.msg('user already exists'));

        user = await DATA.set(this.table, vars);
        let uID = user._id;

        // Look for previous accounts that have used this email
        // Do merge

        await EMAIL.set(
            {
                email: vars.username,
                isVerified: vars.isVerified,
                uID: uID
            });

        await AVATAR.set({ uID: uID, isMain: true, firstName: vars.username });

        return Promise.resolve(user);
    };

    /*=============== 


    GET  
    

    ================*/

    public static async get(vars: any): Promise<any> {
        let item = await DATA.getOne(this.table, vars);

        if (!item) return Promise.reject(LOG.msg('User does not exist'));

        return Promise.resolve(item);
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change(query: any) {
        let results = DATA.change(this.table, query);
        return Promise.resolve(results);
    }

    public static async changeLastLogin(uID: any) {
        let user = await this.change(
            {
                where: { _id: uID },
                values: { lastLogin: DATE.now() }
            });

        return Promise.resolve(user);
    }

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove(uID: any): Promise<any> {
        // remove everything created by this userName


        // remove userName itself

        await DATA.remove(this.table, uID);

        return Promise.resolve();
    }

    /*=============== 


    REPARENT  
    

    ================*/

    public static async reparent(newUID: any, oldUID: any): Promise<any> {
        EMAIL.reparent(newUID, oldUID);
        USERNAME_PROXY.reparent(newUID, oldUID);
        USERNAME_CONTACTS.reparent(newUID, oldUID);

        // Merge game data, wallets, anything else 

        this.remove(oldUID);

        return Promise.resolve();
    }



    /*===============


    STRICT TYPE - IGNORE  
    

    ================*/

    //#region "STRICT TYPE - IGNORE"

    public static async changeLastLogin2(uID: any) {

        let user = await this.change2(
            { _id: uID, },
            { lastLogin: DATE.now() }
        );

        return Promise.resolve(user);
    }

    public static async set2(values: Partial<USERNAME.TYPE>): Promise<USERNAME.DOCUMENT> {
        let user: USERNAME.DOCUMENT = null;

        try {
            user = await DATA.getOne2<USERNAME.TYPE>(this.table, {
                username: values.username
            });
        } catch (error) {
            // if user does not exists, then proceed
            console.log(`user does not exists! continue...`);
        }

        if (user) return Promise.reject(LOG.msg('user already exists'));

        user = await DATA.set2<USERNAME.TYPE>(this.table, values);
        let uID = user!._id;

        // Look for previous accounts that have used this email
        // Do merge

        await EMAIL.set(
            {
                email: values.username,
                isVerified: values.isVerified,
                uID: uID
            });

        await AVATAR.set({ uID: uID, isMain: true });

        return Promise.resolve(user);
    };

    public static async change2(where: Partial<USERNAME.TYPE>, values: Partial<USERNAME.TYPE>) {
        return DATA.change2<USERNAME.TYPE>(this.table, where, values);
    }

    public static async get2(vars: Partial<USERNAME.TYPE>): Promise<USERNAME.DOCUMENT> {
        return DATA.getOne2<USERNAME.TYPE>(this.table, vars);
    };

    //#endregion "x"

};

namespace USERNAME {
    export type TYPE = BASETYPE & {
        username: string,
        password: string,
        admin: boolean,
        isVerified: boolean,
        lastLogin: number,
        lastChange: number,
    };
    export type DOCUMENT = DATA.DOCUMENT<TYPE>;
}

export default USERNAME;