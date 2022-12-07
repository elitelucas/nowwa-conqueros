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
            //#region "OLD TEST"

            // await TEMPORARY.Init();
            // let value = await ACCOUNT.Set({
            //     username: 'test2'
            // });
            // console.log(`value: ${JSON.stringify(value, null, 2)}`);
            // let results1 = await ACCOUNT.Get({
            //     username: 'test1'
            // });
            // console.log(`results1: ${JSON.stringify(results1, null, 2)}`);
            // let results2 = await ACCOUNT.Get({
            //     username: 'test2'
            // });
            // console.log(`results2: ${JSON.stringify(results2, null, 2)}`);
            // let results3 = await ACCOUNT.Set({
            //     username: 'test2'
            // });
            // console.log(`results3: ${JSON.stringify(results3, null, 2)}`);

            // let document = await DATA.getOne("usernames", {
            //     "username": "garibaldy.mukti@gmail.com"
            // });
            // console.log(document);
            // let usernameID = await EMAIL.getUID2(
            //     {
            //         email: "garibaldy.mukti@gmail.coms"
            //     }
            // );
            // console.log(`usernameID`, usernameID);
            // let user = await USERNAME.get2(
            //     {
            //         _id: new mongoose.Types.ObjectId(usernameID)
            //     }
            // );
            // console.log(`user`, JSON.stringify(user, null, 2));

            //#endregion "OLD TEST"

            // await CONQUER.init();

            // let result1 = await CONQUER.AUTH.set({
            //     username: "garibaldy.mukti@gmail.com",
            //     password: "1111"
            // });
            // console.log( `result1`, JSON.stringify( result1, null, 2 ) );

            // let result2 = await ITEM.get({
            //     avatarID: new mongoose.Types.ObjectId("6386fde4f62e3f8e2d42ce8b")
            // });
            // console.log( `result2`, JSON.stringify( result2, null, 2 ) );

            // let resultLogin = await CONQUER.AUTH.username( {
            //     username: "garibaldy.mukti@gmail.com",
            //     password: "1111"
            // } );
            // console.log( `resultLogin`, JSON.stringify( resultLogin, null, 2 ) );

            // let avatarIDs1 = ['id111', 'id112', 'id113', 'id114'];
            // let avatarIDs2 = ['id121', 'id112', 'id123', 'id114'];
            // let result1 = await DATA.set("test", { avatarIDs: avatarIDs1, name: "idA" });
            // console.log(`result1`, JSON.stringify(result1, null, 2));
            // let result2 = await DATA.set("test", { avatarIDs: avatarIDs2, name: "idB" });
            // console.log(`result2`, JSON.stringify(result2, null, 2));
            // let resultSearch = await DATA.get("test", { where: { avatarIDs: { $all: ['id001'], $size: 2 } } });
            // console.log(`resultSearch`, JSON.stringify(resultSearch, null, 2));
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
