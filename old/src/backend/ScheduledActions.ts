import * as R from "@play-co/replicant";
import stateSchema from "./StateSchema";
import scheduledActionSchema from "./ScheduledActionSchema";
import chatbotMessageTemplates from "./ChatbotMessageTemplates";

export default R.createScheduledActions(stateSchema, scheduledActionSchema) ({

    sendBotMessage: (state, args, api) => {
        api.chatbot.sendMessage(
            args.recipient,
            chatbotMessageTemplates.botMessage({ 
                args: {
                    subtitle: args.subtitle,
                    cta: args.cta,
                    title: args.title,
                    url: args.url,
                    assetName: args.assetName
                }, 
                payload: {
                    feature: args.feature,
                    $channel: "chatbot",
                    $subFeature: null
                }
            })
        );
    },
});