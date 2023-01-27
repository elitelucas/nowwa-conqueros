import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import QUERY from "../../../UTIL/QUERY";
import TRIBE from "./TRIBE/TRIBE";
import TRIBE_ASSOCIATIONS from "./TRIBE/TRIBE_ASSOCIATIONS";
import TRIBE_MEMBERS from "./TRIBE/TRIBE_MEMBERS";
import FOLDER from "../../ITEM/INSTANCE/FOLDER";
import ITEM from "../../ITEM/ITEM";
import FRIENDS from "./FRIENDS/FRIENDS";

class AVATAR {
  private static table: string = "avatars";

  /*=============== 


    GET  
    

    ================*/

  public static async get(vars: any): Promise<any> {
    console.log("Core/Avatar/get", vars);

    //returns where firstname exists
    var results = await DATA.get(this.table, {
      where: {
        firstName: {
          $exists: true,
          $type: "string",
          //   $not: { $regex: "^Guest" },
        },
      },
    });
    return Promise.resolve(results);
  }

  public static async getOne(vars: any): Promise<any> {
    let avatar = await DATA.getOne(this.table, vars);
    if (!avatar) avatar = await this.set(vars);

    return Promise.resolve(avatar);
  }

  public static async getUsernameIDbyAvatarID(avatarID: string): Promise<any> {
    let item = await this.getOne({ _id: avatarID });
    if (item) return Promise.resolve(item.usernameID);

    return Promise.resolve(null);
  }

  public static async getFirstName(query: any): Promise<any> {
    let item = await this.getOne(query);
    if (item) return Promise.resolve(item.firstName);

    return Promise.resolve(null);
  }

  public static async fill(array: any): Promise<any> {
    for (var n in array) {
      let item = array[n];

      if (item.avatarID) {
        let avatarData = await this.get({ _id: item.avatarID });

        item.firstname = avatarData.firstName;
        item.userPhoto = avatarData.userPhoto;
      }
    }

    return Promise.resolve(array);
  }

  /*=============== 


    SET  

    {
        usernameID,
        firstName
        lastName,
        picture,
    }
 
    ================*/

  public static async set(vars: any): Promise<any> {
    let avatar = await DATA.set(this.table, QUERY.set(vars));
    let avatarID = avatar._id;

    let tribe = await TRIBE.set({
      private: true,
      domainID: avatarID,
      type: "avatarAdmin",
      avatarIDs: [avatarID],
    });

    let friends = await TRIBE.set({
      type: "friends",
      domainID: avatarID,
      private: true,
    });

    let followers = await TRIBE.set({
      type: "followers",
      domainID: avatarID,
    });

    await TRIBE_MEMBERS.set({
      tribeID: friends._id,
      avatarID: avatarID,
      role: 0,
      hidden: true,
    });

    await TRIBE_MEMBERS.set({
      tribeID: followers._id,
      avatarID: avatarID,
      role: 0,
      hidden: true,
    });

    let folder = await FOLDER.set({
      type: "root",
      avatarID: avatar._id,
    });

    return Promise.resolve(avatar);
  }

  /*=============== 


    CHANGE  
    

    ================*/

  public static async change(query: any): Promise<any> {}

  /*=============== 


    REMOVE  
    

    ================*/

  public static async remove(query: any): Promise<any> {
    query = QUERY.get(query);

    if (query.where.usernameID) {
      let results: any = this.get({ usernameID: query.usernameID });
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
  }

  public static async removeAvatar(avatarID: any): Promise<any> {
    await ITEM.remove({ avatarID: avatarID });
    await FOLDER.remove({ avatarID: avatarID });
  }
}

export default AVATAR;
