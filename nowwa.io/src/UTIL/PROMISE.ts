
class PROMISE
{
    private static pool: Map<string, any> = new Map<string, any>();
    
    public static reject( e:any )
    {
        var myError = this.pool.get( e );

        if( !myError )
        {
            this.pool.set( e, new Error(e) );
            myError = this.pool.get( e );
        }

        return Promise.reject( myError );
    }
}

export var resolve  = Promise.resolve;
export var reject = PROMISE.reject;

export default PROMISE;