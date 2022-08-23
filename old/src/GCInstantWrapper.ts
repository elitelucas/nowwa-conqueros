import { Platform, GCInstant, analytics } from "@play-co/gcinstant"; 
import * as Sentry from '@sentry/browser';
import { ReplicantFromConfig, ClientReplicant, createConfig, createOfflineReplicant } from '@play-co/replicant';
import config from "./backend/Config";
import { extendReplicantConfigForAnalytics, createStorageAdapter, configureExtensions  } from '@play-co/gcinstant-replicant-extensions';

class GCInstantWrapper {

    public IsInitialized:boolean;
    public IsStarted:boolean;
    public replicant!: ClientReplicant<ReplicantFromConfig<typeof config>> | null;

    constructor () {
        this.IsInitialized = false;
        this.IsStarted = false;
    }

    public get gcinstant ():Platform {
        return GCInstant;
    }

    public async init():Promise<void> {

        let appID = process.env.APP_ID as string;
        let appName = process.env.APP_NAME as string;
        let appVersion = process.env.APP_VERSION as string;

        console.log(`Initialize GCInstant for [${appName}:${appVersion}] | ID: ${appID}`)

        let resolveReplicantClient;

        const replicantClientPromise = new Promise<ClientReplicant<any>>((resolve) => {
            resolveReplicantClient = resolve;
        });

        configureExtensions({
            analytics,
            gcinstant: GCInstant,
            replicantClientPromise, // A promise that resolves with a Replicant client instance
        });

        console.log(`gcinstant initializing...`);
        await GCInstant.initializeAsync({
            amplitudeTimeZone: 'America/Los_Angeles',
            appID: appID,
            shortName: appName,
            version: appVersion,
            amplitudeKey: process.env.AMPLITUDE as string,
        });
        this.IsInitialized = true;
        console.log(`gcinstant initialized!`);

        this.SendAnalytics(`GCInstant_Initialized`, {});

        console.log(`sentry initializing...`);
        let isSentryError:boolean = false;
        try {
            Sentry.init({
                dsn: process.env.SENTRY_DSN,
                environment: process.env.SENTRY_ENVIRONMENT || "production",
                attachStacktrace: true,
                release:
                process.env.SENTRY_ENVIRONMENT === "production"
                    ? process.env.SENTRY_PROJECT + "@" + process.env.APP_VERSION
                    : undefined,
                beforeSend: (event,hint) => {
                    return event;
                }
            });
        } catch (error:any) {
            isSentryError = true;
            console.log(`sentry error: ${error}`);
        }
        if (!isSentryError) {
            console.log(`sentry initialized!`);

            this.SendAnalytics(`Sentry_Initialized`, {});
        }

        console.log(`replicant initializing...`);
        this.replicant = await createOfflineReplicant(config, 'userTest001', {
            platform: "mock",
            checkForMessagesInterval: 1000 // check messages every 1 second
        })
        .then((rep)=>{
            console.log('replicant success');
            const storageAdapter = createStorageAdapter(() => rep);
    
            resolveReplicantClient(this.replicant);
    
            // Call `setStorageAdapter` before `GCInstant.startGameAsync` or `GCInstant.loadStorage`:
            GCInstant.storage.setStorageAdapter(storageAdapter);
            return rep;
        })
        .catch((e) => {
            console.log('replicant fails');
            console.log(e);
            return null;
        });

        return Promise.resolve();
    }

    public async start():Promise<void> {
        console.log(`gcinstant starting game...`);
        // await GCInstant.startGameAsync();
        await GCInstant.startGameAsync()
        .then(() => {
            console.log('gcinstant success');
            return;
        }).catch((e) => {
            console.log('gcinstant fails');
            console.log('reason', e);
            console.log(e);
            return;
        });
        this.IsStarted = true;
        console.log(`gcinstant game started!`);

        let version = process.env.APP_VERSION;
        this.SendAnalytics(`GCInstant_Started`, { version: version });

        console.log(`sending first event...`);
        this.SendAnalytics("RPW_Start", {});

        return Promise.resolve();
    }

    public SendAnalytics (eventName:string, eventProperties:{[key:string]:any}):void {
        console.log(`[Wrapper] send analytics: ${eventName}`);
        analytics.pushEvent(eventName, eventProperties, analytics.toDefaultAndAdServer);
    }
}

var rpw = new GCInstantWrapper();
export const _global = (window /* browser */ || global /* node */) as any
_global.rpw = rpw;

