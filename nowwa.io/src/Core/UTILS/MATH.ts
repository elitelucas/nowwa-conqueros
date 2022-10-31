import Vec2 from "./Instances/Vec2";
import Vec3 from "./Instances/Vec3";
import Mat4 from "./Instances/Mat4";
 
class MATH
{
	public static hipotenusa( pointA:any, _pointB:any ) : number
	{
		var pointB  = _pointB || { x:0, y:0 };
        var dx      = pointB.x - pointA.x;
        var dy      = pointB.y - pointA.y;
        
		return Math.sqrt(dx*dx+dy*dy);
	};

	public static hipotenusaZ( pointA:any, pointB:any ) : number 
	{
        var dx      = pointB.x - pointA.x;
        var dz      = pointB.z - pointA.z;
        
		return Math.sqrt( dx*dx+dz*dz );
	};

    public static distanceNoSquare( pointA:any, pointB:any ) : number
    {
        var x = pointB.x - pointA.x;
        var y = pointB.y - pointA.y;
        
		return x * x + y * y; 
    }; 
    
	public static cycle( value:number, max:number=100, min:number=0, incremental:number=1 ) : number
	{
        value 		+= incremental;

		while( value > max ) 	value -= max + incremental;
		while( value < min ) 	value += max + incremental;

		return value; 
	};

	public static getSinCos( pointA:any, pointB:any ) : Vec2
    {
        var dx  =   pointB.x - pointA.x;
        var dy  =   pointB.y - pointA.y; 
        var h   =   Math.sqrt(dx*dx+dy*dy);

        var cos =  dx/h; 
        var sin =  dy/h;

        return new Vec2( cos, sin );
    };
    
    public static getSinCosZ( pointA:any, pointB:any ) : any
    {
        var dx  =   pointB.x - pointA.x;
        var dz  =   pointB.z - pointA.z; 
        var h   =   Math.sqrt( dx*dx+dz*dz );
 
        return { sin: dz/h, cos: dx/h };
    };
 
	public static aroundRadius( radius:number, radians:number ) 
	{
		return { x:radius * Math.cos( radians ), y:radius * Math.sin( radians )};
	};
    
    public static lerp( value1:number, value2:number, amount:number ) : number
    {
        var amount = MATH.hardLimit( amount, 0, 1 );
        return value1 + (value2 - value1) * amount;
    };
 
    public static round( value:number ) : number
    {   
        for( var n in MATH.factors ) if( value > MATH.factors[n] ) return roundFactor( value, MATH.factors[n] );

        return value;
 
        function roundFactor( value:number, factor:number )
        {
            return Math.round( value / factor ) * factor ;
        }
    };
 
	public static ceil( number:number, max:number ) : number
	{
		return number > max ? max : number ; 
	};

	public static getPercent( number:number, max:number ) : number
	{
		return MATH.hardLimit( number * 100 / max, 0, 100 );
	};

	public static hardLimit( number:number, min:number, max:number ) : number
	{
		return MATH.clamp( number, max, min ); 
	};

	public static clamp( number:number, max:number, min:number=0 ) : number
	{
		if( number < min  ) return min; 
		if( max && number > max ) return max; 

		return number ;
	};
 
	public static floor( number:number, min:number ) : number
	{
		return number < min ? min : number;  
	};

	public static commas( value:number ) : string
	{
       return typeof value == 'number' ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : value;    
	};

    public static isNumber( value:any ) : boolean
	{
       return typeof value == 'number';    
	};
    
    public static forceNumber( value:any ) : number
    {
        if( !value ) return 0;
        
        var int = parseInt( value );
        
        return MATH.isNumber( int ) ? int : 1;
    };

    public static tryParseInt( value:any ) : number
    {
        var parsed = parseInt( value );

        return isNaN( parsed ) ? value : parsed;
    };

    public static parseInt( string:any ) : number
    {
        string = string.toString();
      
        if( string.indexOf( "E+" ) == -1 ) return parseInt( string );
  		      
        var array = string.split( "E+" );
 
        var first = array[0].split('.');
      
         var zeroes = parseInt( array[1] );
 
        if( first[1] ) first[0] += first[1];
        
        var value = first[0] ;
 
        for( var n=0; n< zeroes; n++ ) value += "0";
 
        return parseInt( value );
    };
 
