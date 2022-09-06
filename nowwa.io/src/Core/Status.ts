import Game from './Game';

class Status {

    public static CurrentStatus:Status.Detail = {
        Activity : 'None',
        AppName  : '',
        Version  : '',
        Platform : 'None'
    }
}

namespace Status {

    export type ActivityType = `None` | `ArchiveAll` | `Archive` | `Build` | `Internal`;
    export type Detail = {
        Activity : ActivityType;
        AppName  : string;
        Version  : string;
        Platform : Game.Platform;
    }
    export const DetailDefault:Detail = {
        Activity : 'None',
        AppName  : '',
        Version  : '',
        Platform : 'None'
    }
}

export default Status;