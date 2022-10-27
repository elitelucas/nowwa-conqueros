import LOG, { log } from "./UTILS/LOG";
import DB from "./DB/DB";
import { randomBytes } from "crypto";
import DBTABLE from "./DB/DBTABLE";

class TEST {

    public static async test() {
        log('TESTING');

        /* Create Dataitem */
        let struct001 = await DBTABLE.get("schema002");
        log(JSON.stringify(struct001));

        /* Create Dataitem */
        let input001: DB.Query = {
            "values": {
                "field001": 5,
                "field002": "a string",
                "field003": true,
                "field004": {
                    "key": "value"
                }
            },
        };
        let item001 = await DB.set("schema002", input001);
        let id001: string = (item001 as any)._id;
        log(JSON.stringify(item001));
        log('done 1');

        /* Retrieve Dataitem */
        let input002: DB.Query = {
            "where": {
                "_id": id001
            },
        };
        let item002 = await DB.get("schema002", input002);
        log(JSON.stringify(item002));
        log('done 2');

        /* Change Dataitem */
        let input003: DB.Query = {
            "where": {
                "_id": id001
            },
            "values": {
                "field001": 10,
                "field002": "not a string",
                "field003": false,
                "field004": {
                    "key": "value 2"
                }
            },
        };
        let item003 = await DB.set("schema002", input003);
        log(JSON.stringify(item003));
        log('done 3');

        /* Delete Dataitem */
        let input004: DB.Query = {
            "where": {
                "_id": id001
            },
        };
        await DB.remove("schema002", input004);
        log('done 4');

    }

};

export default TEST;