import * as R from "@play-co/replicant";
import * as E from "./Enums";
import * as H from "./Helpers";
import * as I from "./Types";
import stateSchema from "./StateSchema";

export default R.createMessages(stateSchema)({

    resetTournament: R.createMessage (
        R.SB.object({ }),
        (state, args, msgInfo) => {
            // reset tournament
            state.tournamentsV2 = {};
        }
    ),
    
    addVote: R.createMessage(
        R.SB.object({ voteValue:R.SB.number() }),
        (state, args, msgInfo) => {
            // add vote count
            state.farm.votes += args.voteValue;
        }
    ),
    
    // #region MESSAGES ///

    receiveMessage: R.createMessage(
        R.SB.object({ 
            userName: R.SB.string(),
            userPhoto: R.SB.string(),
            userID: R.SB.string(),
            status: R.SB.string(),
            content: R.SB.unknown(),
            type: R.SB.string(),
        }),
        (state, args, msgInfo) => {
            // add message
            let message = {
                timestamp: msgInfo.timestamp,
                userName: args.userName,
                userPhoto: args.userPhoto,
                userID: args.userID,
                status: args.status,
                content: args.content,
            };
            if (typeof state.messages == 'undefined') {
                state.messages = {};
            }
            if (typeof state.messages[args.type] == 'undefined') {
                state.messages[args.type] = {};
            }
            state.messages[args.type][msgInfo.timestamp.toString()] = message;
        }
    ),

    // #endregion MESSAGES ///
    
    // #region INVITES ///

    receiveInvite: R.createMessage(
        R.SB.object({ 
            userName: R.SB.string(),
            userPhoto: R.SB.string(),
            userID: R.SB.string()
        }),
        (state, args, msgInfo) => {
            if (state.invites[args.userID] == null) {
                state.invites[args.userID] = {
                    isDone: false,
                    userID: args.userID,
                    userName: args.userName,
                    userPhoto: args.userPhoto
                };
            }
        }
    ),

    // #endregion INVITES ///
    
    // #region CHALLENGES ///

    acceptChallenge: R.createMessage(
        R.SB.object({ 
            challengeId: R.SB.string(),
        }),
        (state, args, msgInfo) => {
            state.challenges[args.challengeId] = {
                status: "running"
            }
        }
    ),

    finishChallenge: R.createMessage(
        R.SB.object({ 
            challengeId: R.SB.string(),
        }),
        (state, args, msgInfo) => {
            state.challenges[args.challengeId] = {
                status: "finished"
            }
        }
    ),

    // #endregion CHALLENGES ///

});