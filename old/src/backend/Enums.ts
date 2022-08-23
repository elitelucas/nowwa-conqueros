export enum CurrencyType { // types of currency
    Coins = 0,
    Gems = 1,
    Tokens = 2,
    Shields = 3,
    Dice = 4,
    Card = 5
}

export enum TileType { // types of a tile
    Coins = "Coins", // normal tile
    Attack = "Attack", // tile for attacking other player
    Defend = "Defend", // tile for defending from other player
    Card = "Card", // special tile for twists
    Friend = "Friend", // special tile to attack specific friend
    Start = "Start" // starting tile
}