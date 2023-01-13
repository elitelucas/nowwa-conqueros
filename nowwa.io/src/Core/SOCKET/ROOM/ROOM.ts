import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import QUERY from "../../../UTIL/QUERY";
import ROOM_ENTRIES from "./ROOM_ENTRIES";
import AVATAR from "../../USER/TRIBE/AVATAR";

class ROOM {
  public static pool: any = {};

  private static table: string = "rooms";

  /*=============== 


    GET   { avatarID }
 

    ================*/

  public static async get(query: any): Promise<any> {
    //return rooms which my avatarID is involved in members
    let rooms = await DATA.get(this.table, {
      where: {
        avatarIDs: QUERY.toObjectID(query.avatarID),
      },
    });

    return Promise.resolve(rooms);
  }

  /*=============== 


    GET ONE ( used for 'switch context' ) 
 
    {
        avatarIDs?:[]       
    }
    OR
    {
        roomID: string
    }

    
    ================*/

  public static async getOne(query: any): Promise<any> {
    if (query.avatarIDs) {
      let avatarIDs = query.avatarIDs;
      if (query.avatarID && !avatarIDs.includes(query.avatarID))
        avatarIDs.push(query.avatarID);
      delete query.avatarID;

      avatarIDs = QUERY.toObjectID(avatarIDs);
      query = { avatarIDs: { $all: avatarIDs, $size: avatarIDs.length } };
    }

    if (query.roomID) {
      query = { _id: query.roomID };
    }

    let room = await DATA.getOne(this.table, query);

    if (room) return Promise.resolve(room);
    else return Promise.resolve(null);
  }

  /*=============== 


    SET  

    {
        name?,
        avatarIDs?:[],      
    }
 
    ================*/

  public static async set(query: any): Promise<any> {
    let myAvatarID = query.avatarID;

    let name = query.name || "Room";

    let avatarIDs = query.avatarIDs;
    if (!avatarIDs.includes(myAvatarID)) avatarIDs = [...avatarIDs, myAvatarID]; //include me to members

    let room = await DATA.set(this.table, {
      name: name,
      avatarIDs: avatarIDs,
      ownerAvatarID: myAvatarID,
    });

    return Promise.resolve(room);
  }

  /*=============== 


    CHANGE  
    

    ================*/

  public static async change(query: any): Promise<any> {
    let value = await DATA.change(this.table, query);

    return Promise.resolve(value);
  }

  /*=============== 


    REMOVE  
    

    ================*/

  public static async remove(query: any): Promise<any> {
    let results = await DATA.get(this.table, query);

    for (let n in results)
      await ROOM_ENTRIES.remove({ roomID: results[n]._id });

    let removed = await DATA.remove(this.table, query);

    return Promise.resolve(removed);
  }
}

export default ROOM;