	public static middlePoint( pointA:any, pointB:any ) : any
	{
		var x = pointA.x + ( pointB.x - pointA.x ) / 2; 
		var y = pointA.y + ( pointB.y - pointA.y ) / 2; 

		return { x:x, y:y };
	};

	public static getRotation( container:any={ x:0, y:0 }, lookat:any={ x:0, y:0 } ) : any
	{
		return MATH.radiansToDegree( Math.atan2( lookat.y-container.y, lookat.x-container.x ) ) + 90; 
	};
 
    
    public static distance( A:number, B:number ) : number
	{
        return B - A;
	};
 
	public static degreeToRadians( degree:number ) : number
	{
		return ( degree || 0 ) * 0.0174533;
	};

	public static radiansToDegree( radian:number ) : number
	{
		return radian / 0.0174533;
	};
 
	public static pointToIso( from:any, to:any={} ) : number
	{
		to.x = ( from.x - from.y ) * 0.5 ;
		to.y = ( from.x + from.y ) * 0.289;  
		return to ;
	};

	public static isoToPoint( iso:any, normal:any={} ) : number
	{
		normal.x = ( iso.y / 0.289 + iso.x / 0.5 )/2;
		normal.y = ( iso.y / 0.289 - iso.x / 0.5 )/2;
		return normal; 
	};
 
	public static getclosestPoint( lx1:number, ly1:number, lx2:number, ly2:number, px:number, py:number) : any
	{
		var oy  = ly2 - ly1; 
		var ox  = lx1 - lx2; 
		var det = oy*oy + ox*ox; 

		if( det === 0 ) return undefined;
		
		var C1 = oy*lx1 + ox*ly1; 
		var C2 = -ox*px + oy*py; 

		return [
			(oy*C1 - ox*C2)/det,
			(oy*C2 + ox*C1)/det
		];
	};

	public static higherValue( a:number, b:number ) : number
	{
		return a > b ? a : b; 
	};

	public static lowerValue( a:number, b:number ) :number
	{
		return a < b ? a : b; 
	};

	public static tsunami( pointA:any, pointB:any, aura:number=500 ) : any
	{
		var dx 	= 	pointB.x - pointA.x; 
		var dy 	= 	pointB.y - pointA.y;
		var h	=	Math.sqrt( dx*dx + dy*dy );

		if( h == 0 ) return false;

		if( h > aura ) return false; 

		var cos = 	dx/h;
		var sin = 	dy/h;

		dx = pointB.x;
		dy = pointB.y;
 
		if( h < aura / 2 )
		{
			dx += cos * h / 2;  
			dy += sin * h / 2;
			
			return {x:dx, y:dy};
		} 

		dx += cos * ( aura - h ) / 2;  
		dy += sin * ( aura - h ) / 2;
			
		return {x:dx, y:dy};
	};

	public static isBetween( value:number, min:number, max:number ) : boolean
	{
		return !( value < min || value > max );
	};

	public static isBetweenAB( aMin:number, aMax:number, bMin:number, bMax:number ) : boolean
	{
		return !( aMax < bMin || aMin > bMax );
	};

	public static isBetweenAABB( aMin:number, aMax:number, bMin:number, bMax:number, cMin:number, cMax:number, dMin:number, dMax:number ) : boolean
	{
		return !( aMax < bMin || aMin > bMax || cMax < dMin || cMin > dMax );
	};

	public static getClosest( array:any, to:any = { x:0, y:0 } ) : number
	{
		var closest 	= null ;
		var distance 	= 9999999999999;

		for( var n in array )
		{
			var point 	= array[n];
			var dist 	= MATH.hipotenusa( point, to );

			if( dist > distance ) continue;

			distance 	= dist;
			closest 	= point; 	
		}

		return closest; 
	};
 
