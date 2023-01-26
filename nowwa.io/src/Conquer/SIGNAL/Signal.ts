 
import CONQUER from "../CONQUER";
 
class Signal
{
    private conquer     : CONQUER;
    public tabs         : any;
    private vars        : any = {};
    public listeners    : any = {};
 
    constructor( conquer:CONQUER  )
    {
        this.conquer    = conquer;
    }
 
    public get( name:string, callback:Function )
    {
        if( !this.listeners[name] ) this.listeners[name] = [];
        this.listeners[name].push( callback );
    }

    public set( name:string, value:any )
    {
        if( !this.listeners[name] ) return;

        for( let n in this.listeners[name] ) this.listeners[name][n]( value );
    }

    public remove( name:string, callback:Function )
    {
        if( !this.listeners[name] ) return;

        for( let n=0; n<this.listeners[name].length; n++ ) if( this.listeners[name][n] === callback )
        {
            this.listeners.splice( n, 1 ); 
            return;
        }
    }
}

export default Signal;