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
    public sendTimer        : any;
    public stop             : any;
    public onReach          : any;
    public increase         : any;
    public pause            : any;
    public resume           : any;
    public onSecond         : any;
    public setAuto          : any;
    public setDuration      : any;
    
    private intervalID      : any;
 
    constructor( vars:any )
    {
        var self            = this;
 
        var id              = self._id = vars._id || vars.id;
        var duration        = self.duration = vars.duration || vars.seconds * 60000 || 60000;
        var autoStart       = vars.autoStart || false;
        var onSecond        = vars.onSecond;
        var remaining       = duration;
        var elapsed         = 0;
        var persistent      = vars.persistent || false;
        var startTime       = vars.startTime || 0;
        var isPaused        = false;
        var isAuto          = vars.isAuto || false;
        var replicated      = vars.replicated;
        var onTimeUp        = vars.onTimeUp;
        var onSecond        = vars.onSecond;
        var cycles          = 0;
 
        self.start = function( vars?:any ) 
        {
            vars                            = vars || {};
 
            if( vars.seconds ) duration     = self.duration = vars.seconds * 1000;
            if( vars.duration ) duration    = vars.duration;
            if( vars.onTimeUp ) onTimeUp    = vars.onTimeUp;
    
            self.restart( vars.startTime || startTime || DATE.now() );
 
            self.sendTimer();
        };

        self.restart = function( _startTime?:any )
        {
            isPaused                = false;
            self.isPlaying          = false;
 
            startTime               = _startTime  || DATE.now();
 
            elapsed                 = DATE.now() - startTime;
    
            if( elapsed >= duration )
            {
                if( isAuto )
                {
                    while( elapsed>= duration )
                    {
                        elapsed -= duration;
                        cycles ++;
                    }
    
                }else{
    
                    cycles = 1;
        
                    self.onReach();
                    self.stop();
                    return;
                }
            }

            self.isPlaying  = true;

            this.intervalID = setInterval( update, 16.6 );
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
            self.start( { duration:duration-elapsed, startTime:DATE.now() } );
        };
     
        self.stop = function()
        {
            self.isPlaying = false;
            clearInterval( this.intervalID );
        };
 
        self.setAuto = function ( bool:boolean )
        {
            isAuto = bool; 
            return isAuto;
        };

        self.setDuration = function( value:number )
        {
            duration = self.duration = value;
        };
    
        self.onReach = function()
        {
            self.stop();

            if( onTimeUp ) onTimeUp( self );
    
        };
 
        function update()
        {
            if( !self.isPlaying || isPaused ) return;

            var prev        = remaining;

            elapsed         = DATE.now() - startTime;
 
            self.percent    = elapsed * 100 / duration;
            remaining       = Math.ceil(( duration - elapsed ) / 1000 );
   
            if( prev == remaining ) return; // a second hasn't passed

            if( self.onSecond ) self.onSecond();
     
            if( remaining <= 0 ) self.onReach(); 
        }

        if( autoStart ) self.start();

    }
}

export default TimerInstance;