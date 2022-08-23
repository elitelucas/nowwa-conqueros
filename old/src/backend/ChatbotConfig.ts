import * as R from "@play-co/replicant";
import chatbotMessageTemplates from "./ChatbotMessageTemplates";
import chatbotEvents from "./ChatbotEvents";

export default R.createChatbotConfig(chatbotMessageTemplates, chatbotEvents);