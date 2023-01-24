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

import NFT_COLLECTION from "../NFT/NFT_COLLECTION";

class TEST {
  public static async Run(): Promise<void> {
    // TESTING
    try {
      /*
        J's testing

        email           avatarID
        aaa@gmail.com   63ac6c2534bba89538a2fdd4
        bbb@gmail.com   63ac6c5a34bba89538a2fde6
     */
      console.log("J's testing...");
      let myconquer = new CONQUER();
      await myconquer.init();

      let nftInstance = await myconquer.NFT.get();
      // let res = await nftInstance.mint(2);
      // console.log(res);

      // let result = await NFT_COLLECTION.get();
      // console.log(result)

      // await NFT_COLLECTION.set({
      //   address: "0xE74da0A4E7C5FC09fa793498ccE70e598D8432b2",
      //   chainID: 5,
      //   name: "NOWNFT",
      //   symbol: "NN",
      //   totalSupply: 28,
      //   mintPrice: 0.07,
      // });

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

      /*
            let conquer1 = new CONQUER('user001');
            await conquer1.init();    

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
