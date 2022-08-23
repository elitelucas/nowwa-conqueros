import * as R from "@play-co/replicant";
import stateSchema from "./StateSchema";

export default {
    userName: R.computedProperty(R.SB.string(), (state: R.SB.ExtractType<typeof stateSchema>) => state.profile.userName).payload(),
    userPhoto: R.computedProperty(R.SB.string(), (state: R.SB.ExtractType<typeof stateSchema>) => state.profile.userPhoto).payload(),
    userID: R.computedProperty(R.SB.string(), (state: R.SB.ExtractType<typeof stateSchema>) => state.profile.userID).payload(),
    updatedAt: R.computedProperty(R.SB.int(), (state: R.WithMeta<typeof stateSchema>) => {
        return Math.floor(state.updatedAt / 1000) * 1000;
    }).searchable(),
    tournaments: R.computedProperty(
        R.SB.array(R.SB.object({
            contextId: R.SB.string(),
            createTime: R.SB.number(),
            endTime: R.SB.number(),
        })),
        (state: R.SB.ExtractType<typeof stateSchema>) => {
            const contextIds:string[] = Object.keys(state.tournamentsV2).sort();
            return contextIds.map((contextId) => {
                const tournament = state.tournamentsV2[contextId];
                return {
                    contextId: contextId,
                    createTime: tournament.createTime,
                    endTime: tournament.endTime,
                };
            });
        },
    ).searchable(),
};