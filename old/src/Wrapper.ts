import * as G from "@play-co/gcinstant"; 
import * as R from "@play-co/replicant";
import * as X from "./backend/Errors";
import * as H from "./backend/Helpers";
import * as I from "./backend/Types";
import { OnErrorHandler } from "@play-co/replicant/lib/core/ReplicantConfig";
import config from "./backend/Config";
import { createPayloadEncoder, PayloadEncoder, recoverStorage } from '@play-co/gcinstant-replicant-extensions';
// import * as Sentry from '@sentry/browser';
import { createStorageAdapter } from '@play-co/gcinstant-replicant-extensions';
 
// @ts-ignore
import mainImage from "data-url:./frontend/snappyjump.png";

// Replicant sync actions batching timeout.
const BATCHING_MAX_TIME = 3000;

// The majority of unhandled FB errors come from the sync postSessionScore.
// Internally it is a promise, but the SDK does not expose it so we can't handle them.
const MUTED_FB_ERRORS = [
    // Any FB call can fail when a client loses connection.
    'NETWORK_FAILURE',
    // The three main categories of unknown errors:
    // "could be network failure", no response data, tournaments fail to post to timeline.
    'UNKNOWN',
    // Some clients with old versions of android do not support the tournament dialog
    // Resulting in a CLIENT_UNSUPPORTED_OPERATION with
    // Client does not support the message: showgenericdialogasync
    'CLIENT_UNSUPPORTED_OPERATION',
    // Tournaments can sometimes hang on postSessionScore
    // resulting in the failure of all subsequent requests.
    'PENDING_REQUEST',
    // The tournament API can get rate limited if a client lets the post happen
    // on every building upgrade instead of being fast enough to batch them.
    'RATE_LIMITED',
    // It may be that someone closed the dialog on the tournament
    // screen, which will be reported as unhandled rejection here. We have no
    // access to the promise, and worse have no way to differentiate between this
    // and other unhandled user errors.
    'USER_INPUT',
    // For some reason postSessionScore can lead to a SAME_CONTEXT error.
    'SAME_CONTEXT',
  ];

declare var FBInstant:any;
declare var userId:string;
declare var rpw:any;

const makeRandomGenerator = (seed: string) => {
    let n = 0;
    return () => R.teaHash(seed, n++);
};

class Wrapper {

    isInitialized: boolean;
    isStarted: boolean;
    isFinished: boolean;
    replicant!: R.ClientReplicant<R.ReplicantFromConfig<typeof config>>;
    onError!: OnErrorHandler;
    payloadEncoder!: PayloadEncoder;
    hasRewardedVideoAds:boolean;
    hasInterstitialAds:boolean;

    constructor () {
        this.isInitialized = false;
        this.isStarted = false;
        this.isFinished = false;
        this.hasInterstitialAds = false;
        this.hasRewardedVideoAds = false;
    }

    public get gcinstant ():G.Platform {
        return G.GCInstant;
    }

    public TrackRevenue (
        revenueType: 'in_app_purchase' | 'rewarded_video', 
        revenueGross: number, 
        productID: string | 'rewarded_video', 
        feature: string, 
        $subFeature: string,
        product?: G.Product,
        purchase?: G.Purchase
    ) {
        G.analytics.pushRevenue({
            feature: feature,
            subFeature: $subFeature,
            productID: productID,
            revenueType: revenueType,
            dollarToLocalRate: purchase?.dollarToLocalRate || 1,
            revenueGrossLocal: purchase?.revenueGrossLocal || 0,
            revenueGross: purchase?.revenueGrossUSD || revenueGross,
            currencyCodeLocal: product?.currencyCode || 'N/A'
        });
    }

    public GetFriends ():G.Friend[] {
        return this.gcinstant.friends;
    }

    public async GetActiveFriendCounts(friendIds:string[]):Promise<I.ActiveFriendCounts> {
        return await this.replicant.asyncGetters.getActiveFriendCounts({friendIds: friendIds});
    }

    public UpdateSessionData () {
        this.gcinstant.setSessionData(this.replicant.getChatbotSessionData());
    }

    public SetUserProperties (properties:{[key:string]:any}) {
        G.analytics.setUserProperties(properties);
    }

    // #region CORE ///

    private initSentry() {
        console.log('init sentry');
        // if (!process.env.SENTRY_DSN) {
        //     // Otherwise, we won't be able to see errors locally
        //     throw Error("process.env.SENTRY_DSN must be set");
        // }
        // Sentry.init({
        //     dsn: process.env.SENTRY_DSN,
        //     environment: process.env.SENTRY_ENVIRONMENT || "production",
        //     attachStacktrace: true,
        //     release:
        //     process.env.SENTRY_ENVIRONMENT === "production"
        //         ? process.env.SENTRY_PROJECT + "@" + process.env.APP_VERSION
        //         : undefined,
        //     beforeSend: (event,hint)=>{
        //         if (this.isUnhandledPromiseRejectionFromFBSDK(event, hint)) {
        //             return null;
        //         }
        //         return event;
        //     }
        // });
    }

    // private isUnhandledPromiseRejectionFromFBSDK(event: Sentry.Event, hint: Sentry.EventHint | undefined) {
    //     if (event.exception?.values) {
    //         for (const exception of event.exception.values) {
    //         // Only care about unhandled rejections
    //             if (exception.mechanism?.type === 'onunhandledrejection') {
    //                 // If we have a stacktrace and the call originates from FB SDK, then
    //                 // ignore this promise rejection.
    //                 const stackframes = exception.stacktrace?.frames;
    //                 if (stackframes && stackframes.length > 0) {
    //                     const lastFrame = stackframes[stackframes.length - 1];
    //                     // If the rejection originates from the FB SDK directly.
    //                     if (lastFrame.filename?.includes('fbinstant.beta.js')) {
    //                         return true;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     const originalException:any = hint?.originalException;
    //     const code = originalException?.['code'];
    //     if (code && MUTED_FB_ERRORS.includes(code)) {
    //         return true;
    //     }
    //     // Alternatively, we've errors for users closing an FB dialog,
    //     // but the error code is not USER_INPUT.
    //     if (originalException?.['message'] === 'User close dialog') {
    //         return true;
    //     }
    //     return false;
    // }

