import { ACTIONS } from "../../Models/ENUM";
import CONQUER from "../CONQUER";

class Analytics
{
    private conquer : CONQUER;
    private vars    : any = {};

    constructor( conquer:CONQUER )
    {
        this.conquer = conquer;
    };

    public async get( vars:any ) : Promise<any>
    {
        let values = await this.conquer.do( ACTIONS.ANALYTICS_GET, vars );
        return Promise.resolve( values );
    }

    public set( label:string, value?:any )
    {
        this.vars.label = label;
        delete this.vars.value;
        if( value ) this.vars.value = value;

        this.conquer.do( ACTIONS.ANALYTICS_SET, this.vars )
    }

    public onEntryPoint()
    {
        // add other variables
        this.set( "onEntryPoint" );
    }

    public onError( value?:any )
    {
        this.set( "onError", value );
    }
  
    public onTrackBuildVersion( value?:any )
    {
        this.set( "onTrackBuildVersion", value );
    }
 
    public onShopOpen( value?:any )
    {
        this.set( "onShopOpen", value );
    }

    public onShopPurchase( value?:any )
    {
        this.set( "onShopPurchase", value );
    }

    public onStartGame( value?:any )
    {
        this.set( "onStartGame", value );
    }

    public onPreloadEnd( value?:any )
    {
        this.set( "onPreloadEnd", value );
    }

    public onTutorialStart( value?:any )
    {
        this.set( "onTutorialStart", value );
    }

    public onTutorialStage( value?:any )
    {
        this.set( "onTutorialStage", value );
    }

    public onTutorialComplete( value?:any )
    {
        this.set( "onTutorialComplete", value );
    }

    public noAds( value?:any )
    {
        this.set( "noAds", value );
    }
 
    public onPostTournament( value?:any )
    {
        this.set( "onPostTournament", value );
    }

    public onSpectate( value?:any )
    {
        this.set( "onSpectate", value );
    }

    public onPlay( value?:any )
    {
        this.set( "onPlay", value );
    }

    public onPlayRewarded( value?:any )
    {
        this.set( "onPlayRewarded", value );
    }

    public onGameOver( value?:any )
    {
        this.set( "onGameOver", value );
    }

    public onGameExit( value?:any )
    {
        this.set( "onGameExit", value );
    }

    public onStartLevel( value?:any )
    {
        this.set( "onStartLevel", value );
    }

    public onLevelEnded( value?:any )
    {
        this.set( "onLevelEnded", value );
    }

    public onTryAgain( value?:any )
    {
        this.set( "onTryAgain", value );
    }
 
    public onAdFailed( value?:any )
    {
        this.set( "onAdFailed", value );
    }

    public onRevive( value?:any )
    {
        this.set( "onRevive", value );
    }

    public onPlayWithFriend( value?:any )
    {
        this.set( "onPlayWithFriend", value );
    }

    public onJoinTournament( value?:any )
    {
        this.set( "onJoinTournament", value );
    }

    public onInvite( value?:any )
    {
        this.set( "onInvite", value );
    }

    public onPlayWithRandom( value?:any )
    {
        this.set( "onPlayWithRandom", value );
    }

    public onMatchStart( value?:any )
    {
        this.set( "onMatchStart", value );
    }

    public onMatchEnd( value?:any )
    {
        this.set( "onMatchEnd", value );
    }

    public onShopEnter( value?:any )
    {
        this.set( "onShopEnter", value );
    }

    public onShopExit( value?:any )
    {
        this.set( "onShopExit", value );
    }
 
    public onPurchase( value?:any )
    {
        this.set( "onPurchase", value );
    }

    public onGift( value?:any )
    {
        this.set( "onGift", value );
    }

    public onAdRequest( value?:any )
    {
        this.set( "onAdRequest", value );
    }

    public onAdImpression( value?:any )
    {
        this.set( "onAdImpression", value );
    }

    public onAdComplete( value?:any )
    {
        this.set( "onAdComplete", value );
    }

    public onAdError( value?:any )
    {
        this.set( "onAdError", value );
    }

    public onShare( value?:any )
    {
        this.set( "onShare", value );
    }

    public onUI( value?:any )
    {
        this.set( "onUI", value );
    }

    public onUIOut( value?:any )
    {
        this.set( "onUIOut", value );
    }

    public onButton( value?:any )
    {
        this.set( "onButton", value );
    }

    public onDie( value?:any )
    {
        this.set( "onDie", value );
    }

    public onContinue( value?:any )
    {
        this.set( "onContinue", value );
    }
 
};

export default Analytics;