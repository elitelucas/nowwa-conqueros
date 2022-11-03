import MATH from "./MATH";
import LOG, { log } from "./LOG";

class STRING
{
    public static contains( text:string, string:string ) : boolean
    {
        return text.toLowerCase().indexOf( string.toLowerCase() ) != -1;
    };

    public static containsStrict( text:string, string:string ) : boolean
    {
        return text.indexOf( string ) != -1;
    };
        
    public static split( text:string, string:string ) : string
    {
        return text.toLowerCase().split( string.toLowerCase() )[0];
    };
        
    public static displaySign( number:number, msg:string )
    {
        var text  = number > 0 ? "+"+ number : number; 
        if ( msg ) text += " " + msg; 
        
        return text; 
    };
        
    public static trim( str:string ) 
    {           
        while (str.charAt(0) == " ") str = str.substr(1);
        while (str.charAt(str.length - 1) == " ") str = str.substr(0, -1);
        return str;
    };

    public static lTrim( str:string ) : string 
    {           
        while( str.charAt(0) == " " ) str = str.substr(1);
        return str;
    };

    public static rTrim( str:string ) :string
    {           
        while( str.charAt(str.length - 1) == " " ) str = str.substr(0, -1);
        return str;
    };
        
    public static string( char:string, repeat:number=1 ) : string
    {
        if( repeat <= 0) return "";
        var r = "";
        for (var i = 0; i < repeat; i++) r += char;
        return r;
    };
      
    public static validateEmail( email:string )
    {
        var EMAIL_REGEX = /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        return email.match( EMAIL_REGEX );
    };
        
    public static beginsWith( input:string, prefix:string )
    {           
        return prefix == input.substring( 0, prefix.length );
    };
        
    public static getPrefix( text:string, separator:string="_", toLowerCase:boolean=false ) 
    {
        var output = text.split( separator )[0];
        if( toLowerCase ) output.toLowerCase();
        return output;
    };

    public static endsWith( input:string, suffix:string )
    {
        return suffix == input.substring(input.length - suffix.length);
    };
 
    public static getArray( str:string, divider:string=" " )
    {
        if( !str ) return[0];

        divider             = divider || ",";
        var array : any     = STRING.doReplace( str+"", " ", "" ).split( divider );
 
        for( var n in array ) array[n] = MATH.tryParseInt( array[n] );
    
        return array;
    };

    public static doReplace( string:string, srch:string, replaceWith:string )
    {
        return string.split( srch ).join( replaceWith );
    };

    public static removeVowels( str:string, minLength:number=3 )
    {
        if( str.length <= minLength ) return str;

        return str.replace(/[AEIOUaeiou-]/gi, '');//01234567890
    };

    public static getFileExtension( target:string ) 
    {
        return target.substring( target.lastIndexOf(".")+1, target.length).toLowerCase();
    };
        
    public static containsKeys( txt:string, keywords:string ) 
    {
        if( !keywords ) return false; 
        
        var keys    =   keywords.split(","); 
        var text    =   txt.toLowerCase() ;
        
        for ( var n in keys ) if( text.indexOf( keys[n]) != -1 ) return true;
    };

    public static replace( string:string, srch:any, replaceWith:string ) 
    {
        if( !string ) return null;

        if( typeof srch == "string" && replaceWith ) return STRING.doReplace( string, srch, replaceWith );
 
        for( var name in srch )
        {
            var suffix = "";
            var prefix = "";

            if( name == "percent" ) suffix = "%";
            if( name == "USD" ) prefix = "$";

            string = STRING.doReplace( string, "{" + name + "}", prefix + srch[name] + suffix );
        }

        return string;
    };

    public static excludeChars( target:string, chars:string ) 
    {
        var txt     = "", valid;
        var chars   = chars || ":,<>-'{}[]/*-+!;8!@#$%.^&*()";

        for( var c = 0; c<target.length; c++ ) 
        {
            valid = true;

            for( var z = 0; z<chars.length; z++)
            {
                if (target.charAt(c) == chars.charAt(z)) {
                    valid = false;
                    break;
                }
            }
            
            if( valid ) txt += target.charAt(c);
        }
        return txt;
    };
 
