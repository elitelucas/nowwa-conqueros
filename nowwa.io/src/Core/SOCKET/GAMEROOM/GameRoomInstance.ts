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
                sessionStamp 	: DATE.now() 
            };

            countDownTimer.stop();
            sendTimer.stop(); 

            broadcast( STATUS.RESET );
        }
 
        /*=========================================
	
    


        TIMER
        
        


        ============================================*/

        var countDownTimer = new TimerInstance({ onUpdate:onCountDownStep, onTimeUp:onCountDownFinish, interval:1000 });
 
        function onCountDownStep( timer:TimerInstance )
        {
            broadcast( ACTIONS.SECOND, "Server", { remaining:timer.remaining } ); 
        }

        function onCountDownFinish( timer:TimerInstance )
        {
            sendPlayersReady();	
        }
 

        /*=========================================
	
    


        JOINS / LEAVES
        
        


        ============================================*/
 
        function onJoin( avatarID:any )
        {
            self.getPlayer( avatarID ).then( function( player )
            {
                data.online[ avatarID ] = player;

                sendToUser( ACTIONS.GAMEDATA, null, avatarID, data );
            });
        }

        function onLeave( avatarID:any )
        {
            let user = data.online[ avatarID ];
            delete data.online[ avatarID ];

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

        function sendStatus( status:any )
        {
            if( status === data.status ) return;

            countDownTimer.stop();
  
            data.status = status;
 
            broadcast( ACTIONS.STATUS, null, data );
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




        PLAYER STATUS
        
        


        ============================================*/

        function checkPlayersStatus()
        {
            var status 			= data.status;
            var count : any     = { Ready:0, Playing:0, Rewarded:0, GameOver:0 };
            var n;
    
            var ready 			= [];
     
            for( n in data.online ) 
            {
                var sta = data.online[n].vars.status;
                if( !count[sta] ) count[sta] = 0;
                count[sta] ++;
            }
 
            if( status == STATUS.LOBBY )
            {
                // if people watch a Rewarded ad, set to WAITING
                // if enough people are ready, start COUNTDOWN

            }

            if( status == STATUS.WAITING )
            {
                // if people are not watching ads anymore, back to LOBBY
   
            }

            if( status == STATUS.COUNTDOWN )
            {
                // if people watch a Rewarded ad, set to WAITING
                // if not enough people are ready, go back to LOBBY

            }

            if( status == STATUS.PLAYERSREADY )
            {
                // waiting for everyone to be Playing, so if anyone is still in Ready, wait (should be a sync?)
                
            }

            if( status == STATUS.PLAYING )
            {
                // if someone finished the game, switch to GAMEOVER (eg. nobody can come expectate now)
                
            }

            if( status == STATUS.GAMEOVER )
            {
                // if nobody is in GameOver or Playing, switch to LOBBY
                
            }
 





            // WAIT WHILE SOMEONE WATCHES AN AD
    
            if(( status == STATUS.LOBBY || status == STATUS.COUNTDOWN ) && count.Rewarded ) return sendStatus( STATUS.WAITING );
    
            // WHEN AD IS FINISHED
    
            if( status == STATUS.WAITING )
            {	
                if( count.Rewarded ) return;
                if( !count.Ready ) return sendStatus( STATUS.LOBBY );

                status = STATUS.LOBBY;
            }
    
            // READY TO START
    
            if( status == STATUS.LOBBY )
            {	
                if( !count.Ready ) return;
                if( count.Ready >= minPlayers || count.Ready >= data.online.length ) return sendPlayersReady();
    
                // start countdown

                data.status = null;
                sendStatus( STATUS.COUNTDOWN ); 
                countDownTimer.start({ seconds:10 });
                return;
            }
    
            if( status == STATUS.COUNTDOWN )
            {
                if( count.Ready < minPlayers ) sendStatus( STATUS.LOBBY );
                return;
            }
    
            // PLAY
    
            if( status == STATUS.PLAYERSREADY )
            {
                if( count.Ready ) return;
                return sendStatus( STATUS.PLAYING );
            }
    
            // END GAME
    
            if( status == STATUS.PLAYING )
            {
                if( count.GameOver )	return sendStatus( STATUS.GAMEOVER );
                if( !count.Playing )	return sendStatus( STATUS.LOBBY );
            }
     
            // CAN RESTART GAME
    
            if( status == STATUS.GAMEOVER )
            {
                //log("STATUS IS GAMEOVER", count, count.GameOver );
                if( !count.GameOver ) 
                {
                    //log("SHOULD SEND STATUS LOBBY" );
                    return sendStatus( STATUS.LOBBY ); //|| !count.Playing
                }
            }
        }
    
 
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