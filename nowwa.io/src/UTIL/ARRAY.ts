import RANDOM from "./RANDOM";
import LOG, { log } from "./LOG";
import STRING from "./STRING";


class ARRAY
{
    public static push( array:[], _output?:[] ) : []
    {
        var output:[] = _output || [];
        for( var n in array ) output.push( array[n] );
        return output; 
    };

    public static clone( object:any ) : object
    {
        var output : any = {};
        for( var n in object ) output[n] = object[n];
        return output;   
    };

    public static deepClone ( object:any ) : string
    {
        return JSON.parse( JSON.stringify( object ) );
    };

    public static extract( from:any, to:any )
    {
        var output = to || {};

        if( !from ) return output;

        if( from._attributes )
        {
            for( var varName in from._attributes ) to[ varName ] = from[ varName ];
        }else{
            for( var n in from ) output[n] = from[n];
        }
 
        return output;  
    };
    
    public static merge( from:any, to:any  )
    {
        var output : any = ARRAY.clone( to );
        for( var n in from ) output[n] = from[n];
        return output;  
    };
    
    public static mergeUnique( from:any, to:any )
    {
        for( var n in from ) if( to[n] == null ) to[n] = from[n];
        return to;  
    };

    public static pushUnique( array:any, item:any )
    {
        if( array.indexOf( item ) == -1 ) array.push( item );
        return item;
    };

    public static copy ( array:any )
    {
        var output : any = [];
        for( var n=0; n< array.length; n++ ) output[n] = array[n];
        return output;
    };

    public static getRandomItem( array:any, andRemove?:boolean, andAvoid?:any ) : any
    {
        if( !array.length ) return null;
        
        var n       = RANDOM.value( array.length-1 );
        var item    = array[ n ]; 

        if( item == andAvoid ) return ARRAY.getRandomItem( array, andRemove, andAvoid );

        if( andRemove ) array.splice( n, 1 );

        return item;
    };

    public static removeItem( array:any, item:any  ) : any
    {
        var index = array.indexOf( item );  
 
        if ( index == -1 ) return false;
        
        array.splice( index, 1 ); 
 
        return item;
    };
 
    public static removeItems( array:[], items :[] )
    {
        for( var n in items ) ARRAY.removeItem( array, items[n] );
    };

    public static extractUnique( a:[], _output?:[] )
    {
        var output = _output || [];
        for( var n in a ) if ( output.indexOf( a[n] ) == -1 ) output.push( a[n] );
 
        return output;
    };

    public static sort( array:[], property:any )
    {
        array.sort( function(a,b) { return ( a[ property ] > b[ property ]) ? 1 : ((b[ property ] > a[ property ]) ? -1 : 0);} );
        return array;
    };
 
    public static shuffle( refArray:any, length?:number )
    {
        var array   : any = ARRAY.copy( refArray ); 
        var output  : any = [];

        while( array.length )
        {
            output.push( ARRAY.getRandomItem( array, false ) );
            if( output.length == length ) return output;
        }   

        return output;
    };

    public static shuffleLinear( array:any )
    {
        var output = ARRAY.copy( array );
         
        for( var n=0; n<array.length; n++ ) if( RANDOM.chance() ) ARRAY.firstToLast( output );
 
        if( RANDOM.chance() ) output.reverse();

        return output;
    };

    public static firstToLast( array:any )
    {
        array.push( array.shift() );
        return array; 
    };

    public static lastToFirst( array:[] )
    {
        array.reverse();
        ARRAY.firstToLast( array );
        array.reverse();
        return array; 
    };

    public static searchObject( object:any, label:string )
    {
        var output : any = {};
        for( var name in object ) if( STRING.containsStrict( name, label ) ) output[name] = object[name];
        return output;
    };
 
    public static pages( array:[], perpage:number=0 )
    {
        var array : [] = ARRAY.copy( array );
        var output = [];

        while( array.length )
        {
            var page = [];  
            var i = 0 ;
            while( ++i <= perpage && array.length ) page.push( array.shift() );
            output.push( page ) ;   
        };

        return output;
    };
 