    private async check():Promise<void> {
        if (!this.isInitialized) {
            throw new Error('replicant is not initialized');
        }
        await this.replicant.refresh();
        if (this.replicant.state.profile.userName.length == 0 || this.replicant.state.profile.userPhoto.length == 0) {
            await this.replicant.invoke.updateProfile({
                name: this.gcinstant.playerName,
                pic: this.gcinstant.playerPhoto
            });
        }
    }

    public async init():Promise<void> {
        if (this.isInitialized) {
            throw new X.GameError(X.GameErrorCode.DoubleInit);
        }
        
        console.log('process platform: ' + process.env.PLATFORM);
        console.log('environment platform: ' + process.env.PLATFORM);
        console.log('game name: ' + process.env.APP_NAME);
        console.log('share url: ' + process.env.SHARE_URL);
        console.log('app version: ' + process.env.APP_VERSION);
        console.log('app id: ' + process.env.APP_ID);
        
        var self = this;
        
        this.initSentry();

        console.log('init gcinstant...');

        await G.GCInstant.initializeAsync({
            amplitudeTimeZone: 'America/Los_Angeles',
            appID: process.env.APP_ID as string,
            shortName: process.env.APP_NAME as string,
            version: process.env.APP_VERSION as string,
            amplitudeKey: process.env.AMPLITUDE as string,
        });

        console.log('gcinstant ready!');

        var useMockData:boolean = process.env.PLATFORM == 'mock';
        if (!useMockData) {
            console.log(`fbid: ${G.GCInstant.playerID}`);
            console.log('init live replicant...');

            // Prefetch the encoded payload item from Replicant's KV store
            // when logging in, instead of having to fetch it with a
            // separate request later on.
            const prefetchKey = (G.GCInstant.entryData as any)?.$key;

            self.replicant = await R.createClientReplicant(
                config,
                G.GCInstant.playerID, 
                {
                    batchingMaxTime: BATCHING_MAX_TIME,
                    kvStore: {
                        prefetchKeys: prefetchKey && [prefetchKey],
                    },
                    platform: process.env.PLATFORM as R.ReplicantPlatform || 'mock',
                    endpoint: process.env.REPLICANT_ENDPOINT as string,
                    signature: G.GCInstant.playerSignature,
                    obtainSignature: () => G.GCInstant.refreshPlayerSignature(),
                });
        } else {
            console.log('init mock replicant...');
            self.replicant = await R.createOfflineReplicant(config, userId, {
                platform: "mock",
                checkForMessagesInterval: 1000 // check messages every 1 second
            });
        }
            
        console.log('replicant ready!');

        self.gcinstant.setECPM(self.replicant.extras.getECPM());
        console.log('replicant ready!');
        
        self.replicant.setOnError((e)=>{
            if (self.onError != null) {
                self.onError(e);
            } else {
                console.error(e);
            }
        });
        
        G.globalTime.setNow(self.replicant.now());

        self.gcinstant.setExchangeRatesUSD(self.replicant.getExchangeRatesUSD());


        if (!this.replicant.state.isInitialized) {
            console.log('first time user, init player data...');
            await this.replicant.invoke.initPlayerData({
                name: G.GCInstant.playerName,
                pic: G.GCInstant.playerPhoto
            });
        } else {
            console.log('returning user, init update profile...');
            await this.replicant.invoke.updateProfile({
                name: G.GCInstant.playerName,
                pic: G.GCInstant.playerPhoto
            });
        }
            
        console.log('player data ready!');
        this.SendAnalytics("Wrapper Initialized", {}, true);
        
        console.log('init storage adapter...');
        // `replicant` is a Replicant client instance:
        const storageAdapter = createStorageAdapter(() => self.replicant);

        // Call `setStorageAdapter` before `GCInstant.startGameAsync` or `GCInstant.loadStorage`:
        G.GCInstant.storage.setStorageAdapter(storageAdapter);
        
        // All payload from social API(ShareAsync, InviteAsync, tournamentShareAsync, tournamentCreateAsync)
        // will be processed by this encoder and decoder this means that instead of sending whole ab tests and other analytics related data
        // we will send the only key and save payload by this key our key/value storage, on decode will get real payload from DB by this key
        // this was done because payload limits on platforms side
        self.payloadEncoder = createPayloadEncoder(() => self.replicant, G.analytics);
        G.GCInstant.setDataCodec(self.payloadEncoder);
            
        await this.gcinstant.loadStorage();

        this.isInitialized = true;
        if (rpw.ready) rpw.ready();
        console.log('rpw is ready!');
    }

    public async start():Promise<void> {
        if (this.isStarted) return Promise.resolve();
        this.isStarted = true;
        console.log('start game async');

        await this.gcinstant.startGameAsync();

        await recoverStorage({
            analytics: G.analytics,
            gcinstant: this.gcinstant,
            replicant: this.replicant,
            recoverPlayersCreatedBefore: new Date('2021-03-14T15:00:00.000+01:00').getTime()
        });

        this.gcinstant.setSessionData(this.replicant.getChatbotSessionData());
        
        await this.PrepareAnalytics();

        await this.SubscribeBot();
            
        await this.CheckPayload();

        await this.PreGameLogic();

        this.isFinished = true;
    }

