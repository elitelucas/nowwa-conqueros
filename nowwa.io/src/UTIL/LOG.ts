class LOG{
    
    public static log( ... args: any[] )
    {
        console.log( args );
    }

    public static error( ... args: any[] )
    {
        console.log( args );
    }
};

export var log      = LOG.log;
export var error    = LOG.error;

export default LOG;
  
