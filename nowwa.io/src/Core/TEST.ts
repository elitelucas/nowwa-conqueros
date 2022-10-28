import LOG, { log } from "./UTILS/LOG";
import DB from "./DB/DB";
import { randomBytes } from "crypto";
import DBTABLE from "./DB/DBTABLE";

class TEST {

    public static async test() {
        log('TESTING');

        /* Get Structure */
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

        /* Create Dataitem Loose */
        let input005: DB.Query = {
            "values": {
                "key01": 5,
                "key02": "a string"
            },
        };
        let item005 = await DB.set2("schemaLoose", input005);
        let id005 = item005._id;
        log(JSON.stringify(item005));
        log('done 5');

        /* Retrieve Dataitem Loose */
        let input006: DB.Query = {
            "where": {
                "_id": id005
            },
        };
        let item006 = await DB.get2("schemaLoose", input006);
        log(JSON.stringify(item006));
        log('done 6');

        /* Change Dataitem Loose */
        let input007: DB.Query = {
            "where": {
                "_id": id005
            },
            "values": {
                "key03": "a string"
            },
        };
        let item007 = await DB.change2("schemaLoose", input007);
        log(JSON.stringify(item007));
        log('done 7');

        /* Delete Dataitem Loose*/
        let input008: DB.Query = {
            "where": {
                "_id": id005
            },
        };
        await DB.remove2("schemaLoose", input008);
        log('done 8');


        // /* Create Dataitem */
        // let struct001 = await Database.StructureLoad(["schema002"]);
        // console.log(JSON.stringify(struct001));

        // /* Create Dataitem */
        // let input001: Database.Query = {
        //     "add": {
        //         "field001": 5,
        //         "field002": "a string",
        //         "field003": true,
        //         "field004": {
        //             "key": "value"
        //         }
        //     },
        // };
        // let item001 = await Database.DataSave("schema002", input001);
        // let id001: string = (item001 as any)._id;
        // console.log(JSON.stringify(item001));
        // console.log('done 1');

        // /* Retrieve Dataitem */
        // let input002: Database.Query = {
        //     "where": {
        //         "_id": id001
        //     },
        // };
        // let item002 = await Database.DataLoad("schema002", input002);
        // console.log(JSON.stringify(item002));
        // console.log('done 2');

        // /* Change Dataitem */
        // let input003: Database.Query = {
        //     "where": {
        //         "_id": id001
        //     },
        //     "values": {
        //         "field001": 10,
        //         "field002": "not a string",
        //         "field003": false,
        //         "field004": {
        //             "key": "value 2"
        //         }
        //     },
        // };
        // let item003 = await Database.DataSave("schema002", input003);
        // console.log(JSON.stringify(item003));
        // console.log('done 3');

        // /* Delete Dataitem */
        // let input004: Database.Query = {
        //     "where": {
        //         "_id": id001
        //     },
        //     "values": {
        //         "field001": 10,
        //         "field002": "not a string",
        //         "field003": false,
        //         "field004": {
        //             "key": "value 2"
        //         }
        //     },
        // };
        // await Database.DataDelete("schema002", input004);
        // console.log('done 4');

    }

};

export default TEST;