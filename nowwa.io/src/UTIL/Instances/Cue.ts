import ARRAY from "../ARRAY";

class Cue
{
    public isRandom : boolean;
    public _pool :any       = [];
    public data  :any       = [];
    public pool  :any       = [];
    public position     = 0;
    public selected     = null;
    public length       = 0;
 
    constructor( _isRandom?:boolean )
    {
        this.isRandom = _isRandom as boolean;
    }
 
    public push( value:any )
    {  
        this._pool.push( value );

        this.getLength();

        return value;
    };

    public pushUnique( value:any )
    {  
        ARRAY.pushUnique( this._pool, value );

        this.getLength();

        return value;
    };

    public copy( array:any )
    {
        this._pool = array;
     
        this.getLength();

        return self;
    };

    public pushArray( array:any )
    {
        ARRAY.push( array, this._pool );
        this.getLength();

        return self;
    };

    public clone()
    {
        return new Cue( this.isRandom ).copy( this._pool );
    };

    public fillChance( chanceValue:number ) : Cue
    {
        chanceValue     *= 10;
        this.isRandom   = true;

        var n;

        for( n =0; n<chanceValue; n++) this.push( true );
        for( n =chanceValue; n<10; n++) this.push( false );

        return this;
    };

    public getLength() : number
    {
        length = this._pool.length;
        return length;
    }
 
    public add( id:any, value:number ) : any
    {
        id += "";
        this.data[id] = value;
 
        return this.push( value );
    };
 
    public get( id?:string ) : any
    {
        if( id != null ) return this.setSelected( this.data[id] );
 
        if( !this.pool.length ) this.reset();
 
        return this.setSelected( this.pool.shift() );
    };

    public shift( id:string ) : any
    {
        return this.get( id );
    }
 
    public getNext() : any
    {
        return this.pool[0];
    };

    public setSelected( item:any ) : any
    {
        this.selected = Array.isArray( item ) ? ( this.isRandom ? ARRAY.shuffle( item ) : ARRAY.copy( item ) ) : item;
 
        return this.selected;
    } 

    public consume() : any
    {
        if( !this.selected ) return;

        var value : any = this.selected;

        if( Array.isArray( value ) ) 
        {
            if( value.length ) return( value.shift() );
            value = null;
        }else{
            this.position++;
        }
 
        this.selected = null;
        return value;
    };

    public removeItem( item:any ) : any
    {
        ARRAY.removeItem( this.pool, item );

        if( this.selected == item ) this.selected = null;
        return item;
    };

    public reset()
    {
        this.position   = 0;
        this.pool  = this.isRandom ? ARRAY.shuffle( this._pool ) : ARRAY.copy( this._pool );
        if( this.pool[0] == this.selected ) this.pool.push( this.pool.shift() );
        this.selected = null;
    };

    public clear()
    {
        this.pool       = [];
        this.selected   = null;
    };

    public getPosition( pos:any ) : any
    {   
        if( !pos || pos < 0 ) return;

        this.reset();

        while( pos > this._pool.length ) pos -= this.pool.length;

        var value : any;
        while( this.position < pos ) value = this.get(); 
        return value;
    };
}
export default Cue;