    public async disconnect ():Promise<void> {
        await this.check();
        return await this.replicant.invoke.disconnect();
    }

    public async CheckPayload():Promise<void> {
        let payload = this.gcinstant.entryData.payload;
        console.log (`payload: ${JSON.stringify(payload)}`);
        if (this.gcinstant.entryData.payload != null) {
            if (payload.action == "rewarded_invite") return await this.AcceptRewardedInvite(payload);
            if (payload.action == "challenge_invite") return await this.AcceptChallenge(payload);
        } else {
            return Promise.resolve();
        }
    }

    public async PreGameLogic ():Promise<void> {
        await this.replicant.invoke.cleanTournament();
    }
    
    public SetLoadingProgress (value:number):void {
        this.gcinstant.setLoadingProgress(value);
    }

    public SetOnError (handler: OnErrorHandler):void {
        this.onError = handler;
    }
    
    public GetNowTimestamp():number {
        return this.replicant.now();
    }

    // #endregion CORE ///

    // #region EXTRA ///
    
    public async SetFTUE (step:number):Promise<void> {
        await this.check();
        await this.replicant.invoke.setFTUE({step:step});
        return Promise.resolve();
    }

    public async ResetData ():Promise<void> {
        await this.check();
        await this.replicant.invoke.resetPlayerData({name: this.gcinstant.playerName, pic: this.gcinstant.playerPhoto });
        return Promise.resolve();
    }

    public async CheckState() {
        await this.check();
        return {
            ...this.replicant.state,
            event : this.CheckEvent()
        }
    }

    public async SetMaxLevel(maxLevel:number):Promise<void> {
        await this.check();
        await this.replicant.invoke.setMaxLevel({maxLevel: maxLevel});
        //this.SendAnalytics("SetMaxLevel");
        return Promise.resolve();
    }

    public async GetProfile(id:string) {
        await this.check();
        return await this.replicant.invoke.getProfile({id:id});
    }

    public async GetProfiles(ids:string[]) {
        await this.check();
        return await this.replicant.invoke.getProfiles({ids:ids});
    }

    public async FindTarget() {
        await this.check();
        return await this.replicant.invoke.findTarget();
    }

    public async SetValue(key:string, value:any):Promise<void> {
        await this.check();
        return await this.replicant.invoke.storeDump({key:key, value:value});
    }

    // #endregion EXTRA ///
    
    // #region ADS ///

    public async LoadInterstitialAds(placementId:string):Promise<void> {
        return this.gcinstant.ads.preloadInterstitialAdAsync(placementId)
        .then(()=> {
            this.hasInterstitialAds = true;
            console.log('Preload Interstitial Ad Success!');
        })
        .catch((e) => {
            console.log('Preload Interstitial Ad Fails...');
            this.SendAnalytics("ADS_ERROR",{type:"Interstitial",code:e.code, message:e.message || ""}, true);
            throw e;
        });
    }

    public async LoadRewardedVideoAds(placementId:string):Promise<void> {
        return this.gcinstant.ads.preloadRewardedVideoAdAsync(placementId)
        .then(()=> {
            this.hasRewardedVideoAds = true;
            console.log('Preload Rewarded Ad Success!');
        })
        .catch((e) => {
            console.log('Preload Rewarded Ad Fails...');
            this.SendAnalytics("ADS_ERROR",{type:"Rewarded",code:e.code, message:e.message || ""}, true);
            throw e;
        });
    }

    public async ShowInterstitialAds(feature:string, subfeature:string):Promise<void> {
        return this.gcinstant.ads.showPreloadedInterstitialAdAsync({feature:feature,subFeature:subfeature})
        .then(()=> {
            console.log('Show Interstitial Ad Success!');
        })
        .catch((e) => {
            console.log('Show Interstitial Ad fails...');
            this.SendAnalytics("ADS_ERROR",{type:"Interstitial",code:e.code, message:e.message || ""}, true);
            throw e;
        });
    }

    public async ShowRewardedVideoAds(feature:string, subfeature:string):Promise<void> {
        return this.gcinstant.ads.showPreloadedRewardedVideoAdAsync({feature:feature,subFeature:subfeature})
        .then(()=> {
            console.log('Show Rewarded Ad Success!');
        })
        .catch((e) => {
            console.log('Show Rewarded Ad fails...');
            this.SendAnalytics("ADS_ERROR",{type:"Rewarded",code:e.code, message:e.message || ""}, true);
            throw e;
        });
    }

    public async ShowAds(adInstance?:any):Promise<void> {
        var shown:boolean = false;
        if (this.hasRewardedVideoAds) {
            await this.gcinstant.ads.showPreloadedRewardedVideoAdAsync({feature:"Rewarded", subFeature:"Rewarded"});
            shown = true;
        }
        if (this.hasInterstitialAds && shown) await this.gcinstant.ads.showPreloadedRewardedVideoAdAsync({feature:"Interstitial", subFeature:"Rewarded"});
    }

    // #endregion ADS ///

    // #region BOT MESSAGE ///

    public async SubscribeBot ():Promise<void> {
        var useMockData:boolean = process.env.PLATFORM == 'mock';
        if (useMockData) {
            return Promise.resolve();
        } else {
            if (G.GCInstant.isSubscribedToBot) {
                console.log('player already subscribed');
                return Promise.resolve();
            } else {
                console.log('player not yet subscibed');
                return G.GCInstant.canSubscribeBotAsync()
                .then((canSubscribe:boolean) => {
                    if (canSubscribe) {
                        console.log('player can subscribe');
                        return G.GCInstant.subscribeBotAsync();
                    } else {
                        console.log('player cannot subscribe');
                    }
                }, (e:any) => {
                    console.log(e);
                });
            }
        }
    } 

