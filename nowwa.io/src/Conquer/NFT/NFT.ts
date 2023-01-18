import CONQUER from "../CONQUER";
import { ACTIONS } from "../../Models/ENUM";
import NFTInstance from "./INSTANCE/NFTInstance";

class NFT
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
        return Promise.resolve( new NFTInstance( this.conquer, data ) );
    };

}

export default NFT;