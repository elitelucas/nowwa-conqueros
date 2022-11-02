import Bridge from "./Bridge";
import LOG, { log } from "../UTIL/LOG";

class ConquerOS 
{
    private bridge                  : Bridge;
    private onInitializedCallback   : any;

    constructor( callback?: Function ) 
    {
        var self = this;

        log("client: =============== New ConquerOS");
        //if( callback ) 
        this.onInitializedCallback = callback;
 
        this.bridge = new Bridge( this.onConnect.bind(this) );
 
    }

    private onConnect() 
    {
        log("client: ========== CONQUER OS CONNECTED!");//,

        this.bridge.do( "AUTH.set", null, function( txt: any ) 
        {
            log( "client: callback test 1", txt );
        })
 
 
    }

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

export default ConquerOS; 