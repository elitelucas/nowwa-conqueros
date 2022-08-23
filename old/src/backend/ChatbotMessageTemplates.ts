import * as R from "@play-co/replicant";
import * as F from "./FacebookMessageHelper";
import * as T from "./Types";

const chatbotAssets:T.AssetList = {
    scribblerider: "./src/frontend/scribblerider.png"
};
  
export default R.renderTemplatesWithAssets (
    chatbotAssets, 
    {
        botMessage: R.renderTemplate({
            args: R.SB.object({ 
                subtitle: R.SB.string(),
                cta: R.SB.string(),
                title: R.SB.string(),
                url: R.SB.string(),
                assetName: R.SB.tuple(T.AssetNames),
            }),
            renderers: {
                facebook: ({args, api, payload}) => F.facebookGenericTemplate({
                    payload: payload,
                    title: args.title,
                    subtitle: args.subtitle,
                    cta: args.cta,
                    url: args.url,
                    image_url: api.getAssetPath(args.assetName),
                })
            }
        }),
    }
)