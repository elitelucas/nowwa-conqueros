import DATA from "../DATA/DATA";
import EMAIL from "./EMAIL";
import DATE from '../../UTIL/DATE';
import USERNAME_CONTACTS from "./USERNAME_CONTACTS";
import USERNAME_PROXY from "./USERNAME_PROXY";
import LOG from "../../UTIL/LOG";
import AVATAR from "./TRIBE/AVATAR";
import mongoose from "mongoose";
import { BASETYPE } from "../HELPERS";

class USERNAME 
{
    private static table: string = "usernames";

    /*=============== 


    SET  
    

    ================*/

    public static async set( vars:any ): Promise<any> 
    {
        let user = await DATA.getOne( this.table, { username: vars.username });

        if( user ) return Promise.reject('user already exists');

        user = await DATA.set( this.table, vars );

        let usernameID = user._id;

        // Look for previous accounts that have used this email
        // Do merge

        await EMAIL.set(
        {
            email       : vars.email || vars.username,
            isVerified  : vars.isVerified,
            usernameID  : usernameID
        });

        await AVATAR.set({ usernameID:usernameID, isMain:true, firstName:vars.firstName || vars.username });

        return Promise.resolve(user);
    };

    /*=============== 


    GET  
    

    ================*/

    public static async get(vars: any): Promise<any> 
    {
        return DATA.getOne( this.table, vars);
    };

    public static async getOne(vars: any): Promise<any> 
    {
        return DATA.getOne( this.table, vars);
    };

    public static async getUsernameID( vars:any  ) : Promise<any>
    {
        let item = await this.getOne( vars );

        if( item ) return Promise.resolve( item._id );

        return Promise.resolve(null);
    };   

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change(query: any) 
    {
        let results = DATA.change(this.table, query);
        return Promise.resolve(results);
    }

    // USERLOGIN.change 

    public static async changeLastLogin( usernameID: any, token:any ) 
    {
        let user = await this.change(
        {
            where   : { _id: usernameID },
            values  : { lastLogin: DATE.now(), token:token }
        });

        return Promise.resolve(user);
    }

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove( usernameID : any): Promise<any> 
    {
        // remove everything created by this userName

        // remove userName itself

        await DATA.remove( this.table, {_id:usernameID} );

        return Promise.resolve();
    }

    /*=============== 


    REPARENT  
    

    ================*/

    public static async reparent( newUID: any, oldUID: any): Promise<any> 
    {
        EMAIL.reparent(newUID, oldUID);
        USERNAME_PROXY.reparent(newUID, oldUID);
        USERNAME_CONTACTS.reparent(newUID, oldUID);

        // Merge game data, wallets, anything else 

        this.remove(oldUID);

        return Promise.resolve();
    }
 

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