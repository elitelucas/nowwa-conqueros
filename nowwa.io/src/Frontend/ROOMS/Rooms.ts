import CONQUER from "../CONQUER";
import RoomInstance from "./RoomInstance/RoomInstance";
import LOG, { log } from "../../UTIL/LOG";
import { ACTIONS } from "../../Models/ENUM";

class Rooms {
  private conquer: CONQUER;
  public pool: any = {};

  public constructor(instance: CONQUER) {
    this.conquer = instance;
  }

  public async set(avatarIDs: Array<string>, roomName: string): Promise<any> {
    let query = { avatarIDs: avatarIDs, name: roomName };

    let value = await this.conquer.do(ACTIONS.ROOM_SET, query);

    let room = new RoomInstance(this.conquer, value);

    this.pool[room.roomID] = room;

    return Promise.resolve(room);
  }

  /*=============== 
 
    GET (JOIN)
    {
        avatarIDs?:[ avatarID ] // [ yohamiID, JID ] 
    }

    [ avatarID1, avatarID2, etc ]
 
    ================*/

  public async get(vars: any): Promise<any> {
    let values: any = await this.conquer.do(ACTIONS.ROOM_GET, vars);

    for (var n in values) {
      let room = new RoomInstance(this.conquer, values[n]);
      this.pool[room.roomID] = room;
    }

    return Promise.resolve(this.pool);
  }

  //give avatarIDs or roomID
  public async getOne(vars: any): Promise<any> {
    if (Array.isArray(vars)) vars = { avatarIDs: vars };
    if (typeof vars == "string") vars = { roomID: vars };

    let value = await this.conquer.do(ACTIONS.ROOM_GETONE, vars);

    let room = new RoomInstance(this.conquer, value);

    this.pool[room.roomID] = room;

    return Promise.resolve(room);
  }

  /*=============== 


    LEAVE
    

    ================*/

  public async leave(roomID: any): Promise<any> {
    delete this.pool[roomID];

    return Promise.resolve();
  }

  /*=============== 


    ON MESSAGE
    

    ================*/

  public _onServerMessage(object: any) {
    for (let n in object.messages) {
      let message = object.messages[n];

      if (message.avatarID == this.conquer.User!.avatarID) continue;

      let room = this.pool[message.roomID];
      if (room) room._onServerMessage(message);
    }
  }
}

export default Rooms;
