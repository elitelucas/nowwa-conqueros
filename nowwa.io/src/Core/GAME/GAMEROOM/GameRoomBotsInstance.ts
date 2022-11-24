 
import ARRAY from "../../../UTIL/ARRAY";
import Cue from "../../../UTIL/Instances/Cue";

class GameRoomBotsInstance
{
    public get : any;
 
    private data : any = 
    {
        "male":
        {
            "names" 	    : "Fraser,David,Freddie,Brad,Sabrina,Louis,Cory,Arthur,Roosevelt,Aidan,Jackson,Adrian,Chad,Lucas,Roy,Ben,Reuben,Cray,Floyd,Abdul,Lorenzo,Howell,Joss,Sam,Emery,Cody,Remi,Joseph",
            "userPhotos" 	: "99356705814_1-s5,99356711829_1-s5,99356717890_1-s5,99356731910_1-s5,99356738312_1-s5,409171329_5-s5,99356767464_1-s5,459343272_6-s5,459355479_2-s5,99356805796_1-s5,99356812796_1-s5,99356884408_2-s5,99356904156_1-s5,99356921707_1-s5,99019383502_2-s5,99356949851_1-s5,99357449817_1-s5,99012673211_2-s5,99012729091_3-s5,99012745931_3-s5,99013138972_2-s5,99013151089_2-s5,99013158129_2-s5,99174308155_3-s5,99174325074_1-s5,99190045666_1-s5,99174314246_1-s5,99190059330_1-s5"
        },
    
        "female":
        {
            "names" 	    : "Verity,Courtney,Patricia,Maryam,Georgina,Karli,Mabel,Anita,Gloria,Violet,Lisa,Gertrude,Kathy,Maria,Inaya,Amber,Chloe,Alana,Martha,Bonnie,Tilly,Anisa,Alex,Ari,Sarah,Frankie,River",
            "userPhotos" 	: "400322427_4-s5,99356760721_1-s5,99019380966_2-s5,459349672_9-s5,459353138_5-s5,99356789747_1-s5,466905862_6-s5,470259950_2-s5,475282831_6-s5,475305570_4-s5,505204198_5-s5,99356935557_1-s5,533332447_5-s5,99356941871_1-s5,99356957254_1-s5,545502754_2-s5,547494323_2-s5,569580064_2-s5,99357459862_1-s5,99012653844_3-s5,99012675924_3-s5,99013136342_2-s5,99174311991_1-s5,99190050552_1-s5,99174303325_1-s5,99174328357_1-s5,99190055890_2-s5"
        }
    };

    constructor()
    {
        var self                = this;
        var cue 			    = new Cue( true );
        var bots                = [];

        for( let gender in this.data )
        {
            let names           = self.data[ gender ].names.split(",");
            let userPhotos      = self.data[ gender ].userPhotos.split(",");

            for( let n in names )
            {
                bots.push(
                { 
                    firstName   : names[n], 
                    userPhoto   : userPhotos[n],
                    avatarID    : "Bot"+ gender + n,
                    isBot       : true 
                })
            }

            bots = ARRAY.shuffle( bots );

            cue.copy( bots );
        }
 
        function getAvoid( avoids:any ) : any
        {
            var player = cue.get();
            if( avoids.indexOf( player ) != -1 ) return getAvoid( avoids ); 
            return player;
        }
    
        self.get = function( amount:number=1 )
        {   
            var output : any 	= [];
     
            for( var n =0; n< amount; n++ ) output.unshift( getAvoid( output ) );
     
            return amount == 1 ? output[0] : output;
        };
 
    }
}

export default GameRoomBotsInstance;