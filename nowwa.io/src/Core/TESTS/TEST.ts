import mongoose, { mongo } from "mongoose";
import CONQUER from "../../Frontend/CONQUER";
import DATA from "../DATA/DATA";
import FOLDER from "../ITEM/INSTANCE/FOLDER";
import ITEM from "../ITEM/ITEM";
import AUTH from "../USER/AUTH/AUTH";
import EMAIL from "../USER/EMAIL";
import AVATAR from "../USER/TRIBE/AVATAR";
import USERNAME from "../USER/USERNAME";
import ACCOUNT from "./ACCOUNT";
import TEMPORARY from "./TEMPORARY";

class TEST {

    public static async Run (): Promise<void> {

        // TESTING
        try {

            let conquer1 = new CONQUER('user001');
            let conquer2 = new CONQUER('user002');

            await conquer1.init();
            await conquer2.init();
        }
        catch ( error ) {
            console.log( error );
        }

        return Promise.resolve();
    }

    public static async Fun ( w: string ) {

    }
}

namespace TEST {

}

export default TEST;