    public async SendBotMessage (recipient: string, subtitle:string, cta:string, title:string, url:string, delayInMS?:number):Promise<void> {
        await this.check();
        await this.replicant.invoke.sendBotMessage({
            recipient: recipient,
            assetName: "snappyjump",
            cta: cta,
            subtitle: subtitle,
            title: title,
            url: url,
            delayInMS: delayInMS
        });
    }

    // #endregion BOT MESSAGE ///

    // #region ANALYTICS ///

    private async PrepareAnalytics ():Promise<void> {
        const tournamentContextId = this.gcinstant.contextTournament && this.gcinstant.contextID || null;

        const analyticsData = await this.replicant.asyncGetters.getEntryAnalyticsDataCombined({
            friendIds:this.gcinstant.friendIds,
            contextId: tournamentContextId
        });

        await this.replicant.invoke.updateActiveFriends({activeFriendCounts: analyticsData.friendCounts});

        const tournamentFriendCount = analyticsData.tournamentFriendCount;
        const tournamentPlayerCount = analyticsData.tournament.playerIds.length;
        const tournamentElapsedHours = Math.max(Math.floor((analyticsData.tournament.createTime - this.replicant.now()) / 1000 / 3600), 0);

        const entryData = this.gcinstant.entryData as G.AnalyticsProperties.EntryData & {
            realtimeActiveFriendCount1D: number;
            realtimeActiveFriendCount3D: number;
            realtimeActiveFriendCount7D: number;
            realtimeActiveFriendCount14D: number;
            realtimeActiveFriendCount30D: number;
            realtimeActiveFriendCount90D: number;
        };

        const realtimeProps = G.analytics.getUserProperties();

        // EntryFinal event properties
        const entryFinalEventProps: { [key: string]: any } = {
            $subFeature: (G.GCInstant.entryData as any).$subFeature
        };

        let state = this.replicant.state;

        let now = this.replicant.now();

        const levelRange:string = H.getLevelRange(Math.max(state.maxLevel, 1));
        
        const firstEntryUserProps: I.FirstEntryUserProperties = {
	
            firstEntryActiveFriendCount1D: state.analytics.activeFriendCount1D,
            firstEntryActiveFriendCount3D: state.analytics.activeFriendCount3D,
            firstEntryActiveFriendCount7D: state.analytics.activeFriendCount7D,
            firstEntryActiveFriendCount14D: state.analytics.activeFriendCount14D,
            firstEntryActiveFriendCount30D: state.analytics.activeFriendCount30D,
            firstEntryActiveFriendCount90D: state.analytics.activeFriendCount90D,

            "firstEntryActiveFriendRatio1/3": H.getRatio(
                state.analytics.activeFriendCount1D,
                state.analytics.activeFriendCount3D
            ),
            "firstEntryActiveFriendRatio1/7": H.getRatio(
                state.analytics.activeFriendCount1D,
                state.analytics.activeFriendCount7D
            ),
            "firstEntryActiveFriendRatio3/7": H.getRatio(
                state.analytics.activeFriendCount3D,
                state.analytics.activeFriendCount7D
            ),
            "firstEntryActiveFriendRatio7/30": H.getRatio(
                state.analytics.activeFriendCount7D,
                state.analytics.activeFriendCount30D
            ),

            firstEntrySourceRealtimeActiveFriendCount1D: 0,
            firstEntrySourceRealtimeActiveFriendCount3D: 0,
            firstEntrySourceRealtimeActiveFriendCount7D: 0,
            firstEntrySourceRealtimeActiveFriendCount14D: 0,
            firstEntrySourceRealtimeActiveFriendCount30D: 0,
            firstEntrySourceRealtimeActiveFriendCount90D: 0,
            
            firstEntrySourceRealtimeLevelRange: levelRange,

            firstEntryLevelRange: levelRange,

            firstEntryTournamentActiveCount: H.countActiveTournament(state.tournamentsV2, now),
            firstEntryTournamentFriendCount: tournamentFriendCount,
            firstEntryTournamentPlayerCount: tournamentPlayerCount,
            firstEntryTournamentElapsedHours: tournamentElapsedHours,
        };
        
        const lastEntryUserProps: I.LastEntryUserProperties = {
	
            lastEntryActiveFriendCount1D: state.analytics.activeFriendCount1D,
            lastEntryActiveFriendCount3D: state.analytics.activeFriendCount3D,
            lastEntryActiveFriendCount7D: state.analytics.activeFriendCount7D,
            lastEntryActiveFriendCount14D: state.analytics.activeFriendCount14D,
            lastEntryActiveFriendCount30D: state.analytics.activeFriendCount30D,
            lastEntryActiveFriendCount90D: state.analytics.activeFriendCount90D,

            "lastEntryActiveFriendRatio1/3": H.getRatio(
                state.analytics.activeFriendCount1D,
                state.analytics.activeFriendCount3D
            ),
            "lastEntryActiveFriendRatio1/7": H.getRatio(
                state.analytics.activeFriendCount1D,
                state.analytics.activeFriendCount7D
            ),
            "lastEntryActiveFriendRatio3/7": H.getRatio(
                state.analytics.activeFriendCount3D,
                state.analytics.activeFriendCount7D
            ),
            "lastEntryActiveFriendRatio7/30": H.getRatio(
                state.analytics.activeFriendCount7D,
                state.analytics.activeFriendCount30D
            ),

            lastEntrySourceRealtimeActiveFriendCount1D: 0,
            lastEntrySourceRealtimeActiveFriendCount3D: 0,
            lastEntrySourceRealtimeActiveFriendCount7D: 0,
            lastEntrySourceRealtimeActiveFriendCount14D: 0,
            lastEntrySourceRealtimeActiveFriendCount30D: 0,
            lastEntrySourceRealtimeActiveFriendCount90D: 0,

            lastEntrySourceRealtimeLevelRange: levelRange,

            lastEntryLevelRange: levelRange,

            lastEntryFrenzyCompleted: 0,
            lastEntrySessionMaturityRange: 0,
            lastEntryIsPurchaser: false,
            lastEntryPurchaseDaysElapsed: 0,
            lastEntryLTV: 0,

            lastEntryTournamentActiveCount: H.countActiveTournament(state.tournamentsV2, now),
            lastEntryTournamentFriendCount: tournamentFriendCount,
            lastEntryTournamentPlayerCount: tournamentPlayerCount,
            lastEntryTournamentElapsedHours: tournamentElapsedHours,
        };

        console.log('send entry final analytics');

        // HACK : skipped for Snapchat
        // setEntryTimestampsGetter(
        //     () => this.replicant, // `replicant` is a Replicant client instance
        //     G.GCInstant,
        //     {},
        // );

        await this.gcinstant.sendEntryFinalAnalytics(
            entryFinalEventProps,
            firstEntryUserProps,
            lastEntryUserProps
        );
    }

