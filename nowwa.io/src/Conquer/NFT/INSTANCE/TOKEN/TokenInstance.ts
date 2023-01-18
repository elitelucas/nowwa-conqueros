import { ACTIONS } from "../../../../Models/ENUM";
import CONQUER from "../../../CONQUER";
import TokenHistory from "./TokenHistory";
 
class TokenInstance
{
    private conquer         : CONQUER;
    public data             : any;
    public History          : TokenHistory;
    public tokenID          : any;
    public imageURL         : any;
    public metadata         : any;
    public listed           : boolean;
    public price            : number;
 
    public constructor( conquer:CONQUER, data:any ) 
    {
        this.conquer        = conquer;
        this.data           = data;
        this.tokenID        = data.tokenID;
        this.imageURL       = data.imageURL;
        this.metadata       = data.metadata;
        this.listed         = data.listed;
        this.price          = data.price;
 
        this.History        = new TokenHistory( conquer, this.tokenID );
    }

    public async list( price:number=0 ) : Promise<any>
    {
        return this.doAction( "list", { price:price });
    }

    public async unlist( vars?:any ) : Promise<any>
    {
        return this.doAction( "unlist", vars);
    }

    public async buy( vars?:any ) : Promise<any>
    {
        return this.doAction( "buy", vars);
    }

    public async transfer( vars?:any ) : Promise<any>
    {
        return this.doAction( "transfer", vars);
    }

    public async remove() : Promise<any>
    {
        return this.doAction( "remove" );
    }

    private async doAction( action:string, vars?:any )
    {
        vars            = vars || {};
        vars.tokenID    = this.tokenID;
        vars.action     = action;

        let result  = await this.conquer.do( ACTIONS.NFT_TOKEN_CHANGE, vars );

        return Promise.resolve( result );
    }
}

export default TokenInstance;