class COOKIE
{
    public static load = function( key:string ) : any
    {	
        var name            = key + "=";
        var ca              = decodeURIComponent( document.cookie ).split(';');
        var value           = "";
        var result : any    = {};
        
        for( var i = 0; i < ca.length; i++ ) 
        {
            var c = ca[i];
            
            while( c.charAt(0) == ' ' ) c = c.substring(1);
            
            if( c.indexOf( name ) === 0 ) 
            {
                value = unescape( c.substring( name.length, c.length ) );
                break;
            }
        }

        result[ key ] = value === "" ? "{}" : value;
 
   		return result;
    };
 
    public static save = function( key:string, _value:any ) 
    {
        document.cookie = key + "=" + escape( _value ) + ";path=/";
     //   log("SAVE COOKIE", value );
    };
}

export default COOKIE;