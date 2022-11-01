class RANDOM
{
    public static value( max:number, min:number=0, avoid?:number ):number
    {
        var value = Math.round( Math.random() * ( max - min ) ) + min; 
        return value != avoid ? value : RANDOM.value( max, min, avoid );
    };

    public static decimal( max:number, min:number=0 ):number
    {
        return Math.random() * ( max - min ) + min;
    };

    public static int( min:number = 999, max:number = 0 ):number
    {
        min = Math.ceil(min);
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    };
 
    public static chance( probability:number=0.5 ):boolean
    {
        if( probability === 0 ) return false; 
        return Math.random() <=  probability;
    };

    public static spectrum( max:number, min:number=0 ):number
    {
        var val = RANDOM.value( max, min );
        return RANDOM.chance(0.5) ? val : -val; 
    };

    public static spectrumDecimal( max:number, min:number=0 ):number
    {
        var val = RANDOM.decimal( max, min );
        return RANDOM.chance(0.5) ? val : -val; 
    };
 
    public static boolean():boolean
    {
        return RANDOM.chance() ? true : false; 
    };

    public static direction():number
    {
        return RANDOM.chance() ? 1 : -1 ;
    };

    public static fortune( amount:number ):number
    {
        for( var n=0; n<amount; n++ ) if( RANDOM.chance( ( 1/(amount*2) ) * ( amount-n ) ) ) return n; 
        return 0;
    };
};

export default RANDOM;