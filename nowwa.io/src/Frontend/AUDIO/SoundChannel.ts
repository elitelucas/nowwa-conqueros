import RANDOM from "../../UTIL/RANDOM";
import {Howl, Howler, Sound} from 'howler';
import Sounds from "./Sounds";
import ARRAY from "../../UTIL/ARRAY";

class SoundChannel
{
    private Sounds      : Sounds;
    private isMulti     : boolean;
    private id          : string;
    private group       : string;
    private current     : any;
    private url         : string = "https://supersnappy.io/artlib/audio/";
    public pool         : any = {};
    private isMuted     : any = false;

    private lastPlayed  : any;
    private currentName : any;

    constructor( Sounds:Sounds, id:string, group:string, isMulti:boolean )
    {
        this.Sounds     = Sounds;
        this.isMulti    = isMulti;
        this.id         = id;
        this.group      = group;
    };

    public play( array:any, vars?:any )
    {
        if( !Array.isArray( array ) ) return this.doPlay( array, vars );

        var sounds = [];

        for( var n in array ) 
        {
            sounds.push( this.doPlay( array[n], vars ) );
            return sounds;
        }
    };
 
    public pause()
    {
        this.lastPlayed = this.currentName;
        self.stop();
    }

    public resume()
    {
        if( this.lastPlayed ) this.play( this.lastPlayed );
    }
 
    public stop( name?:any )
    {
        if( name )
        {
            if( this.pool[name] ) this.pool[name].stop();
            if( this.currentName == name ) this.currentName = this.current = null;
            return;
        }

        for( name in this.pool ) this.pool[ name ].stop();

        this.currentName = this.current = null;
    }

    public loop( name:string, vars?:any )
    {
        vars        = vars || {};
        vars.loop   = true;

        return this.play( name, vars );
    }

    public playPitch( name:string, vars?:any )
    {
        vars        = vars || {};
 
        return this.play( name, ARRAY.extract( { rate: 1.2 + RANDOM.spectrumDecimal( 0.4 ) }, vars ));
    }
 
    public playPitchSmall( name:string, vars?:any )
    {
        vars        = vars || {};
 
        return this.play( name, ARRAY.extract( { rate: 1 + RANDOM.spectrumDecimal( 0.12) }, vars ));
    }
 
    public mute( bool?:boolean )
    {
        this.isMuted = bool;
 
        if( !this.currentName ) return;
 
        if( this.isMuted || this.group != "music" ) return;

        this.doPlay( this.currentName );
    }

     /*============================ 




    PLAY, SEARCH, INDEX




    =============================*/

    public doPlay( label:string, vars?:any )
    {
        if( this.Sounds.isMuted || ( !this.isMulti && this.current == label ) ) return;
 
        if( !this.isMulti ) this.stopCurrent();

        vars            = vars || {};
        this.current    = label;

        vars.loop       = vars.loop || false;

        if( this.id == "voice" ) vars.rate = 1 + RANDOM.decimal( 0.08 );

        let sound : any = this.get( label, vars );

        if( vars.volume ) sound.volume = vars.volume;

        sound.playID = sound.play();

        if( this.group == "music" ) this.fadeIn( sound );

        return sound;
    }

    private get( label:string, vars:any ) : Howl
    {
        this.currentName = label;

        if( vars.random ) this.currentName += RANDOM.value( vars.random, 1 );

        let sound : Howl = this.pool[ this.currentName ];

        if( sound ) return sound;

        let isMusic = this.group == "music";
 
        sound = this.pool[ this.currentName ] = new Howl(
        {
            src         : [ this.url + "/" + this.id + "/" + this.currentName + '.mp3' ],
            html5       : isMusic,
            loop        : isMusic || vars.loop,
            autoplay    : !this.isMuted 
        }); 
 
        return sound;
    }

    private stopCurrent()
    {
        let sound : Howl = this.pool[ this.currentName ];
        if( !sound ) return;
        
        if( this.group == "music" ) return this.fadeOut( sound );
        
        sound.stop();

        this.currentName = this.current = null;
    }
 
    private fadeIn( sound:any )
    {
        sound.fade(1, 0, 1000, sound.playID );
    }

    private fadeOut( sound:any )
    {
        sound.fade(0, 1, 1000, sound.playID );
    }
}

export default SoundChannel;