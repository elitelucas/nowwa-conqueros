export const enum ACTIONS
{
    MESSAGE         = 0,
    GAMEDATA 		= 1,
    PLAYERJOIN 		= 2,
    PLAYERLEFT 		= 3,
    PLAYERVARS 		= 4,
    SYNCREQUEST 	= 5,
    GAMESTART 		= 6,
    ROOMREADY 		= 7,
    STATUS 			= 8,
    PLAYERSTATUS 	= 9,
    SECOND 			= 10,
    TIMER 			= 11,
    LOADING 		= 12,
    PLAYERSTATE		= 13,
    INSYNC		    = 14
}

export const enum STATUS
{
    LOBBY 			= 0,
	WAITING 		= 1,
	COUNTDOWN 		= 2,
	PLAYING 		= 3,
	GAMEOVER 		= 4,
	PLAYERSREADY 	= 5,
    RESET           = 6
}