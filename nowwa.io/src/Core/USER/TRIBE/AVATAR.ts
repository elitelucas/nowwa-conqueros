import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import QUERY from "../../../UTIL/QUERY";
import TRIBE from "./TRIBE";
import TRIBE_ASSOCIATIONS from "./TRIBE_ASSOCIATIONS";
import TRIBE_MEMBERS from "./TRIBE_MEMBERS";
import FOLDER from "../../ITEM/INSTANCE/FOLDER";
import ITEM from "../../ITEM/ITEM";

class AVATAR {
    private static table: string = "avatars";

    /*=============== 


    GET  
    

    ================*/

    public static async get(vars: any): Promise<any> {
        var results = await DATA.get(this.table, vars);

        return Promise.resolve(results);
    };

    public static async getOne(vars: any): Promise<any> {
        let avatar = await DATA.getOne(this.table, vars);
        if (!avatar) avatar = await this.set(vars);

        return Promise.resolve(avatar);
    };


    /*=============== 


    SET  

    {
        uID,
        firstName
        lastName,
        picture,
    }
 
    ================*/

    public static async set(vars: any): Promise<any> {
        let avatar = await DATA.set(this.table, QUERY.set(vars));

        let tribe = await TRIBE.set(
            {
                domainID: avatar._id,
                type: "avatar"
            });

        await TRIBE_MEMBERS.set(
            {
                tribeID: tribe._id,
                avatarID: avatar._id,
                role: 0
            });

        await FOLDER.set(
            {
                type: "root",
                avatarID: avatar._id
            });

        return Promise.resolve(avatar);
    };

    /*=============== 


    CHANGE  
    

    ================*/

    public static async change(query: any): Promise<any> {

    };

    /*=============== 


    REMOVE  
    

    ================*/

    public static async remove(query: any): Promise<any> {
        query = QUERY.get(query);

        if (query.where.uID) {
            let results: any = this.get({ uId: query.uID });
            for (let n in results) await this.removeAvatar(results[n]._id);
        }

        if (query.where._id) {
            let results = this.get({ _id: query._id });

            for (let n in results) {
                // remove FOLDERS, ITEMS
            }
        }

        await DATA.remove(this.table, query);
        return Promise.resolve();
    };


    public static async removeAvatar(avatarID: any): Promise<any> {
        await ITEM.remove({ avatarID: avatarID });
        await FOLDER.remove({ avatarID: avatarID });

    };


};

export default AVATAR;