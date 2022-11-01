import LOG, { log } from "../UTIL/LOG";
import DB from "../Core/DB/DB";
import ConquerOS from "./ConquerOS";
 
class TEST {

    public static async test() 
    {
 
        new ConquerOS();

        return;

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

 


        // const twitterClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAMVhigEAAAAA5JRkvnUDEEg7HGIHJ%2F%2Fyydi%2Bm48%3DmLX4Se1qn4UPuyiHT8SF0uUuC4vGWMCNVVWmwA5zgEz7RtUKaW');


    }

};

export default TEST;