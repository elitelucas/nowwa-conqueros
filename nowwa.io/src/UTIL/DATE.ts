import STRING from "./STRING";

class DATE
{
 
    public static getTime()
 	{
 		return Date.now();
 	};
    
    public static getNow()
    {
        return Date.now();
    };

    public static now()
    {
        return DATE.getNow();
    }

    public static today()
    {
        let now = new Date( this.now() );
        return now.getTime() - now.getHours()*3600000 - now.getMinutes()*60000 - now.getSeconds()*1000 - now.getMilliseconds();
    }

    public static daysFrom( timestamp:number )
 	{
        return Math.floor( DATE.millisecondsFrom( timestamp ) / 86400000 ); 
    };	
    
    public static hoursFrom( timestamp:number )
 	{
  		return Math.floor( DATE.fractionHoursFrom( timestamp ) ); 
 	};	

    public static fractionHoursFrom( timestamp:number ) : number
    {
        return DATE.millisecondsFrom( timestamp ) / 3600000;
    };

    public static secondsFrom( timestamp:number ) : number
 	{
  		return Math.floor( DATE.millisecondsFrom( timestamp ) / 1000 ); 
 	};	
    
    public static millisecondsFrom( timestamp:number )
 	{
    	return DATE.getNow() - timestamp;
 	};	
    
    public static format( thedate:any )
 	{
 		return thedate.getFullYear() +"."+thedate.getMonth()+"."+thedate.getDate(); 
 	};
    
    public static days( millisecs:number ) 
    {  
        if( millisecs < 1000 ) return Math.round( millisecs ) +"msec ";
 
        var seconds : number = Math.round( millisecs/1000 ); 
        
        var days = 0;
        var hours = 0; 
        var minutes = 0;
        
        while( seconds >= 86400 ) 
        {
            days ++;
            seconds -= 86400;
        }
        
        while( seconds >= 3600 ) 
        {
            hours ++;
            seconds -= 3600;
        }
        
        while ( seconds >= 60 ) 
        {
            seconds -= 60;
            minutes++;
        }
 
        var string : any = [];
        
        if( days ) string.push( days + "D" ); 
 
        if( hours ) string.push( hours + "H" ); 
        
        if( days ) return string.join(" ");
        
        if( minutes ) string.push(minutes + "Min");
        
        if ( hours ) return string.join(" ");
        
        if ( seconds ) string.push( STRING.fillZero( seconds, 1 )  +"sec" );
 
        return string.join(" ");
    };
    
    public static seconds( secs:number ) : any
    {
        var hours = 0; 
        var minutes = 0;
        var seconds = Math.round(secs); 
        
        while ( seconds >= 60) 
        {
            seconds -= 60;
            minutes++;
        }
        
        while ( minutes >= 60) 
        {
            minutes -= 60;
            hours ++;
        }
        
        var string = "";
        
        if( hours ) 
        {
            return STRING.fillZero( hours, 1 ) + ":" + STRING.fillZero( minutes, 1 ) + STRING.fillZero( seconds, 1 ); 
              
        }else if( minutes ){

            return STRING.fillZero( minutes, 1 ) + ":" + STRING.fillZero( seconds, 1 );
        }

        return "0:" + STRING.fillZero( seconds, 1 );
    };
    
    public static millisecondsToSeconds( milliseconds:number ) : number
    {
        return milliseconds / 1000;
    };
    
    public static mts( ms:number ) : number
    {
        return DATE.millisecondsToSeconds( ms );
    };    
    
    public static secondsToMinutes( seconds:number ) : number
    {
        return seconds / 60;
    };
    
    public static millisecondsToMinutes( milliseconds:number ) : number
    {
        return Math.ceil( milliseconds / 60000 );
    };

    public static today (): number {
        
        let now = new Date(Date.now());
        return now.getTime() - now.getHours()*3600000 - now.getMinutes()*60000 - now.getSeconds()*1000 - now.getMilliseconds();
    }
};

export default DATE;