    public SendAnalytics (name:string, data:any, sendToAll:boolean):void {
        G.analytics.pushEvent(name,data, G.analytics.toDefaultAndAdServer);
    }

    public TrackFirstSpin (occasion:I.TrackFirstSpinOccasion):void {
        this.SendAnalytics('FirstSpin', { occasion: occasion }, true);
    }

    public TrackSequenceStart (id: 'RefillCoins' | 'RefillSpins' | 'TutorialFinish' | 'Launch'):void {
        this.SendAnalytics('SequenceStart', {id : id}, true);
    }

    public TrackSequenceFinish (id: 'RefillCoins' | 'RefillSpins' | 'TutorialFinish' | 'Launch'):void {
        this.SendAnalytics('SequenceFinish', {id : id}, true);
    }

    // #endregion ANALYTICS ///

    // #region AB TESTS ///

    public InitABTests (abTests:{[id:string]:I.ABTest}):void {
        this.gcinstant.abTests?.initialize(abTests as any, makeRandomGenerator);

        /*
        example: 
        const abTests = {
            '0002_FancierAttackIcon': {
                active: true,
                buckets: [
                    { id: 'control' }, 
                    { id: 'enabled' }
                ], // More than 2 buckets can be defined
                default: 'control', // Defines what `getBucketID` returns for unassigned players. Defaults to `control`.
                newPlayersOnly: false, // Set `true` to only assign new players (old players get assigned to the default bucket). Defaults to `false`.
            },
        };
        rpw.InitABTests(abTests);

        // then... check return value
        console.log(rpw.CheckABTest("0002_FancierAttackIcon"));
        */
    }

    public AssignABTest (testID:string, bucketID:string) {
        this.gcinstant.abTests?.assignTestManually(testID, bucketID, true);
    }

    public CheckABTest (id:string):(string | undefined) {
        return this.gcinstant.abTests?.getBucketID(id);
    }

    // #endregion AB TESTS ///

    // #region LOCATION  ///

    public GetGeolocation () {
        return this.replicant.getGeolocation();
    }

    public async SetCountry () {
        await this.check();
        const geolocation = this.GetGeolocation();
        if (geolocation) {
            this.gcinstant.setCountry(geolocation.country);
        }
    }

    // #endregion LOCATION  ///

    // #region SOCIAL ///

    public async CreateContextAsync (playerID: string, feature:string, $subFeature:string, uiOpts?: { [key: string]: any; } | undefined):Promise<void> {
        await this.check();
        return this.gcinstant.createContextAsync(
            playerID,
            {
                feature: feature,
                $subFeature: $subFeature
            },
            uiOpts);
    }

    public async ChooseContextAsync (feature:string, $subFeature:string):Promise<void> {
        await this.check();
        return await this.gcinstant.chooseContextAsync({
            analytics: {
                feature: feature,
                $subFeature: $subFeature
            }
        });
    }

    public async UpdateAsync (recipient:string, image:string, text : string, feature:string, $subFeature: string, cta?:string, payload?:{[key:string]:any}, strategy? :G.AnalyticsProperties.UpdateStrategy):Promise<G.UpdateAsyncResult> {
        await this.check();
        var value:G.UpdateAsyncPayload = {
            receiver: {
                id: recipient
            },
            notification: "PUSH",
            data: {
                payload: payload,
                feature: feature,
                $subFeature: $subFeature
            },
            text: text,
            template: "",
            strategy: strategy,
            image: image
        };
        return await this.gcinstant.updateAsync(value);
    }

    public async InviteAsync (text:string, image:string, feature:string, $subFeature: string, payload?:{[key:string]:any}):Promise<void | { receiverIDs: string[] }> {
        await this.check();
        return await this.gcinstant.inviteAsync({
            data: {
                payload: payload,
                feature: feature,
                $subFeature: $subFeature,
                action: "invite",
            },
            text: text,
            image: image,
        });
    }

    public async ShareAsync (text:string, image:string, feature:string, $subFeature: string, payload?:{[key:string]:any}):Promise<void | { sharedCount: number } | { receiverIDs: string[] }> {
        await this.check();
        return this.gcinstant.shareAsync({
            data: {
                payload: payload,
                feature: feature,
                $subFeature: $subFeature,
                action: "invite",
            },
            displayNotification: true,
            image: image,
            text: text,
            template: 'none',
            //@ts-ignore
            intent: "Share"
        });
    }

