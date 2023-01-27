import { AtmOutlined } from '@mui/icons-material';
import React, { createContext, useState, useEffect, useContext } from 'react'
import { ConquerContext } from './ConquerContext';

export const NFTContext = createContext()

const NFTContextProvider = (props) => {
  //conquer
  const { CONQUER, loggedin, myAvatarID } = useContext(ConquerContext)

  //nft
  const [nftInstance, setNFTInstance] = useState();
  const [contractInfo, setContractInfo] = useState({});

  //Page components
  const [loadingNFT, setLoadingNFT] = useState(true);

  useEffect(() => {
    let asyncFunction = async () => {
      if (!CONQUER) return;
      if (!loggedin) return;

      // NFT
      setLoadingNFT(true)

      let nftInstance = await CONQUER.NFT.get();
      setNFTInstance(nftInstance)
      console.log(nftInstance)

      setContractInfo({
        address: nftInstance.address,
        chainID: nftInstance.chainID,
        name: nftInstance.name,
        symbol: nftInstance.symbol,
        totalSupply: nftInstance.totalSupply,
        mintPrice: nftInstance.mintPrice,
      })

      setLoadingNFT(false)
    }
    asyncFunction();

  }, [CONQUER, loggedin]);

  const mintTokens = async (amount) => {
    console.log('NFTContext/mint')
    let mintedTokens = await nftInstance.mint(amount);
    return mintedTokens;
  }

  const getAllTokens = async () => {
    let tokens = await nftInstance.getTokens();
    return tokens;
  }

  const getMyTokens = async () => {
    let tokens = await nftInstance.getTokens(myAvatarID);
    return tokens;
  }

  const getTokenbyTokenID = async (tokenID) => {
    let tokenInstance = await nftInstance.getToken(Number(tokenID));
    return tokenInstance;
  }

  const getTokenHistory = async (tokenID) => {
    let tokenInstance = await nftInstance.getToken(Number(tokenID));
    if (!tokenInstance.contract) return []; // no token

    console.log("tokenInstance", tokenInstance)
    let histories = await tokenInstance.History.get();

    return histories;
  }


  return (
    <NFTContext.Provider
      value={{
        //NFT
        contractInfo,
        mintTokens,
        getAllTokens,
        getMyTokens,
        getTokenbyTokenID,
        getTokenHistory,
        //components
        loadingNFT,
      }}>
      {props.children}
    </NFTContext.Provider>
  )
}
export default NFTContextProvider