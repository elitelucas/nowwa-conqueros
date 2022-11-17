class QUERY
{
    public static get( vars:any )
    {
        if( vars.where ) return vars;

        var query   : any = { where:{}, values:{} };
        var where   : any = {};

        query.where = where;

        if( vars.uID ) where.uID = vars.uID;

        return query;
    };

    public static set( query:any )
    {
        if( !query.values ) query = { values : query };
        if( query.values && query.values._id ) delete ( query.values._id );

        return query;
    };


}

export default QUERY;