    public async ShareLinkAsync (text:string, image:string, feature:string, $subFeature: string, payload?:{[key:string]:any}):Promise<void> {
        await this.check();
        return this.gcinstant.shareLinkAsync({
            data: {
                payload: payload,
                feature: feature,
                $subFeature: $subFeature,
                action: "invite",
            },
            image: image,
            text: text,
        });
    }

    public async SendRewardedInvite ():Promise<void | { receiverIDs: string[] }> {
        await this.check();
        var self = this;
        await this.gcinstant.inviteAsync({
            data: {
                payload: {
                    action: "rewarded_invite",
                    sender: {
                        userID: self.gcinstant.playerID,
                        userPhoto: self.gcinstant.playerPhoto,
                        userName: self.gcinstant.playerName
                    },
                },
                feature: "invite",
                $subFeature: "rewarded",
                action: "invite",
            },
            displayNotification: true,
            text: `Let's play ${process.env.APP_NAME}!`,
            image: mainImage,
        });
        return Promise.resolve();
    }

    public async ShareRewardedInvite():Promise<void | { sharedCount: number } | { receiverIDs: string[] }> {
        var self = this;
        return this.gcinstant.shareAsync({
            data: {
                payload: {
                    action: "rewarded_invite",
                    sender: {
                        userID: self.gcinstant.playerID,
                        userPhoto: self.gcinstant.playerPhoto,
                        userName: self.gcinstant.playerName
                    },
                },
                feature: "invite",
                $subFeature: "rewarded",
                action: "share",
            },
            //@ts-ignore
            intent: "invite",
            displayNotification: true,
            text: `Let's play ${process.env.APP_NAME}!`,
            image: mainImage,
        });
    }

    private async AcceptRewardedInvite (payload:Record<string,any>):Promise<void> {
        console.log('enter from an invite');
        let senderID:string = payload.sender.userID;
        if (senderID != this.gcinstant.playerID) {
            await this.replicant.invoke.acceptRewardedInvite({
                userID: senderID,
                profile: {
                    userID: this.gcinstant.playerID,
                    userName: this.gcinstant.playerName,
                    userPhoto: this.gcinstant.playerPhoto,
                }
            });
        } else {
            return Promise.resolve();
        }
    }

    public async GetNewAcceptedInvites():Promise<I.Profile[]> {
        return await this.replicant.invoke.confirmRewardedInvites();
    }

    public async ClearRewardedInvites():Promise<void> {
        await this.replicant.invoke.clearRewardedInvites();
        return Promise.resolve();
    }

    // #endregion SOCIAL ///

    // #region TOURNAMENT ///

    //deprecated//
    public async GetTournament() {
        return Promise.resolve();
    }
   
    public async PostTournamentScore (score:number, tournamentContextId?:string):Promise<G.Tournament> {
        var tournament:G.Tournament;

        if (tournamentContextId) {
            if (tournamentContextId != this.gcinstant.contextID) {
                console.log('currently not on the same context, attempting to switch now...');
                var success:boolean = await this.gcinstant.switchContextAsync(tournamentContextId, { feature: 'tournament', $subFeature: 'tournament_switch' })
                .then(()=>{
                    console.log('switched to a new context!');
                    return true;
                })
                .catch((e)=>{
                    console.log('unable to switch context...');
                    return false;
                });
                if (!success) {
                    return null;
                }
            }
        } 

        if (!this.gcinstant.contextID) { 
            return await this.gcinstant.createTournamentAsync({
                initialScore: score, 
                title: `${process.env.APP_NAME} Tournament`, 
                image: null, 
                data: { 
                    feature: 'tournament', 
                    $subFeature: 'tournament_create' 
                }
            })
            .then((t)=>{
                console.log('created new tournament!');
                return t;
            })
            .catch((e) => {
                console.log('unable to create tournament...');
                return null;
            });
        }

        var success:boolean = await this.gcinstant.getTournamentAsync()
        .then((t)=>{
            console.log('tournament fetched!');
            return t;
        })
        .catch((e)=>{
            console.log('unable to fetch tournament...');
            return null;
        });
        if (!success) {
            return null;
        }

        await this.gcinstant.postTournamentScoreAsync(score)
        .then(()=>{
            console.log('tournament score updated!');
        })
        .catch((e)=>{
            console.log('unable to post tournament score...');
        });

        tournament = await this.gcinstant.shareTournamentAsync({
            score: score,
            data: {
                feature: 'tournament',
                $subFeature: 'tournament_share'
            }
        })
        .then((t)=>{
            console.log('tournament shared!');
            return t;
        })
        .catch((e)=>{
            console.log('unable to share tournament...');
            return null;
        });

        if (tournament) {
            var createTime: number = Date.now();
            var endTime: number = tournament.getEndTime();
            var contextID: string = tournament.getContextID();
            await this.replicant.invoke.registerTournament({
                createTime: createTime,
                endTime: endTime,
                contextID: contextID
            })
        }

        return tournament;
    }

    public GetActiveTournaments ():{[key:string]:{endTime:number}} {
        return this.replicant.state.tournamentsV2;
    }

    // #endregion TOURNAMENT ///

    // #region EVENTS ///

    public CheckEvent () {
        var timestamp = this.replicant.now();
        var now = new Date(timestamp);
        var day = now.getUTCDay();
        var date = now.getUTCDate();
        var month = now.getUTCMonth();
        var year = now.getUTCFullYear();
        var hour = now.getUTCHours();
        var min = now.getUTCMinutes();
        var sec = now.getUTCSeconds();
        var start = 0;
        var end = 0;
        var event = ""; // first : Mon - Wed, second : Thu - Sun
        var active = false;
        event = (day >= 1 && day <= 3) ? "first" : "second";
        active = (day == 1 || day == 4) ? (hour < 7 ? false : true) : true;
        end = ((day == 1 || day == 4) && hour < 7) ? Date.UTC (year, month, date + (event == "first" ? 2 : 3), 23, 59, 59) : Date.UTC (year, month, date + (event == "first" ? 3 - day : (day == 0 ? 0 : 7 - day)), 23, 59, 59);
        start = end - (((event == "first" ? 2 : 3) * 24 + 17) * 3600 * 1000);
        return {
            event: event,
            active: active,
            start: start,
            end: end
        }
    }
    // #endregion EVENTS ///

