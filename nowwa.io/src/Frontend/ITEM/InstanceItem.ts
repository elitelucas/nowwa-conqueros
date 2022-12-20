import CONQUER from "../CONQUER";
import Awesome from "./Awesome";
import Stats from "./Stats";
import Tags from "./Tags";

class InstanceItem
{
    private conquer     : CONQUER;

    public Tags         : Tags;
    public Awesome      : Awesome;
    public Stats        : Stats
    public instanceID   : any;

    constructor( conquer:CONQUER, data:any )
    {
        this.conquer    = conquer;
        this.instanceID = data._id;

        this.Tags       = new Tags( conquer, this.instanceID );
        this.Awesome    = new Awesome( conquer, this.instanceID );
        this.Stats      = new Stats( conquer, this.instanceID );
    }


};

export default InstanceItem;