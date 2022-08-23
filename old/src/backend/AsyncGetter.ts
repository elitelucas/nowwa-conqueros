import * as R from "@play-co/replicant";
import stateSchema from "./StateSchema";
import computedProperties from "./ComputedProperties";
import * as H from "./Helpers";
import * as T from "./Types";
import { createAsyncGettersForAnalytics } from "@play-co/gcinstant-replicant-extensions";
import { AsyncGettersAPI } from "@play-co/replicant/lib/core/ReplicantAsyncGetters";
import { PartialReplicant } from "@play-co/replicant/lib/core/ReplicantConfig";
import { SB } from "@play-co/replicant";
import { GetPayloadSchema, QueryResults } from "@play-co/replicant/lib/core/ReplicantIndexes";

export type API = AsyncGettersAPI<PartialReplicant<{
    state: SB.ExtractType<typeof stateSchema>;
    computedProperties: typeof computedProperties;
}>>;

export type ReplicantQuery = QueryResults<GetPayloadSchema<typeof computedProperties>>;

export type TournamentDataResult = {
    createTime: number;
    endTime: number;
    playerIds: string[];
};

async function getTournamentFriendCount(
    args: { friendIds: readonly string[], contextId: string | null },
    api: API
): Promise<number> {
    if (!args.contextId) {
        return 0;
    }

    const friendsSearch = await api.fetchStates(args.friendIds as string[]);

    var count = 0;
    for (var i = 0; i < args.friendIds.length; i++) {
        var friendState = friendsSearch[args.friendIds[i]];
        if (friendState.state.tournamentsV2[args.contextId]) {
            count++;
        }
    }

    return count;
}

function getActiveFriendsQuery(
    friendIds: readonly string[],
    api: API
): Promise<ReplicantQuery> {
    return api.searchPlayers({
        where: {
            id: {
                isOneOf: friendIds as string[],
            },
            updatedAt: {
                // TODO: change "duration" to millisecond -> duration(90) means
                // 90 days in millisecond
                greaterThan: api.date.now() - H.duration({ days: 90 }),
            },
        },
        limit: friendIds.length,
    });
}

function calculateTournamentFriendCount(
    query: ReplicantQuery,
    tournamentContextId: string | null
): number {
    let count = 0;

    if (tournamentContextId) {
        for (const friend of query.results) {
            for (const tournament of friend.tournaments) {
                if (tournament.contextId === tournamentContextId) {
                    count++;
                    break;
                }
            }
        }
    }

    return count;
}

function calculateActiveFriendCounts(
    query: ReplicantQuery,
    friendIds: readonly string[],
    api: API
): T.ActiveFriendCounts {
    const friends: { [id: string]: { lastUpdated: number } } = {};

    for (const friend of query.results) {
        friends[friend.id] = { lastUpdated: friend.updatedAt };
    }

    return H.calculateActiveFriendCounts(friends, friendIds, api.date.now());;
}

async function getActiveFriendCounts(
    args: { friendIds: readonly string[] },
    api: API
): Promise<T.ActiveFriendCounts> {
    const query = await getActiveFriendsQuery(args.friendIds, api);
    return calculateActiveFriendCounts(query, args.friendIds, api);
}

/**
 * @TODO This getter can replace the following async actions:
 *  - getTournamentPlayers
 *  - getTournamentCreateTime
 *  - getTournamentEndTime
 */
async function getTournamentData(
    args: { contextId: string | null },
    api: API
): Promise<TournamentDataResult> {
    if (!args.contextId) {
        return {
            createTime: 0,
            endTime: 0,
            playerIds: [],
        };
    }

    const query = await api.searchPlayers({
        where: {
            tournaments: {
                contextId: {
                    isAnyOf: [args.contextId]
                }
            }
        },
        limit: 50,
        sort: [{
            field: "tournaments.endTime",
            order: "asc"
        }]
    });

    let createTime = 0;
    let endTime = 0;

    const playerIds = query.results.map(({ userID, tournaments }) => {
        for (let i = 0; i < tournaments.length; i++) {
            const t = tournaments[i];
            if (t.createTime > createTime) {
                createTime = t.createTime;
            }
            if (t.endTime > endTime) {
                endTime = t.endTime;
            }
        }

        return userID;
    });

    return {
        createTime: createTime,
        endTime: endTime,
        playerIds: playerIds,
    };
}

export default R.createAsyncGetters(stateSchema, { computedProperties: computedProperties })({
    ...createAsyncGettersForAnalytics({
        stateSchema,
        computedProperties
    }),

    getActiveFriendCounts,
    getTournamentFriendCount,
    getTournamentData,

    getEntryAnalyticsDataCombined: async (
        args: { friendIds: readonly string[], contextId: string | null },
        api
    ): Promise<{
        friendCounts: T.ActiveFriendCounts;
        tournament: TournamentDataResult;
        tournamentFriendCount: number;
    }> => {
        const [friendQuery, tournament] = await Promise.all([
            getActiveFriendsQuery(args.friendIds, api),
            getTournamentData(args, api),
        ]);

        const friendCounts = calculateActiveFriendCounts(friendQuery, args.friendIds, api);
        const tournamentFriendCount = calculateTournamentFriendCount(friendQuery, args.contextId);

        return {
            friendCounts,
            tournament,
            tournamentFriendCount
        };
    }
});