import { ACTIONS } from "../../../Models/ENUM";
import CONQUER from "../../CONQUER";
import TokenInstance from "./TOKEN/TokenInstance";
 
class NFTInstance
{
    private conquer         : CONQUER;
    private data            : any;

    public name             : string;
    public symbol           : string;
    public totalSupply      : number;
    public mintPrice        : number;
    public totalMinted      : number;
    public contract         : any;

    public constructor( conquer:CONQUER, data:any ) 
    {
        this.conquer        = conquer;
        this.data           = data;

        this.name           = data.name;
        this.symbol         = data.symbol;
        this.totalSupply    = data.totalSupply;
        this.mintPrice      = data.mintPrice;
        this.totalMinted    = data.totalMinted;
        this.contract       = data.contract;
    }
 
    /*=============== 
 
    GET TOKENS

    ================*/

    public async get( vars?:any ) : Promise<any>
    {
        let array   : any = await this.conquer.do( ACTIONS.NFT_TOKEN_GET, vars );
        let output  : any = [];
 
        for( let n in array ) output.push( new TokenInstance( this.conquer, array[n] ));

        return Promise.resolve( output );
    };
 
}

export default NFTInstance;