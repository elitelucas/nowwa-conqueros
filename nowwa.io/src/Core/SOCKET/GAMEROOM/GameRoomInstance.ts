import DATA from "../../DATA/DATA";
import LOG, { log } from "../../../UTIL/LOG";
import TimerInstance from "../../../UTIL/Instances/TimerInstance";
import { STATUS, ACTIONS } from "../../../Models/ENUM";
import DATE from "../../../UTIL/DATE";
import AVATAR from "../../USER/TRIBE/AVATAR";
import SocketInstance from "../SocketInstance";
import ARRAY, { extract, pushUnique, push } from "../../../UTIL/ARRAY";

class GameRoomInstance
{
    
    constructor( vars:any )
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

        var self        = this;
        var roomName    = vars.roomName;
        var data        : any;
        var messagesCue : any = [];
        var socket      : SocketInstance = vars.socket;
        var players     : any = {};
        var minPlayers  : number = vars.minPlayers || 2;
        var maxPlayers  : number = vars.maxPlayers || 2;
        var extra       : any = vars.extra || [];
    
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
            sendTimer.stop(); 

            broadcast( STATUS.RESET );
        }
 
 
        /*=========================================
	
    


        JOINS / LEAVES
        
        


        ============================================*/
 
        function onJoin( avatarID:any )
        {
            self.getPlayer( avatarID ).then( function( player )
            {
                data.online[ avatarID ] = player;
                data.onlineCount ++;

                sendToUser( ACTIONS.GAMEDATA, null, avatarID, data );
            });
        }

        function onLeave( avatarID:any )
        {
            let user = data.online[ avatarID ];

            if( !user ) return;

            delete data.online[ avatarID ];

            data.onlineCount --;

            if( data.players.includes( user ) ) user.vars.isBot = true;
 
            broadcast( ACTIONS.PLAYERLEFT, avatarID, data );
            checkPlayersInSync();
        }
 
        /*=========================================




        SEND MESSAGES
        
        


        ============================================*/

        function broadcast( action:any, senderID?:any, data?:any )
        {
            messagesCue.push({ action:action, sender:senderID, data:data });
        }

        function sendToUser( action:any, senderID?:any, receiverID?:any, data?:any )
        {
            messagesCue.push({ action:action, senderID:senderID, receiverID:receiverID, data:data });
        }

        var sendTimer = new TimerInstance({ onUpdate:doSend, interval:300, autoStart:true });
 
        var sendObj : any = { tick:0 };

        function doSend()
        {
            if( !messagesCue.length ) return;
            
            sendObj.messages = messagesCue;

            // do send 

            sendObj.tick ++;
            messagesCue = [];
        }

 
        /*=========================================




        RECEIVE MESSAGES
        
        


        ============================================*/

        function onMessage( message:any )
        {
            for( var n in message.messages ) receiveMessage( message.messages[n] );
        }

        function receiveMessage( message:any )
        {
            var action = message.action;
            let player = players[ message.senderID ];

            if( message.vars ) extract( message.vars, player.vars );
  
            if( action == ACTIONS.SYNCREQUEST ) 
            {
                player.vars.sync = player.vars.sync || true;

                return checkPlayersInSync();
            }

            if( action == ACTIONS.PLAYERSTATUS )
            {
                checkPlayersStatus();
            }
 
            broadcast( message );
        }

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

        var countDownTimer = new TimerInstance({ onUpdate:onCountDownStep, onTimeUp:sendPlayersReady, interval:1000 });
 
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
  
            var bots : any = [];
            var botsAmount = minPlayers - players.length;

           // if( botsAmount ) bots = BOTS.get( botsAmount );
           // BOTS.get( amount).then(function(bots){ });

            push( bots, data.players );
 
            for( let n in data.players ) extract( data.extra[n], data.players[n].vars );
     
            sendStatus( STATUS.PLAYERSREADY );
        }

    }

    

 

    /*=========================================




    PLAYER
    
    


    ============================================*/

    private async getPlayer( avatarID:any ) : Promise<any>
    {
        let avatar = await AVATAR.get({ _id:avatarID });
        
        return Promise.resolve(
        {
            avatarID    : avatarID,
            userPhoto   : avatar.userPhoto,
            firstName   : avatar.firstName,
            vars        : { avatarID : avatarID }
        });
    }
};

export default GameRoomInstance;