    // #region DAILY REWARDS ///

    public async ClaimDailyRewards():Promise<string> {
        await this.check()
        //this.SendAnalytics("ClaimDailyRewards");
        return await this.replicant.invoke.claimDailyRewards();
    }

    public async SetDailyBonusLogin():Promise<string> {
        return this.ClaimDailyRewards();
    }

    // #endregion DAILY REWARDS ///

    // #region SQUAD ///

    public async CreateSquad():Promise<G.Squad> {
        return await this.gcinstant.createSquadAsync({
            analytics: {
                feature: "squad",
                $subFeature: "squad_create"
            }
        })
    }

    public async GetSquad(squadId:string):Promise<G.Squad> {
        return await this.gcinstant.getSquadAsync(squadId);
    }

    public async GetPlayerSquads():Promise<G.Squad[]> {
        return await this.gcinstant.getPlayerSquadsAsync();
    }

    public async JoinSquad(squad:G.Squad):Promise<void> {
        return await squad.joinSquadAsync({
            analytics: {
                feature: "squad",
                $subFeature: "squad_join"
            }
        })
    }

    // #endregion SQUAD ///
    
    // #region CUSTOM LEADERBOARD ///

    public async SaveMaxScores(score:number):Promise<void> {
        await this.replicant.invoke.saveMaxScore({score:score});
    }

    public async GetMaxScores(playerIds?:string[]):Promise<{
            allTime:number,
            weekly:number,
            daily:number,
            userID:string,
            userName:string,
            userPhoto:string
        }[]> {
            return await this.replicant.invoke.getMaxScores({playerIds:playerIds || []});
    }

    public async UpdateLeaderboard(score:number, count?:number):Promise<{you:I.LeaderboardEntry, others:I.LeaderboardEntry[]}> {

        var leaderboard:FBInstant.Leaderboard = await this.GetLeaderboard();

        if (leaderboard) {
            await leaderboard.setScoreAsync(score);
            return await this.GetLeaderboardEntries(count || 10);
        }
        return null;
    }

    private async GetLeaderboard ():Promise<FBInstant.Leaderboard> {
        var contextID = this.gcinstant.contextID;
        if (!contextID) {
            console.log('unable to get leaderboard from a null contextID...');
            return null;
        }
        var leaderboard:FBInstant.Leaderboard = await this.gcinstant.getLeaderboardAsync("Leaderboard." + this.gcinstant.contextID)
        .then((l)=>{
            console.log('leaderboard fetched!');
            return l;
        })
        .catch((e)=>{
            console.log('unable to fetch leaderboard');
            return null;
        });
        return leaderboard;
    }

    public async GetLeaderboardEntries (count?:number):Promise<{you:I.LeaderboardEntry, others:I.LeaderboardEntry[]}>  {
        var leaderboard:FBInstant.Leaderboard = await this.GetLeaderboard();
        if (!leaderboard) return null;

        var ownEntry:I.LeaderboardEntry = await leaderboard.getPlayerEntryAsync()
        .then((entry:FBInstant.LeaderboardEntry)=>{
            console.log('own leaderboard entry fetched!');
            return {
                rank: entry.getRank(),
                score: entry.getScore(),
                timestamp: entry.getTimestamp(),
                profile: {
                    userName: entry.getPlayer().getName(),
                    userID: entry.getPlayer().getID(),
                    userPhoto: entry.getPlayer().getPhoto(),
                }
            };
        })
        .catch((e)=>{
            console.log('unable to get own leaderboard entry...');
            return null;
        });

        var allEntries:FBInstant.LeaderboardEntry[] = await leaderboard.getEntriesAsync(count || 10, 0);

        var otherEntries:I.LeaderboardEntry[] = [];
        for (var i:number = 0; i < allEntries.length; i++) {
            var entry = allEntries[i];
            otherEntries.push({
                rank: entry.getRank(),
                score: entry.getScore(),
                timestamp: entry.getTimestamp(),
                profile: {
                    userName: entry.getPlayer().getName(),
                    userID: entry.getPlayer().getID(),
                    userPhoto: entry.getPlayer().getPhoto(),
                }
            });
        }

        return {
            you: ownEntry,
            others: otherEntries
        }
    }

    // #endregion CUSTOM LEADERBOARD ///

    // #region FARMS & VOTES ///

    public async GetFarms (playerId:string) {
        return await this.replicant.invoke.getFarms({playerId: playerId});
    }

    public async SetFarm (farmIndex:number, farmValue:number) {
        return await this.replicant.invoke.setFarm({farmIndex: farmIndex, farmValue: farmValue});
    }

    public async Vote (playerId:string, voteValue:number) {
        return await this.replicant.invoke.vote({playerId: playerId, voteValue: voteValue});
    }

    // #endregion FARMS & VOTES ///

    // #region CURRENCIES ///

    public async SetCoins (coins:number) {
        await this.replicant.invoke.setCoins({coins: coins});
    }

    public async SetGems (gems:number) {
        await this.replicant.invoke.setGems({gems: gems});
    }

    // #endregion CURRENCIES ///

    // #region MESSAGES ///

    public async SendMessage (userID:string, type: string, content: any ) {
        await this.replicant.invoke.sendMessage({userID: userID, content: content, type: type});
    }

