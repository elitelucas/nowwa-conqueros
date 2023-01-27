import mongoose, { mongo } from "mongoose";
import CONQUER from "../../Conquer/CONQUER";
import DATA from "../DATA/DATA";
import FOLDER from "../ITEM/INSTANCE/FOLDER";
import ITEM from "../ITEM/ITEM";
import AUTH from "../USER/AUTH/AUTH";
import EMAIL from "../USER/EMAIL";
import AVATAR from "../USER/TRIBE/AVATAR";
import USERNAME from "../USER/USERNAME";
import ACCOUNT from "./ACCOUNT";
import TEMPORARY from "./TEMPORARY";
import LOG, { log } from "../../UTIL/LOG";
import RoomInstance from "../../Conquer/ROOMS/RoomInstance/RoomInstance";
import QUERY from "../../UTIL/QUERY";
import ROOM from "../SOCKET/ROOM/ROOM";
import path from "path";
import PlayCanvas from "../APPS/Playcanvas";

import NFT_COLLECTION from "../NFT/NFT_COLLECTION";
import { mint, getTotalSupply } from "../NFT/backend/mint";

class TEST {
  public static async Run(): Promise<void> {
    // TESTING
    try {
      // let authToken = "BGaSdbmMDrmQKVVkgNffpAsruFeVD8Oj";
      // let projectId = 873503;
      // let branchIds = [
      //   "123854c4-e2bc-4dee-8cf1-ee231a6d8887",
      //   "d66f4b35-015b-4784-bf8c-0128fb2ca2a3",
      //   "0a3cf614-b953-431f-a619-2900f394ca16"
      // ];
      // let appNames = [
      //   "Farm Kings FTUE",
      //   "Snappy Jump",
      //   "Snappy Run"
      // ];
      // let appVersion = "1.0.0";
      // let directory = "storage";

      // for (var i = 0; i < 1; i++) {
      //   await PlayCanvas.Archive(authToken, projectId, branchIds[i], appNames[i], appVersion, directory, true);
      // }
      /*
        J's testing

        email           avatarID                    usernameID
        aaa@gmail.com   63bd738d7d18ac60a60e4dd3    63bd738b7d18ac60a60e4dce
        bbb@gmail.com   63bd739d7d18ac60a60e4dee    63bd739d7d18ac60a60e4de9
     */
      console.log("testing...");
     // let myconquer = new CONQUER();
     // await myconquer.init();

     // let nftInstance = await myconquer.NFT.get();
     // let res;
      // res = await nftInstance.mint(2);
      // res = await nftInstance.getTokens();
      // res = await nftInstance.getTokens('63bd738d7d18ac60a60e4dd3');
     // console.log(res);

      // let tokenInstance = await nftInstance.getToken(11);
      // res = await tokenInstance.History.get();
      // console.log(res)

      // let ddd = await getTotalSupply();
      // console.log(ddd)

      // console.log("test send email");
      // EMAIL.send({
      //   email: 'garibaldy.mukti@gmail.com',
      //   subject: 'Subscribe to SuperSnappy.io',
      //   html: `Welcome! <img src="cid:badge" />`,
      //   attachments: [{
      //     filename: "SUPERSNAPPY_LOGO_email.png",
      //     path: path.resolve("storage", "SUPERSNAPPY_LOGO_email.png"),
      //     cid: 'badge' //same cid value as in the html img src,
      //   }]
      // });

      //   let res = await ROOM.getOne({
      //     avatarIDs: ["63ac6c5a34bba89538a2fde6"],
      //     avatarID: "63ac6c2534bba89538a2fdd4",
      //   });
      //   console.log(res);

       // login as guest
      let conquer1 = new CONQUER('user001');
      await conquer1.init();    
      await conquer1.Auth.guest(); 

      // login as some user (make sure this user is already registered)
     let conquer2 = new CONQUER();
     await conquer2.init();    
     await conquer2.Auth.get({
      username: 'com@com.com',
      password: 'comcomcom'
     }); 

      log( `conquer1\n` + JSON.stringify(conquer1.User, null, 2) );
      log( `conquer2\n` + JSON.stringify(conquer2.User, null, 2) );

      /*
           

            let conquer2 = new CONQUER('user002');
 
            let gameInstance = await conquer1.Games.getOne("Bowling");

            log("GAME INSTANCE", gameInstance );


           // await conquer2.init();
           // log(conquer1.User.avatarID,'===========VS=============', conquer2.User.avatarID );

 
            /*
            var list2 = await conquer2.Friends.get();
            var myFriendship = list2[0];
            myFriendship.remove();

            log("FRIEND REMOVED ")

            var list = await conquer1.Friends.get();    
            var list2 = await conquer2.Friends.get();
            log("GOT FRIENDS LIST USER1", list );
            log("GOT FRIENDS LIST USER2", list2 );
            */

      /*
            //////================= FRIENDS

            //var newfriend = await conquer1.Friends.set( "6392e07491358963557a2d92" );

            var list = await conquer1.Friends.get();    
            var list2 = await conquer2.Friends.get();
            log("GOT FRIENDS LIST USER1", list );
            log("GOT FRIENDS LIST USER2", list2 );

            var myFriendship = list2[0];

            log( myFriendship );

           // myFriendship.set();
           */

      /*
            log('==========================');
 
            let room1 : RoomInstance = await conquer1.Rooms.getOne( [ conquer2.User.avatarID ] );
            let room2 : RoomInstance = await conquer2.Rooms.getOne( [ conquer1.User.avatarID ] );
 
            room1.onMessage = function( message:any )
            {
                log("ROOM 1 GOT MESSAGE", message );
            }

            room2.onMessage = function( message:any )
            {
                log("ROOM 2 GOT MESSAGE", message );
            }
    
            room1.join();
            room2.join();
 
            room1.entry( "Hello Im am USER 1")
            room2.entry( "Hello and Im USER 2!")
            */
    } catch (error) {
      console.log(error);
    }

    return Promise.resolve();
  }

  public static async Fun(w: string) {}
}

namespace TEST {}

export default TEST;
