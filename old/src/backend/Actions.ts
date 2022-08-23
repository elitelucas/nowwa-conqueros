import * as G from "@play-co/gcinstant";
import * as R from "@play-co/replicant";
import * as E from "./Enums";
import * as X from "./Errors";
import * as H from "./Helpers";
import * as I from "./Types";
import stateSchema from "./StateSchema";
import scheduledActions from "./ScheduledActions";
import chatbotMessageTemplates from "./ChatbotMessageTemplates";
import computedProperties from "./ComputedProperties"; 
import messages from "./Messages"; 
import Game from "./Game"; 
import { extendActionsForAnalytics } from '@play-co/gcinstant-replicant-extensions';
import { StringFilters } from "@play-co/replicant/lib/core/ReplicantIndexes";

export default extendActionsForAnalytics(R.createActions(stateSchema, { computedProperties: computedProperties, messages: messages, scheduledActions: scheduledActions }) ({

    sendBotMessage: R.action((state, args: { recipient: string, subtitle:string, cta:string, title:string, url:string, assetName: I.AssetTypes, delayInMS?: number }, api) => {
        if (args.delayInMS != null) {
            api.scheduledActions.schedule.sendBotMessage({
                args: {
                    recipient: args.recipient,
                    subtitle: args.subtitle,
                    cta: args.cta,
                    title: args.title,
                    url: args.url,
                    assetName: args.assetName,
                    feature: "Send Bot Message"
                }, 
                notificationId: "Send Bot Message",
                delayInMS: args.delayInMS,
            });
        } else {
            api.chatbot.sendMessage(
                args.recipient,
                chatbotMessageTemplates.botMessage({ 
                    args: {
                        subtitle: args.subtitle,
                        cta: args.cta,
                        title: args.title,
                        url: args.url,
                        assetName: args.assetName
                    }, 
                    payload: {
                        $channel: "chatbot",
                        feature: "chatbot",
                        $subFeature: null
                    }
                })
            );
        }
    }),
    
    findPlayers: R.asyncAction((state, args: { minStars: number, maxStars: number }, api) => {
        return api.searchPlayers({
            limit: 3,
            where: {
                id: {
                    isNotOneOf: [state.id]
                },
            },
        }).then((players) => {
            if (players.results.length > 0) {
                const bestPlayer = players.results[0];
    
                // bestPlayer: {
                //   id: string  -- system field with the id of the player
                //   stars: number -- searchable field
                //   items: tuple[] -- searchable field
                //   name: string -- payload field
                //   profilePic: string -- payload field
                // }
            }
            return players;
        });
    }),
    
    findTarget: R.asyncAction((state, _:void, api) => {
        return api.searchPlayers({
            where: {
                id: {
                    isNotOneOf: [state.id]
                },
            },
            limit: 10,
        }).then((players) => {
            if (players.results.length > 0) {
                var index:number = Math.floor(api.math.random() * players.results.length);
                return players.results[index];
            }
            throw new X.GameError(X.GameErrorCode.NoMatchingPlayer);
        });
    }),

    getProfile: R.asyncAction((state, args: { id:string }, api) => {
        return api.fetchStates([args.id])
        .then((players) => {
            let playerData = players[args.id].state;
            return {
                userName: playerData.profile.userName,
                userPhoto: playerData.profile.userPhoto,
                userID: playerData.profile.userID,
                skinID: playerData.profile.skinID,
            }
        });
    }),

    getProfiles: R.asyncAction((state, args: { ids:string[] }, api) => {
        return api.fetchStates(args.ids)
        .then((players) => {
            var output:{ [key: string]: any } = {};
            for (var i = 0; i < args.ids.length; i++) {
                var id = args.ids[i];
                let playerData = players[id].state;
                output[id] = {
                    userName: playerData.profile.userName,
                    userPhoto: playerData.profile.userPhoto,
                    userID: playerData.profile.userID,
                    skinID: playerData.profile.skinID,
                };
            }
            return output;
        });
    }),

    setMaxLevel: R.action((state, args: { maxLevel: number }, api) => {
        if (args.maxLevel < 0) {
            throw new Error("cannot be negative number!");
        }
        state.maxLevel = args.maxLevel;
    }),

    setFTUE: R.action((state, args: {step:number}) => {
        state.ftue = args.step;
    }),

    initPlayerData: R.action ((state, args: { name:string, pic:string }, api) => {
        let nowMS:number = api.date.now();
        H.resetData(state, nowMS);
        state.lastLogin = state.updatedAt;
        state.isInitialized = true;
        state.profile.userName = args.name;
        state.profile.userPhoto = args.pic;
        state.profile.userID = state.id;
        state.profile.skinID = "";
        state.maxLevel = 1;
    }),

    resetPlayerData: R.action ((state, args: { name:string, pic:string }, api) => {
        let nowMS:number = api.date.now();
        H.resetData(state, nowMS);
        state.lastLogin = nowMS;
        state.isInitialized = true;
        state.profile.userName = args.name;
        state.profile.userPhoto = args.pic;
        state.profile.userID = state.id;
        state.profile.skinID = "";
    }),

    updateProfile: R.action((state, args: { name:string, pic:string }, api) => {
        let nowMS:number = api.date.now();
        state.profile.userPhoto = args.pic;
        state.profile.userID = state.id;
        state.profile.userName = args.name;
        if (state.maxLevel < 1) {
            state.maxLevel = 1;
        }
    }),

    updateSkin: R.action((state, args: { skinID:string }, api) => {
        let nowMS:number = api.date.now();
        state.profile.skinID = args.skinID;
    }),

    storeDump: R.action((state, args: {key:string, value: any}, api) => {
        let dump:any = state.dumpData;
        if (typeof state.dumpData == 'undefined') {
            dump = {};
        }
        dump[args.key] = args.value;
        state.dumpData = dump;
    }),

    disconnect: R.action(() => {
        throw new R.ReplicantError('disconnect', "network_error");
    }),

    // #region ANALYTICS ///
    updateActiveFriends: R.action((state, args: { activeFriendCounts: I.ActiveFriendCounts }, api)=>{
        state.analytics.playerFriendCount = args.activeFriendCounts.playerFriendCount;
        state.analytics.activeFriendCount1D = args.activeFriendCounts.activeFriendCount1D;
        state.analytics.activeFriendCount3D = args.activeFriendCounts.activeFriendCount3D;
        state.analytics.activeFriendCount7D = args.activeFriendCounts.activeFriendCount7D;
        state.analytics.activeFriendCount14D = args.activeFriendCounts.activeFriendCount14D;
        state.analytics.activeFriendCount30D = args.activeFriendCounts.activeFriendCount30D;
        state.analytics.activeFriendCount90D = args.activeFriendCounts.activeFriendCount90D;
    }),
    // #endregion ANALYTICS ///
    
    // #region TOURNAMENT ///

    registerTournament: R.asyncAction((state, args: { createTime:number, endTime:number, contextID: string }, api)=>{
        state.tournamentsV2[args.contextID] = {
            endTime: args.endTime,
            createTime: args.createTime
        };
    }),

    cleanTournament: R.asyncAction((state, _, api)=>{
        var now:number = api.date.now();
        var endTimeOffset:number = 2 * 24 * 60 * 60 * 1000;
        var keys:string[] = Object.keys(state.tournamentsV2);
        for (var i:number = 0; i < keys.length; i++) {
            var key:string = keys[i];
            var endTime:number = state.tournamentsV2[key].endTime;
            if ((endTime + endTimeOffset) < now) {
                delete state.tournamentsV2[key];
            }
        }
    }),

    // #endregion TOURNAMENT ///

    claimDailyRewards: R.action ((state, _:void, api) => {
        var lastDate:Date = new Date(state.lastDailyRewardDate);
        var nowDate:Date = new Date(api.date.now());
        var isDifferent:boolean = (lastDate.getDay() != nowDate.getDay()) || (lastDate.getFullYear() != nowDate.getFullYear()) || (lastDate.getMonth() != nowDate.getMonth());
        if (isDifferent) {
            state.lastDailyRewardDate = nowDate.getTime();
        }
        var dateDiff:number = (nowDate.valueOf() - lastDate.valueOf()) / (24 * 60 * 60 * 1000);
        var isConsecutive:boolean = dateDiff <= 1;
        if (isDifferent) {
            if (isConsecutive) {
                return "bonus";
            } else {
                return "reset";
            }
        } else {
            return "same";
        }
    }),

    /////// CUSTOM LEADERBOARD : BEGIN ///////

    saveMaxScore: R.asyncAction((state, args: { score:number }, api)=>{

        var now = new Date(api.date.now());
        var currentDate = now.getUTCDate();
        var currentMonth = now.getUTCMonth();
        var currentYear = now.getUTCFullYear();
        var currentWeek = H.getUTCWeekNumber(now);

        state.maxScores.allTime = Math.max(state.maxScores.allTime, args.score);

        var weeklyID:string = currentWeek.toString();
        if (state.maxScores.weeklyID == "" || state.maxScores.weeklyID == weeklyID) {
            state.maxScores.weekly = Math.max(state.maxScores.weekly, args.score);
        } else {
            state.maxScores.weekly = args.score;
        }
        state.maxScores.weeklyID = weeklyID;

        var dailyID:string = `${currentYear}-${currentMonth}-${currentDate}`;
        if (state.maxScores.dailyID == "" || state.maxScores.dailyID == dailyID) {
            state.maxScores.daily = Math.max(state.maxScores.daily, args.score);
        } else {
            state.maxScores.daily = args.score;
        }
        state.maxScores.dailyID = dailyID;
    }),
    
    getMaxScores: R.asyncAction((state, args: { playerIds: string[] }, api)=>{
        return api.fetchStates([...args.playerIds, state.profile.userID])
        .then((states)=>{
            var output:{
                    userID:string,
                    userName:string,
                    userPhoto:string,
                    allTime:number,
                    weekly:number,
                    daily:number
                }[] = [];

            var now = new Date(api.date.now());
            var currentDate = now.getUTCDate();
            var currentMonth = now.getUTCMonth();
            var currentYear = now.getUTCFullYear();
            var currentWeek = H.getUTCWeekNumber(now);

            var weeklyID:string = currentWeek.toString();
            var dailyID:string = `${currentYear}-${currentMonth}-${currentDate}`;

            for (var i = 0; i < args.playerIds.length; i++) {
                var id = args.playerIds[i];
                let maxScores = states[id].state.maxScores;

                var profile = states[id].state.profile;

                var entry:{
                    weekly:number,
                    allTime:number,
                    daily:number,
                    profile: {
                        userID:string,
                        userName:string,
                        userPhoto:string
                    }
                } = {
                    weekly: 0,
                    daily: 0,
                    allTime: 0,
                    profile: {
                        userID: profile.userID,
                        userName: profile.userName,
                        userPhoto: profile.userPhoto
                    }
                };

                if (maxScores.dailyID == dailyID) {
                    entry.daily = maxScores.daily;
                }
                if (maxScores.weeklyID == weeklyID) {
                    entry.weekly = maxScores.weekly;
                }

                output.push({
                    allTime: entry.allTime,
                    weekly: entry.weekly,
                    daily: entry.daily,
                    userID: entry.profile.userID,
                    userPhoto: entry.profile.userPhoto,
                    userName: entry.profile.userName
                });
            }

            output.push({
                allTime: state.maxScores.allTime,
                weekly: state.maxScores.weekly,
                daily: state.maxScores.daily,
                userID: state.profile.userID,
                userPhoto: state.profile.userPhoto,
                userName: state.profile.userName
            });

            return output;
        });
    }),

    /////// CUSTOM LEADERBOARD : END ///////

    /////// FARMS & VOTES : BEGIN ///////

    getFarms: R.asyncAction((state, args: { playerId: string }, api):Promise<I.Farm>=>{
        if (state.id == args.playerId) {
            return Promise.resolve(state.farm);
        } else {
            return api.fetchStates([args.playerId])
            .then((results)=>{
                return results[args.playerId].state.farm;
            });
        }
    }),

    setFarm: R.action ((state, args: {farmIndex:number, farmValue:number} , api) => {
        if (args.farmIndex < 0  || args.farmIndex >= state.farm.values.length) {
            throw new Error("index out of range");
        }
        state.farm.values[args.farmIndex] = args.farmValue;
    }),

    vote: R.action ((state, args: { playerId: string, voteValue:number}, api) => {
        api.postMessage.addVote(args.playerId, { 
            voteValue: args.voteValue,
        });
    }),

    /////// FARMS & VOTES : END ///////

    /////// CURRENCIES : START ///////

    setCoins: R.asyncAction ((state, args: { coins:number }, api):void => {
        state.currency.coins = args.coins;
    }),

    setGems: R.asyncAction ((state, args: { gems:number }, api):void => {
        state.currency.gems = args.gems;
    }),

    // #endregion CURRENCIES ///
    
    // #region MESSAGES ///

    sendMessage: R.action ((state, args: { 
        userID: string,
        content: any,
        type: string,
    }, api) => {
        api.postMessage.receiveMessage(args.userID, { 
            userName: state.profile.userName,
            userPhoto: state.profile.userPhoto,
            userID: state.profile.userID,
            status: "unread",
            content: args.content,
            type: args.type,
        });
    }),

    // #endregion MESSAGES ///
    
    // #region CHALLENGES ///
    /*
    sendChallenge: R.action ((state, args: { 
        userID: string,
        content: any,
        type: string,
    }, api) => {
        api.postMessage.receiveChallenge(args.userID, { 
            userName: state.profile.userName,
            userPhoto: state.profile.userPhoto,
            userID: state.profile.userID,
            status: "unread",
            content: args.content,
            type: args.type,
        });
    }),
    */

    createChallenge: R.action ((state, args: {challengeId:string}, api) => {
        state.challenges[args.challengeId] = {
            status: "begin"
        };
    }),

    acceptChallenge: R.action ((state, args: {userID:string, challengeId:string}, api) => {
        state.challenges[args.challengeId] = {
            status: "running"
        };
        api.postMessage.acceptChallenge(args.userID, {
            challengeId:args.challengeId
        });
    }),

    finishChallenge: R.action ((state, args: {userID:string, challengeId:string}, api) => {
        state.challenges[args.challengeId] = {
            status: "finished"
        };
        api.postMessage.finishChallenge(args.userID, {
            challengeId:args.challengeId
        });
    }),

    // #endregion CHALLENGES ///
    
    // #region INVITES ///

    acceptRewardedInvite: R.action ((state, args: {userID:string, profile:I.Profile}, api) => {
        api.postMessage.receiveInvite(args.userID, { 
            userName: args.profile.userName,
            userPhoto: args.profile.userPhoto,
            userID: args.profile.userID
        });
    }),

    confirmRewardedInvites: R.action ((state, _, api):I.Profile[] => {
        let output = [];
        Object.entries(state.invites).forEach(item => {
            if (!item[1].isDone) {
                state.invites[item[0]] = {
                    isDone: true,
                    userID: item[1].userID,
                    userName: item[1].userName,
                    userPhoto: item[1].userPhoto
                }
            } else {
                output.push(item[1]);
            }
        });
        return output;
    }),

    clearRewardedInvites: R.action ((state, _, api):void => {
        state.invites = {};
    }),
    
    // #endregion INVITES ///


}));