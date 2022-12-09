import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import TimerInstance from "../../../UTIL/Instances/TimerInstance";
import { STATUS, ACTIONS } from "../../../Models/ENUM";
import DATE from "../../../UTIL/DATE";
import AVATAR from "../../USER/TRIBE/AVATAR";
import SocketInstance from "../../SOCKET/SocketInstance";
import ARRAY, { extract, pushUnique, push } from "../../../UTIL/ARRAY";
import GameRoomBotsInstance from "./GameRoomBotsInstance";
import SOCKET from "../../SOCKET/SOCKET";
import ROOM_ENTRIES from "../../SOCKET/ROOM/ROOM_ENTRIES";


class GameRoomInstance
{
    public onMessage : Function;

    constructor( params:any )
    {
        /*=========================================
	
    


        INIT
        
        {
            roomName
            socket?
            minPlayers
            maxPlayers
            extra:[]
        }


        ============================================*/

        var self                = this;
        var roomID              = params.roomID;
        var data                : any;
        var messagesCue         : any = [];
        var players             : any = {};
        var minPlayers          : number = params.minPlayers || 2;
        var maxPlayers          : number = params.maxPlayers || 2;
        var extra               : any = params.extra || [];
        var RoomBots            : GameRoomBotsInstance;
        var countDownTimer      : TimerInstance = new TimerInstance({ onUpdate:onCountDownStep, onTimeUp:sendPlayersReady, interval:1000 });
    
        log( "NEW GAME ROOM INSTANCE", roomID );

        reset();
 
        function reset()
        {
            data = 
            {
                status 			: STATUS.LOBBY,
                online 			: {},
                players 		: [],
                extra 		 	: extra,
                onlineCount     : 0,
                sessionStamp 	: DATE.now() 
            };

            countDownTimer.stop();

            broadcast( STATUS.RESET );
        }
 

        /*=========================================




        SEND MESSAGES
        
        


        ============================================*/

        function broadcast( action:any, avatarID?:any, data?:any )
        {
            messagesCue.push({ action:action, avatarID:avatarID, data:data, roomID:roomID });
        }

        function sendToUser( action:any, avatarID?:any, receiverID?:any, data?:any )
        {
            messagesCue.push({ action:action, avatarID:avatarID, receiverID:receiverID, data:data, roomID:roomID });
        }

        var sendTimer = new TimerInstance({ onUpdate:doSend, interval:300, autoStart:true });
 
        var sendObj : any = { tick:0 };

        function doSend()
        {
            if( !messagesCue.length ) return;
            sendObj.messages = messagesCue;
 
            SOCKET.io.to( roomID ).emit( "message", sendObj );
  
            sendObj.tick ++;
            messagesCue = [];
        }

 
        /*=========================================






        ON MESSAGE
        
  



        ============================================*/
 
        function onMessage( message:any )
        {
            log("GAMEROOM ON MESSAGE", message );

            var action          = message.action;
            let avatarID        = message.avatarID;
            let messageData     = message.data;
   
            if( action == ACTIONS.PLAYERJOIN )
            {
                let player  = extract( messageData );
                player.vars = { avatarID:avatarID };

                data.online[ avatarID ] = player;
                data.onlineCount ++;

                log("PLAYER JOIN", data );

                sendToUser( ACTIONS.GAMEDATA, null, avatarID, data ); 

                return reBroadcast( player );
            }
 
            if( action == ACTIONS.PLAYERLEFT )
            {
                let player = data.online[ avatarID ];

                if( !player ) return;

                delete data.online[ avatarID ];
                data.onlineCount --;

                if( data.players.includes( player ) ) player.vars.isBot = true;
    
                reBroadcast( data );
                checkPlayersInSync();
           
                return;
            }

            let player = data.online[ avatarID ];

            if( action == ACTIONS.PLAYERVARS )
            {
                extract( messageData, player.vars );
                return reBroadcast();
            }
 
            if( action == ACTIONS.PLAYERSTATUS )
            {
                player.vars.status = messageData;
                reBroadcast();
                return checkPlayersStatus();
            }
  
            if( action == ACTIONS.SYNCREQUEST ) 
            {
                player.vars.sync = player.vars.sync || true;
                return checkPlayersInSync();
            }

            if( action == ACTIONS.ENTRY )
            {
                ROOM_ENTRIES.set({ where:{ roomID:roomID }, values:{ text:messageData, avatarID:avatarID } });
            }

            /*=========== 

            DEFAULT, REBROADCAST MESSAGE TO ALL USERS

            ============*/

            return reBroadcast();

            function reBroadcast( myData?:any )
            {
                broadcast( action, avatarID, myData || messageData );
            }
       
        }

        this.onMessage = onMessage;

        function checkPlayersInSync()
        {
            for( let n in data.players ) if( !data.players[n].vars.isBot && !data.players[n].vars.sync ) return;
            for( let n in data.players ) delete data.players[n].vars.sync;

            broadcast( ACTIONS.INSYNC );
        };

        /*=========================================




        LOBBY
        
        


        ============================================*/

        // COUNTDOWN
 
        function onCountDownStep( timer:TimerInstance )
        {
            broadcast( ACTIONS.SECOND, null, { remaining:timer.remaining } ); 
        }

        // PLAYER STATUS

        function checkPlayersStatus()
        {
            var status 			= data.status;
            var count : any     = { Ready:0, Playing:0, Rewarded:0, GameOver:0 };
            var n;
     
            for( n in data.online ) 
            {
                var sta = data.online[n].vars.status;
                if( !count[sta] ) count[sta] = 0;
                count[sta] ++;
            }
 
            if( status == STATUS.LOBBY )
            {
                if( count.Rewarded ) return sendStatus( STATUS.WAITING );

                if( count.Ready == 1 && data.onlineCount == 1 ) return sendPlayersReady();

                if( count.Ready >= minPlayers || count.Ready >= data.onlineCount )
                {
                    data.status = null;
                    sendStatus( STATUS.COUNTDOWN ); 
                    countDownTimer.start({ seconds:10 });
                    return;
                }

                return;
            }

            if( status == STATUS.WAITING ) 
            {
                if( !count.Rewarded ) return sendStatus( STATUS.LOBBY );
                return;
            }

            if( status == STATUS.COUNTDOWN )
            {
                if( count.Rewarded ) return sendStatus( STATUS.WAITING );
                if( count.Ready < minPlayers ) return sendStatus( STATUS.LOBBY );
                return;
            }

            if( status == STATUS.PLAYERSREADY )
            {
                // waiting for everyone to be Playing, so if anyone is still in Ready, wait
                if( count.Ready ) return;
                return sendStatus( STATUS.PLAYING );
            }

            if( status == STATUS.PLAYING )
            {
                if( count.GameOver ) return sendStatus( STATUS.GAMEOVER );

                if( !count.Playing )
                {
                    if( count.Rewarded ) return sendStatus( STATUS.WAITING );
                    return sendStatus( STATUS.LOBBY );
                }
                return;
            }

            if( status == STATUS.GAMEOVER )
            {
                if( count.GameOver ) return;
                if( count.Rewarded ) return sendStatus( STATUS.WAITING );
                return sendStatus( STATUS.LOBBY );
            }
        }

        // SEND STATUS

        function sendStatus( status:any )
        {
            if( status === data.status ) return;

            countDownTimer.stop();
  
            data.status = status;
 
            broadcast( ACTIONS.STATUS, null, data );
        }

        // PLAYERS READY

        function sendPlayersReady()
        {
            let player;
     
            for( let avatarID in data.online )
            {
                player = data.online[ avatarID ];

                if( player.vars.status != "Ready" || data.players.length >= maxPlayers ) continue;
                
                data.players.push( player );
            }

            let botsAmount = minPlayers - players.length;

            if( botsAmount )
            {
                if( !RoomBots ) RoomBots = new GameRoomBotsInstance();
                push( RoomBots.get( botsAmount ), data.players );
            }
 
            for( let n in data.players ) extract( data.extra[n], data.players[n].vars );
     
            sendStatus( STATUS.PLAYERSREADY );
        }

    }
 
};

export default GameRoomInstance;