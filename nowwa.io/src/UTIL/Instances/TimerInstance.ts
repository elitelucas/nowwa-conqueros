import DATE from "../DATE";
 
class TimerInstance
{
    public duration         : number = 0;
    public isPlaying        : boolean = false;
    public percent          = 100;
    public update           : any;
    public _id              : any;
    public start            : any;
    public restart          : any;
    public stop             : any;
    public increase         : any;
    public pause            : any;
    public resume           : any;
    public onSecond         : any;
    public setAuto          : any;
    public setDuration      : any;
 
    constructor( vars:any )
    {
        var self            = this;
 
        var interval        = vars.interval || 1000;
        var duration        = self.duration = vars.duration || vars.seconds * 60000 || 0;
        var autoStart       = vars.autoStart || false;
        var elapsed         = 0;
        var startTime       = vars.startTime || 0;
        var isPaused        = false;
 
        var onTimeUp        = vars.onTimeUp;
        var onUpdate        = vars.onUpdate;
        
        var intervalID : any;
  
        self.start = function( vars?:any ) 
        {
            vars                                                = vars || {};
            if( vars.seconds ) duration                         = self.duration = vars.seconds * 1000;
            if( typeof vars.duration != undefined) duration     = self.duration = vars.duration;
            if( vars.onTimeUp ) onTimeUp                        = vars.onTimeUp;
            if( vars.onUpdate ) onUpdate                        = vars.onUpdate;
    
            self.restart( vars.startTime || startTime || DATE.now() );
        };

        self.restart = function( _startTime?:any )
        {
            isPaused                = false;
            self.isPlaying          = false;
 
            startTime               = _startTime  || DATE.now();
 
            elapsed                 = DATE.now() - startTime;
    
            self.stop();    
            
            onReach();
  
            self.isPlaying          = true;

            intervalID              = setInterval( update, interval );
        };
 
        self.increase = function( seconds:number )
        {
            duration += seconds * 1000;
        }
 
        self.pause = function()
        {
            if( !self.isPlaying || isPaused ) return;
            isPaused = true;
        };
 
        self.resume = function() 
        {
            isPaused = false;

            if( !self.isPlaying ) return;
            self.start({ duration:duration-elapsed, startTime:DATE.now() });
        };
     
        self.stop = function()
        {
            self.isPlaying = false;
            clearInterval( intervalID );
        };
 
        self.setDuration = function( value:number )
        {
            duration = self.duration = value;
        };
    
        function onReach()
        {
            self.stop();

            if( onTimeUp ) onTimeUp( self );
        };
 
        function update()
        {
            if( !self.isPlaying || isPaused ) return;
 
            elapsed         = DATE.now() - startTime;
            self.percent    = elapsed * 100 / duration;
  
            if( onUpdate ) onUpdate( self );
   
            if( elapsed >= duration ) onReach(); 
        }

        if( autoStart ) self.start();

    }
}

export default TimerInstance;