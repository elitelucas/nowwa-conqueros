import * as R from "@play-co/replicant";
import scheduledActions from "./ScheduledActions";
import stateSchema from "./StateSchema";
import computedProperties from "./ComputedProperties";
import chatbotMessageTemplates from "./ChatbotMessageTemplates";
import messages from "./Messages";

// Also, define how to respond to webhook events (onGameEnd)
export default R.createChatbotEvents(stateSchema, {messages: messages, scheduledActions: scheduledActions, computedProperties: computedProperties })({
    // Fired every time there is a context switch or when the game is closed.
    onGameEnd: (state, data, api, isFirstInSession) => {
      if (isFirstInSession) {
        
        api.chatbot.sendMessage(
          data.playerId,
          chatbotMessageTemplates.botMessage({ 
              args: {
                  subtitle: "Let's play again!",
                  cta: "Play now!",
                  title: "Test",
                  url: "https://www.google.com/",
                  assetName: "test"
              }, 
              payload: {
                feature: "FIRST_CONTEXT_CHANGED",
                $channel: "chatbot",
                $subFeature: null
              }
          })
        );
      }
          
      api.scheduledActions.schedule.sendBotMessage({
        args: {
            recipient: data.playerId,
            subtitle: "New daily reward is available!",
            cta: "Claim now!",
            title: "Test",
            url: "https://www.google.com/",
            assetName: "test",
            feature: "DAY_1_NOTIFICATION"
        }, 
        notificationId: "1DNotification",
        delayInMS: 1 * 24 * 3600 * 1000, // 1  day delay, 
      });
      
      api.scheduledActions.schedule.sendBotMessage({
        args: {
            recipient: data.playerId,
            subtitle: "It has been 3 days, come back to play again!",
            cta: "Play now!",
            title: "Test",
            url: "https://www.google.com/",
            assetName: "test",
            feature: "DAY_3_NOTIFICATION"
        }, 
        notificationId: "3DNotification",
        delayInMS: 3 * 24 * 3600 * 1000, // 3  day delay
      });
      
      api.scheduledActions.schedule.sendBotMessage({
        args: {
            recipient: data.playerId,
            subtitle: "Test",
            cta: "Play now!",
            title: "Test",
            url: "https://www.google.com/",
            assetName: "test",
            feature: "DAY_7_NOTIFICATION"
        }, 
        notificationId: "7DNotification",
        delayInMS: 7 * 24 * 3600 * 1000, // 7  day delay
      });
      
      api.scheduledActions.schedule.sendBotMessage({
        args: {
            recipient: data.playerId,
            subtitle: "Test",
            cta: "Play now!",
            title: "Test",
            url: "https://www.google.com/",
            assetName: "test",
            feature: "DAY_14_NOTIFICATION"
        }, 
        notificationId: "14DNotification",
        delayInMS: 14 * 24 * 3600 * 1000, // 14  day delay
      });
    },
  });