	public static roundDecimal( value:number, decimals:number=10 ) : number
	{
		return Math.round( value * decimals ) / decimals;
	};
    
    public static getSign( value:number ) : number
	{
		return value < 0 ? -1 : 1;
	};
    
    public static double( value:number, times:number=1 ) : number
    {
        while( --times >=1 ) value *= 2;
        
        return value;
    };
    
    public static getMiddlePoint( points:any ) : Vec2
    {
        var left;
        var right;
        var top;
        var bottom;

        for( var n in points )
        {
            var point = points[n];
            
            if( !left || point.x < left ) left = point.x;
            if( !right || point.x > right ) right = point.x;
            if( !bottom || point.y < bottom ) bottom = point.y;
            if( !top || point.y > top ) top = point.y;
        }

        return new Vec2( left + (right - left)/2, bottom + (top - bottom)/2 );
    };
    
    public static normalizePoints( points:any ) : any
    {
        var center = MATH.getMiddlePoint( points );
        
        for( var n in points )
        {
            var point = points[n];
            
            point.x -= center.x;
            point.y -= center.y;
        }
        
        return points;
    };
 
    /*
    public static normalizeAndShiftPoints( points:any, side:number, scale:number ) : number
    {
        if( scale === undefined ) scale = 1;

        const center = MATH.v1;
        const dir = MATH.v2;
        
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for ( let n = 0, nl = points.length; n < nl; ++n ) 
        {
            const p = points[n];
            
            p.x = p.x / side;
            p.y = p.y / side;
            
            if( p.x < minX ) minX = p.x;
            if( p.y < minY ) minY = p.y;
            
            if( p.x > maxX ) maxX = p.x;
            if( p.y > maxY ) maxY = p.y;            
        }
        
        const cx = minX + (maxX - minX) / 2;
        const cy = minY + (maxY - minY) / 2;
        
        center.set(cx, cy);
        
        for (let n = 0, nl = points.length; n < nl; ++n) {
            const p = points[n];
            
            dir.set(0, 0, 0).sub(center).normalize();
            
            const dist = center.distance( Vec2.ZERO);
            
            const move = dir.mulScalar(dist);
            
            p.add( move ).mulScalar( scale );
        }
        
        return points;
    };
 
    public static angle( from:any, to:any )
    {
        const denom = Math.sqrt(from.length() * to.length());
        if (denom < 1e-15) return 0;

        const dot = pc.math.clamp(from.dot(to) / denom, -1, 1);
       // return Math.acos(dot) * pc.math.RAD_TO_DEG;
    };
 
    public static signedAngle( from, to, axis ) : number
    {
        const unsignedAngle = MATH.angle( from, to );

        const x = from.y * to.z - from.z * to.y;
        const y = from.z * to.x - from.x * to.z;
        const z = from.x * to.y - from.y * to.x;
        const sign = Math.sign(axis.x * x + axis.y * y + axis.z * z);
        return unsignedAngle * sign;
    };

    */
 
    public static gain( x:number, k:number ) : number
    {
        const a = 0.5*Math.pow(2.0*((x<0.5)?x:1.0-x), k);
        return (x<0.5)?a:1.0-a;
    };
 
    public static randomSpherePoint( radius:number ) : Vec3
    {
       var u        = Math.random();
       var v        = Math.random();
       var theta    = 2 * Math.PI * u;
       var phi      = Math.acos( 2 * v - 1 );
       var x        = radius * Math.sin( phi ) * Math.cos( theta );
       var y        = radius * Math.sin( phi ) * Math.sin( theta );
       var z        = radius * Math.cos( phi );
        
       return new Vec3( x, y, z );
    };
 
   
 
};

namespace MATH
{
   // export const v1 : Vec2      = new Vec2( 0,0 ); 
   // export const v2 : Vec2      = new Vec2( 0,0 ); 
   // export const v3 : Vec3      = new Vec3( 0,0,0 ); 
   // export const mat4 : Mat4    = new Mat4( 0,0,0,0 ); 
    export const factors        = [ 1000, 500, 100, 50, 10, 5 ];
}
 
export default MATH;
