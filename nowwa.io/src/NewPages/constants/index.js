export const ChainId = {
    MAINNET : 1,
    ROPSTEN : 3,
    RINKEBY : 4,
    GOERLI : 5,
    KOVAN : 42,
    MATIC : 137,
    MATIC_TESTNET : 80001,
    FANTOM : 250,
    FANTOM_TESTNET : 4002,
    XDAI : 100,
    BSC : 56,
    BSC_TESTNET : 97,
    ARBITRUM : 79377087078960,
    MOONBASE : 1287,
    AVALANCHE : 43114,
    FUJI : 43113,
    HECO : 128,
    HECO_TESTNET : 256,
    HARMONY : 1666600000,
    HARMONY_TESTNET : 1666700000
}

export const contractAddress = {
    [ ChainId['MAINNET'] ]: '',
    [ ChainId['GOERLI'] ]: '0xE74da0A4E7C5FC09fa793498ccE70e598D8432b2',
}

export const mainNetworkChainId = ChainId.MAINNET
export const goerliNetworkChainId = ChainId.GOERLI

export const NetworkContextName = 'NETWORK'

export const ErrorMessages = {
    '-32002': 'Already processing Metamask wallet connect. Please confirm metamask modal.'
}

export const ApplicationModal = {
    WALLET : 1,
    MINDMAP: 2,
    GALLERY: 3,
}

export const attributes = {
    Background: ["Blue", "Yellow", "Purple", "Orange", "Pink", "Green", "Bathroom", "Crime Scene"],

    Bag: ["Grey Backpack", "Tate", "Brown Backpack", "Green Chest Bag", "Yellow Chest Bag", "Duffel Bag", "Black Chest Bag", "Grey Backpack with Slingshot"],

    Ears: ["Pencil", "Bing Bang Stick", "Earrings", "Earphones", "Headset", "Headphones", "Headphones with Music", "Chalk"],

    Eyes: ["Black Nerd Glasses", "White Nerd Glasses", "Sunglasses", "White Glasses", "Black Glasses", "Brown Glasses", "Eye Patch", "Pointy Glasses", 
            "Nerd Ghost Glasses", "Nose Glasses with Black Hair", "Nose Glasses with White Hair", "Boomer Glasses", "Googly Eyes", "Cool Glasses", "Thief Mask",
            "Swirly Glasses", "Radioactive Glasses", "Rainbow Glasses", "VR Goggles Graph", "VR Goggles Moon", "Devil Mask"],

    Fannypack: ["Green Fannypack", "Yellow Fannypack", "Black Fannypack", "Cream Fannypack"],

    Feet: ["Green Shoes", "Maroon Shoes", "Tan Boots", "Rocket Pop Sneakers", "Summer Day Sneakers", "Ice Grey Sneakers", "Dark Blue Slippers", "Bubblegum Blue Sneakers", 
            "Black Shoes", "Light Blue Slippers", "Green Boots", "Bleached Sand Sneakers", "Summer Night Sneakers", "Red Shoes", "Brown Boots", "Yellow Boots", "Bunny Slippers", "Forest Moss Sneakers", 
            "Ocean Blue Sneakers", "Cream Slippers", "Pink Slippers", "Frog Slippers", "Chalk Outline", "White Slippers"]
}

export const colors = {
    Blue: '#c1d7e5',
    Yellow: '#f7f2bb',
    Purple: '#d0ccf4',
    Orange: '#f6d9c5',
    Pink: '#f9cff2',
    Green: '#cff0ce',
    Default: '#c1d7e5'
}

export const MoralisAPIKey = {
    serverUrl: "https://ygogtpuez79s.usemoralis.com:2053/server",
    appId: "6STWJ8AyIqe5s56zzLmNyCvriXZeIW2Pr44Jb5bI",
    apiKey: "2kHumt68e3WgGgwT82mkFVMMmlpfnf3Mzi7KWXWnyHrO8lJqpV5aZeAiFts3yYzM"    
}