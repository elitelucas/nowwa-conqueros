
import SoundChannel from './SoundChannel';
import { Howler, Howl } from 'howler';

class Sounds
{
   // const {Howl, Howler} = require('howler');

   public SFX       : SoundChannel;
   public Voice     : SoundChannel;
   public Music     : SoundChannel;
   public Ambiance  : SoundChannel;

   private channels : any = {};

   public isMuted   : boolean = false;
 
   constructor()
   {
        this.SFX        = this.addChannel( "sfx", "sound", true );
        this.Voice      = this.addChannel( "voice", "sound", true );
        this.Music      = this.addChannel( "music", "music", false );
        this.Ambiance   = this.addChannel( "amb", "music", false );
   };

   private addChannel( id:any, b:any, c:any )
   {
        let channel : SoundChannel = this.channels[ id ] = new SoundChannel( this, id, b, c );
        return channel;
   };

   public setVolume( vol:number )
   {
        Howler.volume( vol );
   }

   public mute()
   {
        Howler.mute( true );
   }

   public unmute()
   {
        Howler.mute( false );
   }
 
}

export default Sounds;

