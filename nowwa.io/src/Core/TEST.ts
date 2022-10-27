import LOG, { log } from "./UTILS/LOG";
import DB from "./DB/DB";
import { randomBytes } from "crypto";

class TEST
{

    public static async test()
    {
        log('TESTING');
 
        // SAVE ITEM

        var query : DB.Query = 
        {
            values : {
                "userName"  : "GuestUser",
                "password"  : "123456"
            }
        };

        var response = await DB.set( "USERNAME", query );

        log( "Something happened", response );

    }  

};

export default TEST;