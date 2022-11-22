import mongoose from "mongoose";
import CONQUER from "../../Frontend/CONQUER";
import DATA from "../DATA/DATA";
import EMAIL from "../USER/EMAIL";
import USERNAME from "../USER/USERNAME";
import ACCOUNT from "./ACCOUNT";
import TEMPORARY from "./TEMPORARY";

class TEST {
    
    public static async Run () :Promise<void> {

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
            // let uID = await EMAIL.getUID2(
            //     {
            //         email: "garibaldy.mukti@gmail.coms"
            //     }
            // );
            // console.log(`uID`, uID);
            // let user = await USERNAME.get2(
            //     {
            //         _id: new mongoose.Types.ObjectId(uID)
            //     }
            // );
            // console.log(`user`, JSON.stringify(user, null, 2));

            //#endregion "OLD TEST"

            await CONQUER.init();

            let result = await CONQUER.AUTH.username({
                username: "garibaldy.mukti@gmail.com",
                password: "1111"
            });
            console.log(`result`, JSON.stringify(result, null, 2));
        }
        catch (error) {
            console.log(error);
        }

        return Promise.resolve();
    }
}

namespace TEST {

}

export default TEST;