    public async LoadMessages () {
        return await this.CheckState().then(state=>state.messages);
    }

    // #endregion MESSAGES ///

    // #region CHALLENGES ///

    public async SendChallenge (newData:any):Promise<void | { receiverIDs: string[] }> {
        await this.check();
        var self = this;
        var now = self.replicant.now().toString();
        var challengeId = `challenge_${now}`;
        var challengeObj:I.Challenge = {
            sender: {
                userName: self.gcinstant.playerName,
                userID: self.gcinstant.playerID,
                userPhoto: self.gcinstant.playerPhoto
            },
            data: [newData],
            finished:false
        }

        console.log('creating challenge in global variable...');
        await self.replicant.kvStore.send(challengeId, JSON.stringify(challengeObj));

        console.log('broadcasting challenge in messenger...');
        await this.gcinstant.inviteAsync({
            data: {
                payload: {
                    action: "challenge_invite",
                    sender: {
                        userID: self.gcinstant.playerID,
                        userPhoto: self.gcinstant.playerPhoto,
                        userName: self.gcinstant.playerName
                    },
                    challengeId: challengeId
                },
                feature: "invite",
                $subFeature: "challenge",
                action: "invite",
            },
            displayNotification: true,
            text: `I challenge you in ${process.env.APP_NAME}!`,
            image: mainImage,
        });

        console.log('creating challenge in player state...');
        await self.replicant.invoke.createChallenge({challengeId: challengeId});

        console.log(`challenge sent!`);
        return Promise.resolve();
    }

    public async AcceptChallenge (payload:Record<string,any>):Promise<void> {
        console.log('enter from a challenge');
        var self = this;
        let senderID:string = payload.sender.userID;
        if (senderID != self.gcinstant.playerID) {
            let challengeId:string = payload.challengeId;

            console.log('fetching challenge in global variable...');
            let challengeRaw:string = await self.replicant.kvStore.get(challengeId, {forceFetch:true});
            if (challengeRaw == null) {
                console.log('challenge id not available');
                return Promise.resolve();
            }

            let challengeObj:I.Challenge = JSON.parse(challengeRaw);
            if (challengeObj.receiver != null) {
                console.log('this challenge has already accepted by someone');
                return Promise.resolve();
            }

            challengeObj.receiver = {
                userID: self.gcinstant.playerID,
                userName: self.gcinstant.playerName,
                userPhoto: self.gcinstant.playerPhoto
            }
            challengeObj.turn = self.gcinstant.playerID;
            
            console.log('accepting challenge in global variable...');
            await self.replicant.kvStore.send(challengeId, JSON.stringify(challengeObj));
            
            console.log('creating challenge in player state...');
            await self.replicant.invoke.acceptChallenge({userID:senderID, challengeId:challengeId});

            console.log('challenge accepted');
            return Promise.resolve();
        }

        console.log('cannot accept your own challenge');
        return Promise.resolve();
    }

    public async UpdateChallenge (challengeId:string, challengeData:any):Promise<void> {
        var self = this;

        console.log('fetching challenge in global variable...');
        let challengeRaw:string = await self.replicant.kvStore.get(challengeId, {forceFetch:true});
        if (challengeRaw == null) {
            console.log('challenge id not available');
            return Promise.resolve();
        }

        let challengeObj:I.Challenge = JSON.parse(challengeRaw);
        if (challengeObj.finished) {
            console.log('this challenge has already finished');
            return Promise.resolve();
        }
        if (challengeObj.turn == self.gcinstant.playerID) {
            challengeObj.data.push(challengeData);
            let nextTurn = challengeObj.sender.userID == self.gcinstant.playerID ? challengeObj.receiver.userID : challengeObj.sender.userID;
            challengeObj.turn = nextTurn;

            console.log('updating challenge in global variable...');
            await self.replicant.kvStore.send(challengeId, JSON.stringify(challengeObj));

            console.log('challenge updated');
            return Promise.resolve();
        }

        console.log('it is not your turn');
        return Promise.resolve();
    }

    public async FinishChallenge (challengeId:string):Promise<void> {
        var self = this;

        console.log('fetching challenge in global variable...');
        let challengeRaw:string = await self.replicant.kvStore.get(challengeId, {forceFetch:true});
        if (challengeRaw == null) {
            console.log('challenge id not available');
            return Promise.resolve();
        }

        let challengeObj:I.Challenge = JSON.parse(challengeRaw);
        if (challengeObj.finished) {
            console.log('this challenge has already finished');
            return Promise.resolve();
        }
        challengeObj.finished = true;
        let opponentId = challengeObj.sender.userID == self.gcinstant.playerID ? challengeObj.receiver.userID : challengeObj.sender.userID;

        console.log('finishing challenge in global variable...');
        await self.replicant.kvStore.send(challengeId, JSON.stringify(challengeObj));

        console.log('finishing challenge in player state...');
        await self.replicant.invoke.finishChallenge({userID: opponentId, challengeId:challengeId});

        console.log('challenge finished');
        return Promise.resolve();
    }

    public async ExploreChallenge (challengeId:string):Promise<any> {
        var self = this;

        console.log('fetching challenge in global variable...');
        let challengeRaw:string = await self.replicant.kvStore.get(challengeId, {forceFetch:true});
        if (challengeRaw == null) {
            console.log('challenge id not available');
            return Promise.resolve();
        }

        let challengeObj:I.Challenge = JSON.parse(challengeRaw);
        return Promise.resolve(challengeObj);
    } 

    // #endregion CHALLENGES ///
    
}

console.log('begin');
var abc = {};
console.log('end')

export const _global = (window /* browser */ || global /* node */) as any
_global.rpw = new Wrapper();