    public static extractKeywords( text:string, length:number=0 )
    {
        var validChars  = "abcdefghijklmnopqrstuvwxyz";
        var output      = [];
        var max         = text.length;
        var text        = text.toLowerCase();
        var string       = "";
        
        for( var n = 0; n< max; n++ )
        {
            var char    =   text.charAt( n );
            
            if( validChars.indexOf( char ) != -1 )
            {
                string += char;
            }else{
                
                if( string.length > length ) output.push( string );
                string = "";
            }
        }
        
        return output;
    };
     
    public static fillZero( input:number, zeros:number=1 ) : string
    {
        var string  = input +"";
 
        while ( string.length <= zeros ) string = "0"+string;

        if( string == "0" ) string ="00";

        return string;
    };

    public static formatRank( input:number ) : string
    {
        var append :string = "th";
 
        if ( input == 1 ) append = "st";
        if ( input == 2 ) append = "nd";
        if ( input == 3 ) append = "rd";
 
        return input + append;
    };

    public static commas( num:any, interval:number=3 ) 
    {
        num = num + "";
 
        var output = "";
        var str;
        var c = 0;
        
        for (var n = num.length-1; n>=0; n--) 
        {
            str = "";

            if( ++c >= interval && n>0 ) 
            { 
                c = 0;
                str =" "; 
            };
            str += num.charAt(n);
            output = str+output;
        }
 
        return output; 
    };

    public static toDollars( value:number, sign:string="$", divider:any = 1 ) : string 
    {
        var isNeg       = value < 0;
 
        var formatted   = sign + STRING.commas( Math.abs( Math.round( value/divider ) ) );
        if( isNeg ) formatted = "-" + formatted;
        return formatted;
    };
  
    public static simplify( string:any )
    {
        var output = "";
        var vowels = "aeiou";
        var string = string.toLowerCase(); 

        for( var n in string ) if( vowels.indexOf( string[n] ) ==-1 ) output += string[n];

        return output;
    };

    public static toArray( string:any, isInt:boolean )
    {
        var output : any = [];

        if( !string ) return output;

        for( var n in string ) 
        {
            var value =  string[n];
            if( isInt ) value = parseInt( value );
            output.push( value );
        }
        return output;   
    };
    

    public static commarize( number:number, asObject:boolean ) 
    {
        if( !MATH.isNumber( number ) ) return number;
 
        var num         = Math.round( number );
        var unitname    = "";

        if ( num >= 1e3 ) 
        {
            var unit    = Math.floor(((number).toFixed(0).length - 1) / 3) * 3;
            num         = Math.floor( num / ( eval( '1e' + unit ) * 100 ) ) / 100;
            unitname    = STRING.capitalize( STRING.units[ Math.floor( unit / 3 ) - 1 ] ) ;
        }else{
            
            num         = Math.floor( num * 100 ) / 100;
        }
        
        var object : any = { number:num, value:num, unit:unitname ||  "" };
        
        if( unitname ) unitname = ""+ unitname;
 
        var formatted = num + unitname;
        
        object.formatted = formatted;
        
        return asObject ? object : formatted;
    };
    
