class FriendInstance
{
    public avatarID     : any;
    public firstName    : any;
    public userPhoto    : any;

    constructor( vars:any )
    {
        this.avatarID   = vars.avatarID;
        this.firstName  = vars.firstName;
        this.userPhoto  = vars.userPhoto;
    };
}

export default FriendInstance;