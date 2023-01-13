import { useActiveWeb3React } from "."
import React, { useState, useEffect, useCallback } from 'react'
import axios from "axios"
import { ChainId, contractAddress, MoralisAPIKey } from "../constants"

const apiKey = MoralisAPIKey.apiKey

const useNFTMoralis = () => {
    const { account, chainId } = useActiveWeb3React()
    const [ allNFTData, setAllNFTData ] = useState([])
    const [ myNFTData, setMyNFTData ] = useState([])

    const fetchNFTsForContract = useCallback(async () => {
        const oldTime = new Date().getTime()
        
        let cursor = null

        while(true) {
            const options = {
                method: 'GET',
                url: 'https://deep-index.moralis.io/api/v2/nft/' + contractAddress[ ChainId['GOERLI'] ],
                params: {chain: 'goerli', format: 'decimal', cursor: cursor},
                headers: {accept: 'application/json', 'X-API-Key': apiKey}
            }

            const response = await axios.request(options)
            console.log(response)
            if (response.status != 200)
                break

            const ethNFTs = response.data
            console.log(ethNFTs)
            cursor = ethNFTs.cursor
            setAllNFTData( prev => ([ ...prev, ...ethNFTs.result ]) )

            if( cursor === "" || cursor === null )
                break
        }

        const newTime = new Date().getTime()
        console.error('time elapsed: ', (newTime - oldTime))
    }, [ setAllNFTData ])

    const fetchNFTsForOwner = useCallback(async () => {
        if (!account)
            return;

        const oldTime = new Date().getTime()
        
        let cursor = null

        while(true) {
            const options = {
                method: 'GET',
                url: `https://deep-index.moralis.io/api/v2/${account}/nft`,
                params: {chain: 'goerli', format: 'decimal', token_addresses: contractAddress[ ChainId['GOERLI'] ], cursor: cursor},
                headers: {accept: 'application/json', 'X-API-Key': apiKey}
            }

            const response = await axios.request(options)
            console.log(response)
            if (response.status != 200)
                break

            const ethNFTs = response.data
            console.log(ethNFTs)
            cursor = ethNFTs.cursor
            setMyNFTData( prev => ([ ...prev, ...ethNFTs.result ]) )

            if( cursor === "" || cursor === null )
                break
        }

        const newTime = new Date().getTime()
        console.error('time elapsed: ', (newTime - oldTime))
    }, [ setMyNFTData ])


    useEffect(() => {
        fetchNFTsForContract()
        fetchNFTsForOwner()
    }, [ setAllNFTData, setMyNFTData ])

    return { allNFTData, myNFTData }
}

export default useNFTMoralis