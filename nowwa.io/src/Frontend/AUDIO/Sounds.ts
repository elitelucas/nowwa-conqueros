
import SoundChannel from './SoundChannel';

class Sounds
{
   // const {Howl, Howler} = require('howler');

   public SFX       : SoundChannel;
   public Voice     : SoundChannel;
   public Music     : SoundChannel;
   public Ambiance  : SoundChannel;

   public volume    : number = 1;
 
   private channels : any = {};

   public isMuted   : boolean = false;
 
   constructor()
   {
        this.SFX        = this.addChannel( "sfx", "Sound", true );
        this.Voice      = this.addChannel( "voice", "Sound", true );
        this.Music      = this.addChannel( "music", "Music", false );
        this.Ambiance   = this.addChannel( "amb", "Music", false );
   };

   private addChannel( id:any, b:any, c:any )
   {
        let channel : SoundChannel = this.channels[ id ] = new SoundChannel( this, id, b, c );
        return channel;
   };

   public setVolume( vol:number )
   {
        this.volume = vol;
   }

   public mute()
   {
        this.isMuted = true;
   }

   public unmute()
   {
        this.isMuted = false;
   }
 
}

export default Sounds;

