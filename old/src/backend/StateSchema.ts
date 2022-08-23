import * as R from "@play-co/replicant";
import { extendStateSchemaForAnalytics } from '@play-co/gcinstant-replicant-extensions';

export default extendStateSchemaForAnalytics(R.SB.object({

  isInitialized: R.SB.boolean(),

  version: R.SB.number(),

  currency: R.SB.object({ // currencies used in the game
    gems: R.SB.number().default(0).min(0), // current player's gems
    coins: R.SB.number().default(0).min(0), // current player's coins
  }),

  ftue: R.SB.number(), // indicates steps for first time user experience

  maxLevel: R.SB.number().min(0), // current max level

  lastLogin: R.SB.number().min(0), // indicates the date of player's last login timestamp
  lastDailyRewardDate: R.SB.number().default(0), // indicates the date of a daily reward that has been claimed previously (in timestamp milliseconds)

  profile: R.SB.object({
    userName: R.SB.string(),
    userPhoto: R.SB.string(),
    userID: R.SB.string(),
    skinID: R.SB.string(),
  }),

  dump: R.SB.string(),
  dumpData: R.SB.map(R.SB.unknown()).default({}),

  analytics: R.SB.object({
    playerFriendCount: R.SB.number(),
    activeFriendCount1D: R.SB.number(),
    activeFriendCount3D: R.SB.number(),
    activeFriendCount7D: R.SB.number(),
    activeFriendCount14D: R.SB.number(),
    activeFriendCount30D: R.SB.number(),
    activeFriendCount90D: R.SB.number(),
  }),

  /*
  tournaments: R.SB.map(R.SB.object({
    chestsCollected: R.SB.number(),
    collected: R.SB.boolean(),
    createTime: R.SB.number().min(0),
    endTime: R.SB.number().min(0),
    score: R.SB.number().min(1),
  })),
  */
  tournamentsV2: R.SB.map(R.SB.object({
    endTime: R.SB.number().min(0),
    createTime: R.SB.number().min(0),
  })).default({}),

  maxScores: R.SB.object({
    allTime: R.SB.number().default(0),
    weekly: R.SB.number().default(0),
    daily: R.SB.number().default(0),
    weeklyID: R.SB.string().default(""),
    dailyID: R.SB.string().default("")
  }),

  farm: R.SB.object({
    votes: R.SB.number(),
    values: R.SB.array(R.SB.number()).default([0,0,0,0,0])
  }),

  inbox: R.SB.object({ 
    
    attacks: R.SB.map(R.SB.object({ // attacks sent by the other players, timestamp is the id
      userName: R.SB.string(),
      userPhoto: R.SB.string(),
      userID: R.SB.string(),
      timestamp: R.SB.number(), // indicates when the attack occured
      stolenCoins: R.SB.number(), // indicates amount of coins stolen
      isResolved: R.SB.boolean(), // indicates whether the attack is resolved already,
      defended: R.SB.boolean(), // indicates whether the defender has shield
    })).default({}),

  }),
  
  // #region MESSAGES ///

  messages: R.SB.map(R.SB.map(R.SB.object({ // messages sent by the other players, type (string) is the first mapping, timestamp (as string) is the second mapping
    timestamp: R.SB.number(), // indicates when the message was received
    userName: R.SB.string(),
    userPhoto: R.SB.string(),
    userID: R.SB.string(),
    status: R.SB.string(),
    content: R.SB.unknown(),
  }))).default({}), 

  // #endregion MESSAGES ///
  
  // #region CHALLENGES ///

  challenges: R.SB.map(R.SB.object({ // challenges sent by the other players, timestamp (as string) is the id
    status: R.SB.string(),
  })).default({}),

  // #endregion CHALLENGES ///
  
  // #region INVITES ///

  invites: R.SB.map(R.SB.object({ // challenges sent by the other players, timestamp (as string) is the id
      userName: R.SB.string(),
      userPhoto: R.SB.string(),
      userID: R.SB.string(),
      isDone: R.SB.boolean(),
  })).default({}),

  // #endregion CHALLENGES ///

}));


