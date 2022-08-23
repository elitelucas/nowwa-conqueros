export enum GameErrorCode { // types of error
    DoubleInit,
    InsufficentCoins,
    InsufficentGems,
    InsufficentTokens,
    InsufficentDice,
    InvalidData,
    AlreadyUnlocked,
    UndefinedError,
    RequirementsNotMet,
    MaximumValueReached,
    MapStillLocked,
    AvatarStillLocked,
    CannotClaimDailyRewards,
    PlayerIdNotFound,
    NoMatchingPlayer,
    AttackAlreadyResolved,
    RaidAlreadyResolved,
    GiftAlreadyResolved
}

export class GameError extends Error {
    public code: GameErrorCode;
    public detail: string;
    constructor(c: GameErrorCode, d?: string) {
        if (c == GameErrorCode.InsufficentCoins) {
            super("insufficent amount of coins");
        } else if (c == GameErrorCode.InsufficentGems) {
            super("insufficent amount of gems");
        } else if (c == GameErrorCode.InsufficentTokens) {
            super("insufficent amount of tokens");
        } else if (c == GameErrorCode.InvalidData) {
            super("invalid game data");
        } else if (c == GameErrorCode.AvatarStillLocked) {
            super("avatar is not owned");
        } else if (c == GameErrorCode.AlreadyUnlocked) {
            super("already unlocked");
        } else if (c == GameErrorCode.RequirementsNotMet) {
            super("requirements are not met");
        } else if (c == GameErrorCode.MaximumValueReached) {
            super("maximum value reached");
        } else if (c == GameErrorCode.MapStillLocked) {
            super("map is still locked");
        } else if (c == GameErrorCode.DoubleInit) {
            super("should not be initialized multiple times");
        } else if (c == GameErrorCode.CannotClaimDailyRewards) {
            super("cannot claim daily rewards");
        } else if (c == GameErrorCode.PlayerIdNotFound) {
            super("player id not found");
        } else if (c == GameErrorCode.NoMatchingPlayer) {
            super("no matching player");
        } else if (c == GameErrorCode.AttackAlreadyResolved) {
            super("attack is already resolved");
        } else if (c == GameErrorCode.GiftAlreadyResolved) {
            super("gift is already resolved");
        } else {
            super("undefined error");
        }
        this.code = c;
        this.detail = d || '';
    }
}