    public static toNameVar( array:[], field:string )
    {
        var output = {};

        for( var n in array ) output[ array[n][field]  ] = array[n];

        return output; 
    };

    public static parse( value:any )
    {
        if( value )
        {
            try{
                var json = JSON.parse( value ); 
 
                return json;
            }catch(e){
                log( "----------JSON PARSE ERROR---------", value );  
            }
            return {};
        }
        return {};
    };

    public static rotate( grid:[], times:number= 0 ) : []
    {
        var times           = times == null ? RANDOM.value(3) : times; 
        var newGrid : []    = [];
        var rowLength       = Math.sqrt(grid.length);
        newGrid.length      = grid.length;

        for (var i = 0; i < grid.length; i++)
        {
            //convert to x/y
            var x       = i % rowLength;
            var y       = Math.floor(i / rowLength);

            //find new x/y
            var newX    = rowLength - y - 1;
            var newY    = x;

            //convert back to index
            var newPosition = newY * rowLength + newX;
            newGrid[newPosition] = grid[i];
        }

        if( times > 0 ) return ARRAY.rotate( newGrid, times-1 );

        return newGrid;
    };
 
    public static flip( grid:[] ) : []
    {
        var output : [] = [];
        var n       = 0;
        var side    = Math.sqrt( grid.length ); 

        for( var y=0; y<side; y++ ) 
        {
            var line : any = [];
            for( var x=0; x<side; x++ ) line.push( grid[ n++ ] );
            ARRAY.push( line.reverse(), output );
        }

        return output;
    };

    public static findItemByAttribute( array:[], attribute:string, value?:any )
    {
        for( var n in array ) if( array[n][ attribute ] == value ) return array[n];
    };

    public static salchiche( array:[], andReverse:boolean=false )
    {
        var output : any = ARRAY.clone( array );

        var halve = [];

        while( halve.length< output.length ) halve.push( output.shift() );

        if( andReverse ) halve = halve.reverse();

        while( halve.length ) output.push( halve.shift() );

        return output;
    };

    public static mirror( array:any, length:number=0 )
    {
        array = ARRAY.clone( array );

        var halve = [];

        length = length || array.length;

        while( halve.length < length ) halve.push( array.shift() );

        var halve2 : any = ARRAY.clone( halve );

        halve2 = halve2.reverse();

        while( halve2.length ) halve.push( halve2.shift() );
 
        return halve;
    };

    public static contains( array:any, value:any )
    {
        return array.indexOf( value ) != -1; 
    };

    public static getCue( array:any, source:any )
    {
        if( !array.length ) ARRAY.push( ARRAY.shuffle( source ), array ); 
        return array.shift();
    };

    public static toString( array:any ) : string
    {
        var output : string = "";
        for( var n in array ) output += array[n];
        return output;
    };

    public static isArray( a:any )
    {
        return Array.isArray( a );
    }
    
    public static trim ( array:[], amount:number=0 )
    {
        var output : [] = [];
        var amount = amount || array.length;
        for( var n =0; n<amount; n++ ) if( array[n] != null ) output.push( array[n] );
        return output;
    };
    
    public static cycle ( array:[], pos:number=0, amount:number=1, increment:number=1 )
    {
        var output  = [];
        var laps    = 0;
        
        while( amount )
        {
            pos += increment;
            
            if( pos >= array.length ) 
            {
                pos -= array.length;
                laps ++;
            }
            
            output.push( pos );
            
            amount--;
        }
        
        return output;
    };

    public static getClamp( array:[], position:number=0 )
    {
        if( position >= array.length ) return array[ array.length-1 ];
        return array[ position ];
    };
}

export default ARRAY;
 
export var merge            = ARRAY.merge;
export var extract          = ARRAY.extract;
export var push             = ARRAY.push;
export var isArray          = ARRAY.isArray;
export var pushUnique       = ARRAY.pushUnique;
export var getRandomItem    = ARRAY.getRandomItem;
export var removeItem       = ARRAY.removeItem;
export var shuffle          = ARRAY.shuffle;
export var copy             = ARRAY.copy;
export var sort             = ARRAY.sort;
 
 
 