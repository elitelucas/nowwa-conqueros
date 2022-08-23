import * as E from "./Enums";

export type Tile = { // interface of a Tile object
    type: E.TileType; // type of this tile
    value: number; // coin value of this tile, only for 'Normal' or 'Start' type
    assetId: string; // asset id of the tile, used as reference for asset used for this tile
}

export type Wealth = { 
    type: E.CurrencyType; // type of currency used
    amount: number; // value of the currency needed
}

export type Board = {
     [key: string]: (string|number)[];
}

export type Avatar = {
    name: string; // name of the avatar
    assetId: string; // asset id of the tile, used as reference for asset used for this tile
    unlocks: Wealth[]; // cost of unlocking the avatar
}

export type ActiveFriendCounts = {
    playerFriendCount: number;
    activeFriendCount1D: number;
    activeFriendCount3D: number;
    activeFriendCount7D: number;
    activeFriendCount14D: number;
    activeFriendCount30D: number;
    activeFriendCount90D: number;
};

export type FirstEntryUserProperties = {
    firstEntryActiveFriendCount1D: number;
    firstEntryActiveFriendCount3D: number;
    firstEntryActiveFriendCount7D: number;
    firstEntryActiveFriendCount14D: number;
    firstEntryActiveFriendCount30D: number;
    firstEntryActiveFriendCount90D: number;

    "firstEntryActiveFriendRatio1/3":number | undefined;
    "firstEntryActiveFriendRatio1/7":number | undefined;
    "firstEntryActiveFriendRatio3/7":number | undefined;
    "firstEntryActiveFriendRatio7/30":number | undefined;
      
    firstEntrySourceRealtimeActiveFriendCount1D:number | null;
    firstEntrySourceRealtimeActiveFriendCount3D:number | null;
    firstEntrySourceRealtimeActiveFriendCount7D:number | null;
    firstEntrySourceRealtimeActiveFriendCount14D:number | null;
    firstEntrySourceRealtimeActiveFriendCount30D:number | null;
    firstEntrySourceRealtimeActiveFriendCount90D:number | null;

    firstEntrySourceRealtimeLevelRange: string;

    firstEntryLevelRange: string;

    firstEntryTournamentActiveCount: number;
    firstEntryTournamentFriendCount: number;
    firstEntryTournamentPlayerCount: number;
    firstEntryTournamentElapsedHours: number;
}
export type LastEntryUserProperties = {
    lastEntryActiveFriendCount1D: number;
    lastEntryActiveFriendCount3D: number;
    lastEntryActiveFriendCount7D: number;
    lastEntryActiveFriendCount14D: number;
    lastEntryActiveFriendCount30D: number;
    lastEntryActiveFriendCount90D: number;

    "lastEntryActiveFriendRatio1/3":number | undefined;
    "lastEntryActiveFriendRatio1/7":number | undefined;
    "lastEntryActiveFriendRatio3/7":number | undefined;
    "lastEntryActiveFriendRatio7/30":number | undefined;
      
    lastEntrySourceRealtimeActiveFriendCount1D:number | null;
    lastEntrySourceRealtimeActiveFriendCount3D:number | null;
    lastEntrySourceRealtimeActiveFriendCount7D:number | null;
    lastEntrySourceRealtimeActiveFriendCount14D:number | null;
    lastEntrySourceRealtimeActiveFriendCount30D:number | null;
    lastEntrySourceRealtimeActiveFriendCount90D:number | null;

    lastEntrySourceRealtimeLevelRange: string;
    
    lastEntryLevelRange: string;

    // TO DO : implement in game

    lastEntryFrenzyCompleted: number;
    lastEntrySessionMaturityRange: number;
    lastEntryIsPurchaser:boolean;
    lastEntryPurchaseDaysElapsed: number;
    lastEntryLTV: number;

    lastEntryTournamentActiveCount: number;
    lastEntryTournamentFriendCount: number;
    lastEntryTournamentPlayerCount: number;
    lastEntryTournamentElapsedHours: number;
}

const tuple = <T extends string[]>(...args: T) => args;
export const AssetNames = tuple("test");
export type AssetTypes = typeof AssetNames[number];
export type AssetList = {[A in AssetTypes]:string}

export type ABTest = {
    active: boolean;
    buckets: ({ id: string })[];
    default: string;
    newPlayersOnly?: boolean;
    assignManually?: boolean;
}

export type Profile = {
    userID: string, 
    userName: string,
    userPhoto: string,
}

export type Revenue = {
    revenueType: 'in_app_purchase' | 'rewarded_video';
    revenueGross: number;
    productID: string | 'rewarded_video';
    feature: string;
    $subFeature: string;
}

export type TrackFirstSpinOccasion =
  | 'sessionStart' // First spin of the session
  | 'postTutorial' // First spin after tutorial
  | 'postLevelUp' // First spin after Levelling up
  | 'postOffense' // First spin after any attack/raid
  | 'postUpgrade'; // First spin after any upgrade;

export type GlobalTournamentEntry = {
    score: number,
    userID: string, 
    userName: string,
    userPhoto: string,
    skinID: string,
}

export type GlobalTournament = {
    chestsCollected: number;
    collected: boolean;
    contextId: string;
    endTime: number;
    createTime:number;
    leaderboard: GlobalTournamentEntry[];
}

export type Farm = {
    votes: number;
    values: number[];
}

export type Challenge = {
    sender: Profile,
    receiver?: Profile,
    turn?: string,
    data: any[],
    finished: boolean
}

export type LeaderboardEntry = {
    rank: number,
    score: number,
    timestamp: number,
    profile: {
        userName: string,
        userID: string,
        userPhoto: string,
    }
}