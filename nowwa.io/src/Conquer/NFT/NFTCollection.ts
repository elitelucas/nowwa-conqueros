import CONQUER from "../CONQUER";
import { ACTIONS } from "../../Models/ENUM";
import NFTCollectionInstance from "./INSTANCE/NFTCollectionInstance";

class NFTCollection
{
    private conquer     : CONQUER;

    public constructor( conquer:CONQUER ) 
    {
        this.conquer    = conquer;
    }
 
    /*=============== 
 
    GET  

    ================*/

    public async get( vars?:any ) : Promise<any>
    {
        let data : any = await this.conquer.do( ACTIONS.NFT_COLLECTION_GET, vars );
        return Promise.resolve( new NFTCollectionInstance( this.conquer, data ) );
    };

}

export default NFTCollection;