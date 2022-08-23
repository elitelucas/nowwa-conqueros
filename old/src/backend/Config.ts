import * as R from "@play-co/replicant";
import stateSchema from "./StateSchema";
import scheduledActions from "./ScheduledActions";
import actions from "./Actions";
import computedProperties from "./ComputedProperties";
import messages from "./Messages";
import chatbotConfig from "./ChatbotConfig";
import asyncGetters from "./AsyncGetter";
import migrator from "./Migrator";

export default R.createConfig({
  stateSchema: stateSchema,
  asyncGetters: asyncGetters,
  actions: actions,
  appName: 'Test',
  messages: messages,
  migrator: migrator,
  version: process.env.APP_VERSION as string,
  chatbot: chatbotConfig,
  computedProperties: computedProperties,
  scheduledActions: scheduledActions,
});
