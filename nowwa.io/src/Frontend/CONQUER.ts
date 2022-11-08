import BridgeInstance from "./Socket/BridgeInstance";
import LOG, { log } from "../UTIL/LOG";
import SessionInstance from "./User/SessionInstance";
import UserInstance from "./User/UserInstance";

class CONQUER {
    public static USER: UserInstance = new UserInstance();
    public static SESSION: SessionInstance = new SessionInstance();
    public static BRIDGE: BridgeInstance = new BridgeInstance();

    public static async init(): Promise<any> {
        log("client: =============== New ConquerOS");

        await CONQUER.BRIDGE.init();
        //  await CONQUER.Session.init();

        return Promise.resolve();
    };

    /*

let input005: DB.Query = 
{
    "values": {
        "key01": 5,
        "key02": "save to usernames?"
    },
};
 
let item = await DB.set( "usernames", input005);
let id = item._id;
log( 'done 5', JSON.stringify(item), id );

let input006: DB.Query = 
{
    "where": {
        "_id": id
    },
};

let item006 = await DB.get("usernames", input006);
 
log( 'done 6', JSON.stringify(item006) );

let input007: DB.Query = 
{
    "where": {
        "_id": id
    },
    "values": {
       "key03": "a string"
    },
};

 let item007 = await DB.change("usernames", input007);

log('done 7', JSON.stringify(item007) );

let input008: DB.Query = 
{
    "where": {
        "_id": id
    },
};

// await DB.remove("schemaLoose", input008);
// log('done 8');

*/


}

export default CONQUER; 