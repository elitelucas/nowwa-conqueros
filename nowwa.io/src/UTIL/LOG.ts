class LOG
{
    private static pool: Map<string, any> = new Map<string, any>();

    public static msg( e:any ) : Promise<any>
    {
        var myError = LOG.pool.get( e );

        if( !myError )
        {
            LOG.pool.set( e, new Error(e) );
            myError = LOG.pool.get( e );
        }

        return myError;
    }

    public static log( ... args: any  )
    {
        console.log( args );
    }

    public static error( ... args: any  )
    {
        console.log( args );
    }


};

export var log      = LOG.log;
export var error    = LOG.error;

export default LOG;
  
