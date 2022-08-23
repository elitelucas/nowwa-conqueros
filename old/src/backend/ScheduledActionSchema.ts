import * as R from "@play-co/replicant";
import * as T from "./Types";

export default {

    sendBotMessage: R.SB.object({
        recipient: R.SB.string(),
        subtitle: R.SB.string(),
        cta: R.SB.string(),
        title: R.SB.string(),
        url: R.SB.string(),
        assetName: R.SB.tuple(T.AssetNames), 
        feature: R.SB.string()
    })

};