class FriendInstance
{
    public avatarID     : any;
    public firstName    : any;
    public userPhoto    : any;
    public membershipID : any;
    public status       : any;
    public role         : any;
 
    constructor( vars:any )
    {
        this.avatarID       = vars.avatarID;
        this.firstName      = vars.firstName;
        this.userPhoto      = vars.userPhoto;

        this.membershipID   = vars.membershipID;
        this.status         = vars.status;
        this.role           = vars.role;
    };

    public accept()
    {
        if( this.role == "accepted" ) return;
        
    }

    public reject()
    {

    }

    public remove()
    {

    }
 
}

export default FriendInstance;