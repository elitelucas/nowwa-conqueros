import * as R from "@play-co/replicant";
import * as E from "./Enums";
import * as X from "./Errors";
import * as I from "./Types";
import stateSchema from "./StateSchema";
import Game from "./Game"; 
import config from "./Config"; 
import messages from './Messages';

type ReplicantAPI = R.ReplicantUtilAPI< R.Replicant<{messages: typeof messages }>>;

export function hasOwnProperty<X extends {}, Y extends PropertyKey>
    (obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop)
}

export function getNowTimestamp(nowMS:number):number {
    return nowMS;
}

export function getDateString(date_ob:Date):string {
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // prints date in YYYY-MM-DD format
    return `${date}-${month}-${year}`;
}

export function resetData (state:R.SB.ExtractType<typeof stateSchema>, nowMS:number) {
    state.ftue = 0;
    state.maxLevel = 1;
    var defaultFarm:I.Farm = {
        values: [0,0,0,0,0],
        votes: 0
    };
    state.farm = defaultFarm;
    state.dumpData = {};
    state.dump = "";
    state.currency = {
        coins : 0,
        gems : 0
    };
    state.inbox = {
        attacks : {}
    };
    state.invites = {};
    state.maxScores = {
        allTime : 0,
        daily : 0,
        dailyID : "",
        weekly : 0,
        weeklyID : ""
    };
    state.messages = {};
    state.tournamentsV2 = {};
    state.challenges = {};
    state.isInitialized = true;
}

/////// ANALYTICS : BEGIN ///////

export function duration (args: { days?:number, hours?: number, minutes?:number, second?:number }):number {
    let output:any = 
        (args.days || 0) * 1000 * 3600 * 24 +
        (args.hours || 0) * 1000 * 3600 +
        (args.minutes || 0) * 1000 * 60 +
        (args.second || 0) * 1000;
    return output;
}

export function calculateActiveFriendCounts(
    states: { [id: string]: { lastUpdated: number } },
    friendIds: readonly string[],
    now: number
    ): I.ActiveFriendCounts {
    function activeFriendCount(days: number) {
      return friendIds.filter((id) => {
        return states[id] && now - states[id].lastUpdated < duration({ days });
      }).length;
    }
  
    return {
        playerFriendCount: friendIds.length,
        activeFriendCount1D: activeFriendCount(1),
        activeFriendCount3D: activeFriendCount(3),
        activeFriendCount7D: activeFriendCount(7),
        activeFriendCount14D: activeFriendCount(14),
        activeFriendCount30D: activeFriendCount(30),
        activeFriendCount90D: activeFriendCount(90),
    };

}

export function getRatio(numerator: number, denominator: number): number | undefined {
    const ratio = numerator / denominator;
    return Number.isFinite(ratio) ? ratio : undefined;
}

export function getLevelRange (level:number) {
    const levelRanges = [
        { max: 1, name: '1 new' },
        { max: 2, name: '2 posttutorial' },
        { max: 3, name: '3 early' },
        { max: 7, name: '4 intermediate' },
        { max: 12, name: '5 advanced' },
        { max: 20, name: '6 late' },
        { max: 30, name: '7 power' },
        { max: 999999, name: '8 hardcore' },
    ];

    var levelRange = levelRanges.find((range) => level <= range.max);
    if (levelRange != undefined) {
        return levelRange.name;
    }
    return '-1 undefined';
}
/////// ANALYTICS : END ///////


/////// TOURNAMENT : BEGIN ///////

export function countActiveTournament (tournaments:{[key:string]:{
    endTime:number}}, nowMS:number) {
    var count:number = 0;
    var contextIds:string[] = Object.keys(tournaments);
    for (var i: number = 0; i < contextIds.length; i++) {
        if (tournaments[contextIds[i]].endTime > nowMS) {
            count++;
        }
    }
    return count;
}

export function countFriendTournament (tournaments:{[key:string]:{
    endTime:number,
    collected:boolean,
    score:number,
    chestsCollected:number
}}, nowMS:number) {
    var count:number = 0;
    var contextIds:string[] = Object.keys(tournaments);
    for (var i: number = 0; i < contextIds.length; i++) {
        if (tournaments[contextIds[i]].endTime > nowMS) {
            count++;
        }
    }
    return count;
}

/////// TOURNAMENT : END ///////


/////// DATE : BEGIN ///////

export function getUTCWeekNumber (d:Date) {
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
};

/////// DATE : END ///////