    public static capitalize( s:any ) : string 
    {
        if ( typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };
    
    public static stringify( object:any ) 
    {
        var json;
      
        try {
            
            json = JSON.stringify( object );
            
        }catch(err) 
        {
            return log( "JSON ENCODE FAILED" );
        }

        return json;
        
    };

    public static random( Length:number = 10 )
    {
        let result          = '';
        let alphabetLength  = STRING.ALPHABET.length;
        
        for ( let i = 0; i < Length; i++ ) result += STRING.ALPHABET.charAt(Math.floor(Math.random() * alphabetLength));
 
        return result;
    };
};

namespace STRING
{
    export const ALPHABET : string      = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    export const unitsLarge : string [] = ["thousand","million","billion","trillion","quaddrillion","quintillion","sextillion","septillion","octillion","nonillion","decillion","undecillion","duodecillion","tredecillion","quattuordecillion","quindecillion","sexdecillion","septdecillion","octodecillion","novemdecillion","vigintillion","unvigintillion","duovigintillion","trevigintillion","quattuorvigintillion","quinvigintillion","sexvigintillion","septvigintillion","octovigintillion","novemvigintillion","trigintillion","untrigintillion","duotrigintillion","googol","tretrigintillion","quattuortrigintillion","quintrigintillion","sextrigintillion","septtrigintillion","octotrigintillion","novemtrigintillion","quadragintillion","unquadragintillion","duoquadragintillion","trequadragintillion","quattuorquadragintillion","quinquadragintillion","sexquadragintillion","septquadragintillion","octoquadragintillion","novemquadragintillion","quinquagintillion","unquinquagintillion","duoquinquagintillion","trequinquagintillion","quattuorquinquagintillion","quinquinquagintillion","sexquinquagintillion","septquinquagintillion","octoquinquagintillion","novemquinquagintillion","sexagintillion","unsexagintillion","duosexagintillion","tresexagintillion","quattuorsexagintillion","quinsexagintillion","sexsexagintillion","septsexagintillion","octosexagintillion","novemsexagintillion","septuagintillion","unseptuagintillion","duoseptuagintillion","treseptuagintillion","quattuorseptuagintillion","quinseptuagintillion","sexseptuagintillion","septseptuagintillio","octoseptuagintillion","novemseptuagintillion","octogintillion","unoctogintillion","duooctogintillion","treoctogintillion","quattuoroctogintillion","quinoctogintillion","sexoctogintillion","septoctogintillion","octooctogintillion","novemoctogintillion","nonagintillion","unnonagintillion","duononagintillion","trenonagintillion","quattuornonagintillion","quinnonagintillion","sexnonagintillion","septnonagintillion","octononagintillion","novemnonagintillion","centillion"];
    export const units : string []      = ["k","M","B","T","qd","Qn","sx","Sp","O","N","decillion","undecillion","duodecillion","tredecillion","quattuordecillion","quindecillion","sexdecillion","septdecillion","octodecillion","novemdecillion","vigintillion","unvigintillion","duovigintillion","trevigintillion","quattuorvigintillion","quinvigintillion","sexvigintillion","septvigintillion","octovigintillion","novemvigintillion","trigintillion","untrigintillion","duotrigintillion","googol","tretrigintillion","quattuortrigintillion","quintrigintillion","sextrigintillion","septtrigintillion","octotrigintillion","novemtrigintillion","quadragintillion","unquadragintillion","duoquadragintillion","trequadragintillion","quattuorquadragintillion","quinquadragintillion","sexquadragintillion","septquadragintillion","octoquadragintillion","novemquadragintillion","quinquagintillion","unquinquagintillion","duoquinquagintillion","trequinquagintillion","quattuorquinquagintillion","quinquinquagintillion","sexquinquagintillion","septquinquagintillion","octoquinquagintillion","novemquinquagintillion","sexagintillion","unsexagintillion","duosexagintillion","tresexagintillion","quattuorsexagintillion","quinsexagintillion","sexsexagintillion","septsexagintillion","octosexagintillion","novemsexagintillion","septuagintillion","unseptuagintillion","duoseptuagintillion","treseptuagintillion","quattuorseptuagintillion","quinseptuagintillion","sexseptuagintillion","septseptuagintillio","octoseptuagintillion","novemseptuagintillion","octogintillion","unoctogintillion","duooctogintillion","treoctogintillion","quattuoroctogintillion","quinoctogintillion","sexoctogintillion","septoctogintillion","octooctogintillion","novemoctogintillion","nonagintillion","unnonagintillion","duononagintillion","trenonagintillion","quattuornonagintillion","quinnonagintillion","sexnonagintillion","septnonagintillion","octononagintillion","novemnonagintillion","centillion"];
};

export default STRING;

export var replace = STRING.replace;

 