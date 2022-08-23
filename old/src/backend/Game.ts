import * as R from "@play-co/replicant";
import * as E from "./Enums";
import * as X from "./Errors";
import * as H from "./Helpers";
import * as I from "./Types";
import messages from "./Messages";
type ReplicantAPI = R.ReplicantUtilAPI< R.Replicant<{messages: typeof messages }>>;

export default class Game {


}