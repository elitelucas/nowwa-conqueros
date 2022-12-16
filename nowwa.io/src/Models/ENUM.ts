export const enum ACTIONS
{
    MESSAGE                 = 0,
    GAMEDATA 		        = 1,
    PLAYERJOIN 		        = 2,
    PLAYERLEFT 		        = 3,
    PLAYERVARS 		        = 4,
    SYNCREQUEST 	        = 5,
    GAMESTART 		        = 6,
    ROOMREADY 		        = 7,
    STATUS 			        = 8,
    PLAYERSTATUS 	        = 9,
    SECOND 			        = 10,
    TIMER 			        = 11,
    LOADING 		        = 12,
    PLAYERSTATE		        = 13,
    INSYNC		            = 14,
    ENTRY                   = 15,
    CALL                    = 16,
    ACCEPT_CALL             = 17,
    REJECT_CALL             = 18,

    AUTH_SET                = 19,
    AUTH_GET                = 20,
    FILE_SET                = 21,
    FILE_GET                = 22,

    ROOM_GET                = 23,
    ROOM_GETONE             = 24,

    ROOM_ENTRIES_GET        = 25,
    ROOM_ENTRIES_SET        = 26,
    ROOM_ENTRIES_CHANGE     = 27,
    ROOM_ENTRIES_REMOVE     = 28,

    FRIENDS_GET             = 29,
    FRIENDS_SET             = 30,
    FRIENDS_CHANGE          = 31,
    FRIENDS_REMOVE          = 32,

    CHAT                    = 33,

    ANALYTICS_SET           = 34,
    ANALYTICS_GET           = 35,

    FOLLOWERS_GET           = 36,
    FOLLOWERS_SET           = 37,
    FOLLOWERS_REMOVE        = 38,

    GAME_GETONE             = 39,
 
    GAMEDATA_GET            = 43,
    GAMEDATA_SET            = 44,

    GAMESCORE_SET               = 45,
    GAMESCORE_GET               = 46,
    GAMESCORE_GETALLTIME        = 47,
    GAMESCORE_GETTODAY          = 48,
    GAMESCORE_GETFRIENDSALLTIME = 49,
    GAMESCORE_GETFRIENDSTODAY   = 50,
 
    MATCHMAKING             = 51,
    TOURNAMENT_GET          = 52,
    TOURNAMENT_ENTRIES_GET  = 53,

    GAMETURN_SET            = 54,
    GAMETURN_GET            = 55,
    GAMETURN_GETONE         = 56,
    GAMETURN_CHANGE         = 57,

    GAME_SHOPTAB_GET            = 58,
    GAME_SHOPITEM_GET           = 59,

    GAME_PLAYERINVENTORY_BUY    = 60,
    GAME_PLAYERINVENTORY_GET    = 61,
    GAME_PLAYERINVENTORY_CHANGE = 62,
    GAME_PLAYERINVENTORY_REMOVE = 63,

    GAME_CURRENCY_GET       = 64,
    GAME_CURRENCY_GETONE    = 65,
    GAME_CURRENCY_CHANGE    = 66

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