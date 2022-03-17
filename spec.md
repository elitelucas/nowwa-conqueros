Links
=====

Some examples to draw inspiration from:
https://www.nftdropscalendar.com/ -- NFT mint calendar, it's getting crowded out there.
https://nftevening.com/calendar/ -- another calender.
https://www.mint-wealthcyborgclub.com/mint -- example of an NFT currently minting.
https://cirkill.game/ -- a very lazy NFT game currently minting.
https://zomayalabs.io/ -- example of a game that's not yet minting.
https://aurory.io/ -- an example of a successful NFT game.


Scope
=====

What we're doing right now is a landing page for a game where we could sell in-game NFTs to fund the project.

The easiest way to do this is via metamask. Metamask wallet will also serve as a login.

As a second option we can add payment with a credit card. But I'm not sure about the legal implications of this, this is yet to be researched.

Thus, what we'll need overall:
1. Decide on game mechanics / value proposition.
    - Are doing just the NFTs?
    - Do we want an in-game token-based economy with an on-chain currency?
    - What do backers get from said NFTs? Free lootboxes? More powerful characters? Revshare? What's the value proposition?
    - The approach that the games are taking right now is "play to earn", so the mechanics are very important to decide on. 
2. Landing page with a description of what we're doing. This includes:
    - Description of the game. Nice video, etc.
    - Links to discord / twitter / opensea.
    - Whitepaper. Basically a design doc for the game and game mechanics.
    - Team / investors / all the usual stuff.
3. A very simple backend. What we need to support:
    - NFT transactions via metamask. That is, buying the NFTs. The implementation details are yet to be researched, my current understanding is that the backend just spits out a transaction that is then processed by metamask. So that the backend doesn't need blockchain integration.
    - Listing your NFTs, also via metamask. This would require access to the blockchain from the backend, details to be researched.
4. Smart contract for said NFTs.
    - We'll have to decide on the blockchain to use (ETH vs Solana, ETH has higher gas fees).
    - Write the smart contract according to the standard (e.g. https://eips.ethereum.org/EIPS/eip-721).
    - If we decide we need an on-chain currency, then we'll need another smart contract for it (see https://eips.ethereum.org/EIPS/eip-20).


Action Points
=============

What needs to be done right now:
- Figure out how NFT smart contracts work.
- Document an API endpoint for buying NFTs with Metamask.
- Actually write the code for both the smart contract and the backend.

In parallel:
- Decide on the game mechanics. E.g. if we want to let players mint new NFTs in-game, we'll need an in-game cryptocurrency.
- Decide on ETH vs SOL.
- Get a miro chart of how it would all work together. Including the smart contract, the website backend, metamask wallet, and the game backend.
- Document the API endpoints.




