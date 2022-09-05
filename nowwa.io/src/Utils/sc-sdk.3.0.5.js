(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@snapchat/minis-sdk"] = {}));
  })(this, (function (exports) { 'use strict';
  
    var __defProp = Object.defineProperty;
    var __defProps = Object.defineProperties;
    var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    var __spreadValues = (a, b) => {
      for (var prop in b || (b = {}))
        if (__hasOwnProp.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b)) {
          if (__propIsEnum.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        }
      return a;
    };
    var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  
    // src/client-events.ts
    var FocusEvents = /* @__PURE__ */ ((FocusEvents2) => {
      FocusEvents2["KEYBOARD"] = "KEYBOARD";
      FocusEvents2["INVITE_PICKER"] = "INVITE_PICKER";
      FocusEvents2["LEAVE_GAME_ALERT"] = "LEAVE_GAME_ALERT";
      FocusEvents2["PLAY_WITH_SCREEN"] = "PLAY_WITH_SCREEN";
      FocusEvents2["PAYMENT"] = "PAYMENT";
      FocusEvents2["REWARDED_VIDEO"] = "REWARDED_VIDEO";
      FocusEvents2["APP_BACKGROUND"] = "APP_BACKGROUND";
      FocusEvents2["SYSTEM_ALERT"] = "SYSTEM_ALERT";
      FocusEvents2["SETTINGS_SCREEN"] = "SETTINGS_SCREEN";
      FocusEvents2["CAMERA_SCREEN"] = "CAMERA_SCREEN";
      FocusEvents2["LEADERBOARD_SCREEN"] = "LEADERBOARD_SCREEN";
      FocusEvents2["SEND_TO_SCREEN"] = "SEND_TO_SCREEN";
      FocusEvents2["ACTION_MENU"] = "ACTION_MENU";
      FocusEvents2["TOKEN_SHOP"] = "TOKEN_SHOP";
      return FocusEvents2;
    })(FocusEvents || {});
    var ClientEvents = /* @__PURE__ */ ((ClientEvents2) => {
      ClientEvents2["VOLUME_CHANGED"] = "volumeChanged";
      ClientEvents2["AD_READY"] = "adReady";
      ClientEvents2["AD_COMPLETE"] = "adComplete";
      ClientEvents2["DID_LOSE_FOCUS"] = "didLoseFocus";
      ClientEvents2["DID_GAIN_FOCUS"] = "didGainFocus";
      ClientEvents2["SAFE_AREA_DID_UPDATE"] = "safeAreaDidUpdate";
      ClientEvents2["DID_PRESENT_LEADERBOARD"] = "didPresentLeaderboard";
      ClientEvents2["DID_DISMISS_LEADERBOARD"] = "didDismissLeaderboard";
      ClientEvents2["CREATE_SHORTCUT_COMPLETE"] = "createShortcutComplete";
      ClientEvents2["PERMISSIONS_DID_UPDATE"] = "permissionsDidUpdate";
      ClientEvents2["DID_DISMISS_LENS"] = "didDismissLens";
      return ClientEvents2;
    })(ClientEvents || {});
  
    // src/error.ts
    var ScError = class extends Error {
      constructor(code, reason = "") {
        super(reason);
        this.toString = () => {
          return JSON.stringify(this);
        };
        this.code = code;
        this.reason = reason;
      }
    };
    var ErrorCodes = /* @__PURE__ */ ((ErrorCodes2) => {
      ErrorCodes2["ALREADY_INITIALIZED"] = "ALREADY_INITIALIZED";
      ErrorCodes2["NOT_INITIALIZED"] = "NOT_INITIALIZED";
      ErrorCodes2["INVALID_CONTEXT"] = "INVALID_CONTEXT";
      ErrorCodes2["CLIENT_STATE_INVALID"] = "CLIENT_STATE_INVALID";
      ErrorCodes2["CLIENT_UNSUPPORTED"] = "CLIENT_UNSUPPORTED";
      ErrorCodes2["CONFLICT_REQUEST"] = "CONFLICT_REQUEST";
      ErrorCodes2["INVALID_PARAM"] = "INVALID_PARAM";
      ErrorCodes2["INVALID_STATE"] = "INVALID_STATE";
      ErrorCodes2["INTERNAL_ERROR"] = "INTERNAL_ERROR";
      ErrorCodes2["LENS_UNLOCK_FAILURE"] = "LENS_UNLOCK_FAILURE";
      ErrorCodes2["NETWORK_FAILURE"] = "NETWORK_FAILURE";
      ErrorCodes2["NETWORK_NOT_REACHABLE"] = "NETWORK_NOT_REACHABLE";
      ErrorCodes2["RATE_LIMITED"] = "RATE_LIMITED";
      ErrorCodes2["RESOURCE_NOT_AVAILABLE"] = "RESOURCE_NOT_AVAILABLE";
      ErrorCodes2["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
      ErrorCodes2["RV_NO_FILL"] = "RV_NO_FILL";
      ErrorCodes2["RV_NO_MATCH"] = "RV_NO_MATCH";
      ErrorCodes2["RV_NOT_LOADED"] = "RV_NOT_LOADED";
      ErrorCodes2["RV_RATE_LIMITED"] = "RV_RATE_LIMITED";
      ErrorCodes2["TOKEN_REVOKED_BY_SERVER"] = "TOKEN_REVOKED_BY_SERVER";
      ErrorCodes2["USER_PERMISSION_NOT_GRANTED"] = "USER_PERMISSION_NOT_GRANTED";
      ErrorCodes2["USER_REJECTION"] = "USER_REJECTION";
      ErrorCodes2["UNKNOWN_SCRIPT"] = "UNKNOWN_SCRIPT";
      ErrorCodes2["UNAUTHORIZED_USER"] = "UNAUTHORIZED_USER";
      ErrorCodes2["INVALID_CONFIG"] = "INVALID_CONFIG";
      ErrorCodes2["SHORTCUT_ADDED"] = "SHORTCUT_ADDED";
      ErrorCodes2["TOKEN_SHOP_DISABLED"] = "TOKEN_SHOP_DISABLED";
      ErrorCodes2["PURCHASE_FAIL"] = "PURCHASE_FAIL";
      return ErrorCodes2;
    })(ErrorCodes || {});
  
    // src/initialize.ts
    var Context = /* @__PURE__ */ ((Context2) => {
      Context2["CONVERSATION"] = "CONVERSATION";
      Context2["INDIVIDUAL"] = "INDIVIDUAL";
      return Context2;
    })(Context || {});
  
    // src/events.ts
    var EventHandler = class {
      constructor(parent, name, callback, scope) {
        this._parent = parent;
        this._name = name;
        this.callback = callback;
        this.scope = scope;
        this.once = false;
      }
      get name() {
        return this._name;
      }
      unbind() {
        if (!this._parent)
          return;
        this._parent = void 0;
        this.callback = void 0;
        this.scope = void 0;
      }
    };
    var Events = class {
      constructor() {
        this._callbacks = {};
      }
      on(name, callback, scope) {
        if (!this._callbacks[name])
          this._callbacks[name] = [];
        const event_ = new EventHandler(this, name, callback, scope || this);
        this._callbacks[name].push(event_);
        return event_;
      }
      once(name, callback, scope) {
        const event_ = this.on(name, callback, scope);
        if (!event_)
          return;
        event_.once = true;
        return event_;
      }
      unbind(name, callback, scope) {
        if (!name) {
          this._callbacks = {};
          return this;
        }
        if (!callback) {
          delete this._callbacks[name];
          return this;
        }
        const events = this._callbacks[name];
        if (!events)
          return this;
        const newCallBacks = [];
        for (const currEvent of this._callbacks[name]) {
          if (currEvent.callback !== callback || scope && currEvent.scope !== scope) {
            newCallBacks.push(currEvent);
          } else {
            currEvent.unbind();
          }
        }
        this._callbacks[name] = newCallBacks;
        return this;
      }
      emit(name, ...args) {
        if (!name || !this._callbacks[name])
          return this;
        const newCallBacks = [];
        for (const currEvent of this._callbacks[name]) {
          if (currEvent.callback) {
            currEvent.callback.call(currEvent.scope, ...args);
          }
          if (currEvent.once) {
            currEvent.unbind();
          } else {
            newCallBacks.push(currEvent);
          }
        }
        this._callbacks[name] = newCallBacks;
        if (!newCallBacks)
          delete this._callbacks[name];
        return this;
      }
    };
  
    // src/runtime.ts
    var Runtime = /* @__PURE__ */ ((Runtime2) => {
      Runtime2["ANDROID"] = "ANDROID";
      Runtime2["IOS"] = "IOS";
      Runtime2["LOCAL"] = "LOCAL";
      return Runtime2;
    })(Runtime || {});
    var getRuntime = () => {
      var _a;
      if ("Android" in window) {
        return "ANDROID" /* ANDROID */;
      }
      const urlParameters = new URLSearchParams(window.location.search);
      if (urlParameters.get("k")) {
        return "IOS" /* IOS */;
      }
      const platform = ((_a = navigator == null ? void 0 : navigator.userAgentData) == null ? void 0 : _a.platform.toLowerCase()) || (navigator == null ? void 0 : navigator.platform.toLowerCase()) || "unknown";
      if (platform.includes("win") || platform.includes("mac")) {
        return "LOCAL" /* LOCAL */;
      }
      throw new Error("could not find runtime");
    };
  
    // src/mini.ts
    var windowAsAny = window;
    var getAndAdjustWindowSafeAreaInsets = (runtime, safeAreaInsets) => {
      const { top, bottom } = safeAreaInsets;
      const dpr = window.devicePixelRatio;
      const returnValue = { top, bottom };
      const windowSafeAreaInsetTop = runtime === "LOCAL" /* LOCAL */ ? 0 : Math.floor(top / dpr);
      document.documentElement.style.setProperty("--window-safe-area-inset-top", `${windowSafeAreaInsetTop}px`);
      returnValue.top = windowSafeAreaInsetTop;
      const windowSafeAreaInsetBottom = runtime === "LOCAL" /* LOCAL */ ? 0 : Math.floor(bottom / dpr);
      document.documentElement.style.setProperty("--window-safe-area-inset-bottom", `${windowSafeAreaInsetBottom}px`);
      returnValue.bottom = windowSafeAreaInsetBottom;
      return returnValue;
    };
    var Mini = class {
      constructor(init, runtime, sendAcrossBridge, registerHandler) {
        this.on = (name, callback, scope) => {
          this.events.on(name, callback, scope);
          return;
        };
        this.once = (name, callback, scope) => {
          this.events.once(name, callback, scope);
          return;
        };
        this.unbind = (name, callback, scope) => {
          this.events.unbind(name, callback, scope);
        };
        this.emit = (name, ...args) => {
          this.events.emit(name, ...args);
        };
        this.setLoadingProgress = async (progress) => {
          return this._sendAcrossBridge("setLoadingProgress", {
            progress
          });
        };
        this.loadingComplete = async () => {
          return this._sendAcrossBridge("loadingComplete");
        };
        this.presentPrivacyPolicy = async () => {
          return this._sendAcrossBridge("presentPrivacyPolicy");
        };
        this.presentTermsOfService = async () => {
          return this._sendAcrossBridge("presentTermsOfService");
        };
        this.presentWebpage = async (url) => {
          return this._sendAcrossBridge("presentWebpage", {
            url
          });
        };
        this.getLaunchInfo = async () => {
          if (this.runtime === "LOCAL" /* LOCAL */) {
            return { launchInfo: { path: "", payload: "" } };
          }
          return {
            launchInfo: (await this._sendAcrossBridge("getShareInfo")).shareInfo
          };
        };
        this.registerEventHandlers = () => {
          this._registerHandler("setVolume", (volume) => {
            if (windowAsAny.pc) {
              windowAsAny.pc.app.systems.sound.volume = volume;
            }
            this.volume = volume;
            this.emit("volumeChanged" /* VOLUME_CHANGED */, volume);
          });
          this._registerHandler("didLoseFocus", (response) => {
            this.emit("didLoseFocus" /* DID_LOSE_FOCUS */, response);
          });
          this._registerHandler("didGainFocus", (response) => {
            this.emit("didGainFocus" /* DID_GAIN_FOCUS */, response);
          });
          this._registerHandler("safeAreaDidUpdate", (response) => {
            this.safeAreaInsets = response.safeAreaInsets;
            this.windowSafeAreaInsets = getAndAdjustWindowSafeAreaInsets(this.runtime, this.safeAreaInsets);
            this.emit("safeAreaDidUpdate" /* SAFE_AREA_DID_UPDATE */, response);
          });
          this._registerHandler("loadScriptFile", (types = [], callback) => {
            for (const type of types) {
              if (type === "WCL") {
                const console2 = window.console;
                if (console2) {
                  const consoleLogs = [];
                  const intercept = (method) => {
                    const original = console2[method];
                    console2[method] = (...arguments_) => {
                      consoleLogs.push("[" + new Date().toUTCString() + "] " + method + ": " + Array.prototype.slice.apply(arguments_).join(" "));
                      if (consoleLogs.length > 1e3) {
                        consoleLogs.shift();
                      }
                      if (original.apply) {
                        original.apply(console2, arguments_);
                      }
                    };
                  };
                  for (const method of [
                    "info",
                    "log",
                    "warn",
                    "error"
                  ])
                    intercept(method);
                  this._registerHandler("getConsoleLogs", (_, getLogsCallback) => getLogsCallback(consoleLogs));
                }
              } else {
                console.log(`Invalid type: ${type}`);
                if (callback) {
                  callback({
                    error: new ScError("UNKNOWN_SCRIPT" /* UNKNOWN_SCRIPT */, type)
                  });
                }
              }
            }
            if (callback) {
              callback();
            }
          });
        };
        this.user = init.user;
        this.projectId = init.projectId;
        this.sessionId = init.sessionId;
        this.runtime = runtime;
        this.env = init.env;
        this.context = init.context;
        this.conversationSize = init.conversationSize;
        this.locale = init.locale;
        this.safeAreaInsets = init.safeAreaInsets;
        this.windowSafeAreaInsets = getAndAdjustWindowSafeAreaInsets(runtime, init.safeAreaInsets);
        this.volume = init.volume;
        this.events = new Events();
        this._sendAcrossBridge = sendAcrossBridge;
        this._registerHandler = registerHandler;
        this.registerEventHandlers();
      }
    };
  
    // src/native/android.ts
    var windowAsAny2 = window;
    var AndroidBridge = class {
      constructor(currWindow = windowAsAny2) {
        this.currWindow = currWindow;
        this.setup = async () => {
          if ("bridge" in this.currWindow) {
            this.bridgeHandler = this.currWindow.bridge;
            return;
          }
          await new Promise((resolve, _reject) => {
            this.currWindow.jsBridgeSetupCallback = (b) => {
              this.bridgeHandler = b;
              resolve();
            };
          });
        };
        this.send = async (fullName, data) => {
          return new Promise((resolve, reject) => {
            this.bridgeHandler.callHandler(fullName, data, (resp) => {
              if ("error" in resp) {
                reject(new ScError(resp.error.code, resp.error.message));
              } else {
                resolve(resp);
              }
            });
          });
        };
        this.registerHandler = (key, callback) => {
          this.bridgeHandler.registerHandler(key, callback);
        };
      }
    };
  
    // src/native/methods.ts
    var MethodMapName = /* @__PURE__ */ new Map([
      ["initialize", "I"],
      ["playWithFriends", "PWF"],
      ["playWithStrangers", "PWS"],
      ["fetchAuthToken", "FAT"],
      ["loadingComplete", "LC"],
      ["setLoadingProgress", "SLP"],
      ["submitLeaderboardScore", "SLS"],
      ["presentLeaderboard", "PL"],
      ["fetchAvatar2D", "FA2D"],
      ["fetchAvatar3D", "FA3D"],
      ["localStorageSetData", "LSSD"],
      ["localStorageGetData", "LSGD"],
      ["localStorageDeleteData", "LSDD"],
      ["presentPrivacyPolicy", "PPP"],
      ["presentTermsOfService", "PTOS"],
      ["presentWebpage", "PW"],
      ["shareMediaToSnapchat", "SMTS"],
      ["shareLensToSnapchat", "SLTS"],
      ["logEvent", "LE"],
      ["shareAppToChat", "SATC"],
      ["getShareInfo", "GSI"],
      ["presentReportUI", "PRUI"],
      ["getUnconsumedPurchases", "GUP"],
      ["getAllProducts", "GAP"],
      ["getProducts", "GP"],
      ["purchase", "P"],
      ["consumePurchase", "CP"],
      ["isTokenShopSupported", "ITSS"],
      ["sendCustomUpdateToChat", "SCUTC"],
      ["sendUpdateNotification", "SUN"],
      ["switchAppSession", "SAS"],
      ["fetchOAuth2Token", "FOA2T"],
      ["onSubmitPayment", "OSP"],
      ["onPaymentCanceled", "OPC"],
      ["onShippingAddressChanged", "OSAC"],
      ["getDiscoverableFriends", "GDF"],
      ["switchToFriend", "STF"],
      ["getPermissions", "GP2"],
      ["requestPermission", "RP"],
      ["getUnconsumedAds", "GUA"],
      ["initializeAds", "IA"],
      ["watchAd", "WA"],
      ["consumeAd", "CA"],
      ["isAdReady", "IAR"],
      ["startLoggingFPS", "SLF"],
      ["endLoggingFPS", "ELF"],
      ["canCreateShortcut", "CCS"],
      ["createShortcut", "CS"],
      ["setVolume", "SV"],
      ["didTakeScreenshot", "DTS"],
      ["adReady", "AR"],
      ["adComplete", "AC"],
      ["didLoseFocus", "DLF"],
      ["didGainFocus", "DGF"],
      ["safeAreaDidUpdate", "SADU"],
      ["getConsoleLogs", "GCL"],
      ["didPresentLeaderboard", "DPL"],
      ["didDismissLens", "DDLE"],
      ["didDismissLeaderboard", "DDL"],
      ["getTestAutomationMetrics", "GTAM"],
      ["loadScriptFile", "LSF"],
      ["createShortcutComplete", "CSC"],
      ["permissionsDidUpdate", "PDU"]
    ]);
  
    // src/native/ios.ts
    var parseResponse = async (resp) => {
      const contentType = resp.headers.get("content-type");
      return contentType && contentType.includes("application/json") ? resp.json() : resp.text().then((t) => JSON.parse(t));
    };
    var iOSBridge = class {
      constructor(methodMap = MethodMapName) {
        this.methodMap = methodMap;
        this.eventHandlers = {};
        this.truncate = (fullName) => {
          const shortName = this.methodMap.get(fullName);
          if (shortName === void 0) {
            throw new Error("Unrecognized method name. Please check method-name-map.");
          } else {
            return shortName;
          }
        };
        this.setup = async () => {
          const args = window.location.search.slice(1).split("&");
          let k, p;
          for (const element of args) {
            const pair = element.split("=");
            const key = decodeURIComponent(pair[0]);
            if (key === "k") {
              k = decodeURIComponent(pair[1]);
            } else if (key === "p") {
              p = decodeURIComponent(pair[1]);
            }
          }
          if (!k) {
            throw new Error("no local bridge key on iOS");
          }
          if (!p) {
            if (window.location.port) {
              p = window.location.port;
            } else {
              throw new Error("no local bridge path on iOS");
            }
          }
          const path = location.pathname.replace(/[^/]*\.[^./]+$/, "").replace(/(^\/)|(\/$)/g, "");
          this.localServer = `http://127.0.0.1:${p}/${path ? `${path}/` : ""}`;
          this.key = encodeURIComponent(k);
          void this.nativeClientLongPoll();
        };
        this.send = async (fullName, data) => {
          const promise = this.sendHelper(this.truncate(fullName), data);
          return promise.then(async (resp) => new Promise((resolve, reject) => {
            if ("error" in resp) {
              reject(new ScError(resp.error.code, resp.error.message));
            } else {
              resolve(resp);
            }
          }));
        };
        this.sendHelper = async (type, data, rid) => {
          const url = `${this.localServer}C/${type}?k=${this.key}${data ? `&m=${encodeURIComponent(JSON.stringify(data))}` : ""}${rid ? `&rid=${encodeURIComponent(rid)}` : ""}`;
          const resp = await fetch(url);
          return parseResponse(resp);
        };
        this.longPollResponse = async (data, rid) => {
          return this.sendHelper("LPR", data, rid);
        };
        this.nativeClientLongPoll = async () => {
          let timeout;
          try {
            const controller = new AbortController();
            timeout = setTimeout(() => controller.abort(), 2e3);
            await this.longPollOnce();
          } catch (err) {
            console.error(`long poll from local server: ${err}`);
          } finally {
            clearTimeout(timeout);
            setTimeout(() => {
              void this.nativeClientLongPoll();
            }, 1e3);
          }
        };
        this.longPollOnce = async () => {
          const resp = await fetch(`${this.localServer}C/LPE?k=${this.key}`);
          if (!resp) {
            console.error("response did not anything");
            return;
          }
          if (resp.status !== 200) {
            console.error(`response did not return 200 ${resp.status}: ${resp.statusText}`);
            return;
          }
          const events = await parseResponse(resp);
          if (Array.isArray(events)) {
            for (const event of events) {
              if (event.t && this.eventHandlers) {
                const eventHandler = this.eventHandlers[event.t];
                if (eventHandler) {
                  eventHandler(event.m);
                } else {
                  return;
                }
                if (event.rid) {
                  await this.longPollResponse(event.m, event.rid);
                }
              }
            }
          }
        };
        this.registerHandler = (key, callback) => {
          this.eventHandlers[this.truncate(key)] = callback;
        };
      }
    };
  
    // src/native/index.ts
    var getNativeBridge = async (additionalMethodNames = /* @__PURE__ */ new Map()) => {
      if ("Android" in window) {
        return { bridge: new AndroidBridge(), runtime: "ANDROID" /* ANDROID */ };
      }
      return {
        bridge: new iOSBridge(new Map([...additionalMethodNames, ...MethodMapName])),
        runtime: "IOS" /* IOS */
      };
    };
  
    // src/user.ts
    var User = class {
      constructor(id, avatarId, name, color = "#FFFFFF") {
        this.id = id;
        this.avatarId = avatarId;
        this.name = name;
        this.color = color;
      }
    };
  
    // src/native/local.ts
    var throwAwayEmpty = (s) => {
      if (s) {
        return s;
      }
      return null;
    };
    var LocalBridge = class {
      constructor() {
        this.setup = async () => {
          console.log("using local bridge");
        };
        this.send = async (fullName, data) => {
          console.log(`Calling: ${fullName} ${data ? `with ${JSON.stringify(data)}` : ""}`);
          return { success: true };
        };
        this.registerHandler = (key) => {
          console.log(`Registering callback for ${key}`);
        };
        this.initialize = (request) => {
          var _a, _b, _c, _d, _e, _f;
          const urlParameters = new URLSearchParams(window.location.search);
          return {
            projectId: request.projectId,
            context: request.context,
            env: request.env,
            sessionId: (_a = throwAwayEmpty(urlParameters.get("sessionId"))) != null ? _a : request.sessionId,
            conversationSize: (_b = request.conversationSize) != null ? _b : 1,
            locale: request.locale,
            user: new User((_c = throwAwayEmpty(urlParameters.get("userId"))) != null ? _c : request.user.id, (_d = throwAwayEmpty(urlParameters.get("avatarId"))) != null ? _d : request.user.avatarId, (_e = throwAwayEmpty(urlParameters.get("username"))) != null ? _e : request.user.name, (_f = throwAwayEmpty(urlParameters.get("color"))) != null ? _f : request.user.color),
            safeAreaInsets: request.safeAreaInsets,
            volume: request.volume
          };
        };
      }
    };
  
    // src/initialize-mini.ts
    var minimumClientSupportedVersion = 20220531;
    var _mini;
    var _components = {};
    var parseLocalOptions = (localOptions) => {
      const defaultOptions = {
        projectId: `test-project-id-${Math.random().toString(36).slice(2, 10)}`,
        context: "INDIVIDUAL" /* INDIVIDUAL */,
        env: "dev",
        sessionId: "test-session-id",
        conversationSize: 1,
        locale: navigator.language,
        volume: 1
      };
      const userAndInsets = {
        user: __spreadValues({
          id: "test-user",
          avatarId: "f104fd89-0b71-4b43-9fa0-71b20fded6da",
          name: "test-username",
          color: "#fffc00"
        }, localOptions == null ? void 0 : localOptions.user),
        safeAreaInsets: __spreadValues({
          top: 0,
          bottom: 0
        }, localOptions == null ? void 0 : localOptions.safeAreaInsets)
      };
      return __spreadValues(__spreadValues(__spreadValues({}, defaultOptions), localOptions), userAndInsets);
    };
    var initializeMini = async (devOpts) => {
      if (_mini) {
        throw new ScError("ALREADY_INITIALIZED" /* ALREADY_INITIALIZED */, "initializeMini has already been called");
      }
      return initializeMiniInternal(parseLocalOptions(devOpts), minimumClientSupportedVersion, getNativeBridge);
    };
    var getMini = () => {
      if (_mini) {
        return _mini;
      }
      throw new ScError("NOT_INITIALIZED" /* NOT_INITIALIZED */, "initializeMini must be called first");
    };
    var initializeMiniInternal = async (localParams, minimumClientSupportedVersion2, getBridge, additionalMethodNames) => {
      _mini = await (getRuntime() === "LOCAL" /* LOCAL */ ? initializeLocalBridge(localParams) : setupAndInitializeBridge(minimumClientSupportedVersion2, getBridge, additionalMethodNames));
      return _mini;
    };
    var initializeLocalBridge = async (localParams) => {
      const localB = new LocalBridge();
      await localB.setup();
      _mini = new Mini(localB.initialize(localParams), "LOCAL" /* LOCAL */, localB.send, localB.registerHandler);
      return _mini;
    };
    var setupAndInitializeBridge = async (minimumClientSupportedVersion2, getBridge, additionalMethodNames) => {
      const { bridge, runtime } = await getBridge(additionalMethodNames);
      try {
        await bridge.setup();
        const response = await bridge.send("initialize", {
          minimumClientSupportedVersion: minimumClientSupportedVersion2
        });
        _mini = new Mini(formatInitializeResponse(response), runtime, bridge.send, bridge.registerHandler);
      } catch (err) {
        throw new Error(`failed to initializeMini from bridge: ${err}`);
      }
      return _mini;
    };
    var formatInitializeResponse = (response) => {
      var _a;
      return __spreadProps(__spreadValues({}, response), {
        projectId: response.applicationId,
        conversationSize: (_a = response.conversationSize) != null ? _a : 1,
        user: new User(response.user.id, response.user.avatarId, response.user.name, response.user.color)
      });
    };
  
    // src/api/ads/ads.ts
    var getAds = () => {
      let a = _components.ads;
      if (a) {
        return a;
      }
      const mini = getMini();
      mini._registerHandler("adReady", (slotId) => {
        mini.emit("adReady" /* AD_READY */, slotId);
      });
      mini._registerHandler("adComplete", (response) => {
        mini.emit("adComplete" /* AD_COMPLETE */, response);
      });
      a = mini.runtime === "LOCAL" /* LOCAL */ ? new Local() : new Native(mini);
      _components.ads = a;
      return a;
    };
    var Local = class {
      async initializeAds() {
        return { url: "localTesting" };
      }
      async getUnconsumedAds() {
        return { unconsumedAds: [] };
      }
      async isAdReady() {
        return { isReady: false };
      }
      async watchAd() {
        return { requestId: "localTesting" };
      }
      async consumeAd(requestId) {
        if (requestId === "localTesting") {
          return;
        }
        throw "can only consume 'localTesting' requestId on local";
      }
    };
    var Native = class {
      constructor(app) {
        this.app = app;
        this.initializeAds = async (slotIds) => {
          return this.app._sendAcrossBridge("initializeAds", {
            slotIds
          });
        };
        this.getUnconsumedAds = async () => {
          return this.app._sendAcrossBridge("getUnconsumedAds");
        };
        this.isAdReady = async (slotId) => {
          return this.app._sendAcrossBridge("isAdReady", { slotId });
        };
        this.watchAd = async (slotId, developerPayload) => {
          return this.app._sendAcrossBridge("watchAd", {
            slotId,
            developerPayload
          });
        };
        this.consumeAd = async (requestId) => {
          return this.app._sendAcrossBridge("consumeAd", {
            requestId
          });
        };
      }
    };
  
    // src/api/analytics/events.ts
    var LoggingEvents = /* @__PURE__ */ ((LoggingEvents2) => {
      LoggingEvents2["ONBOARDING_START"] = "ONBOARDING_START";
      LoggingEvents2["ONBOARDING_STAGE_COMPLETE"] = "ONBOARDING_STAGE_COMPLETE";
      LoggingEvents2["ONBOARDING_COMPLETE"] = "ONBOARDING_COMPLETE";
      LoggingEvents2["CLICK_PLAY"] = "CLICK_PLAY";
      LoggingEvents2["MATCH_START"] = "MATCH_START";
      LoggingEvents2["MATCH_END"] = "MATCH_END";
      LoggingEvents2["SHOP_START"] = "SHOP_START";
      LoggingEvents2["SHOP_EXIT"] = "SHOP_EXIT";
      LoggingEvents2["SHOP_TRANSACTION"] = "SHOP_TRANSACTION";
      LoggingEvents2["VIEW_CONTENT"] = "VIEW_CONTENT";
      LoggingEvents2["RATE"] = "RATE";
      LoggingEvents2["RESERVE"] = "RESERVE";
      LoggingEvents2["SEARCH"] = "SEARCH";
      LoggingEvents2["PAGE_VIEW"] = "PAGE_VIEW";
      LoggingEvents2["LIST_VIEW"] = "LIST_VIEW";
      LoggingEvents2["COMPLETE_TUTORIAL"] = "COMPLETE_TUTORIAL";
      LoggingEvents2["LEVEL_COMPLETE"] = "LEVEL_COMPLETE";
      LoggingEvents2["ACHIEVEMENT_UNLOCKED"] = "ACHIEVEMENT_UNLOCKED";
      LoggingEvents2["SIGN_UP"] = "SIGN_UP";
      LoggingEvents2["LOGIN"] = "LOGIN";
      LoggingEvents2["PURCHASE"] = "PURCHASE";
      LoggingEvents2["SUBSCRIBE"] = "SUBSCRIBE";
      LoggingEvents2["SPEND_CREDIT"] = "SPEND_CREDIT";
      LoggingEvents2["START_TRIAL"] = "START_TRIAL";
      LoggingEvents2["ADD_TO_WISHLIST"] = "ADD_TO_WISHLIST";
      LoggingEvents2["START_CHECKOUT"] = "START_CHECKOUT";
      LoggingEvents2["EXIT_CHECKOUT"] = "EXIT_CHECKOUT";
      LoggingEvents2["ADD_CART"] = "ADD_CART";
      LoggingEvents2["ADD_BILLING"] = "ADD_BILLING";
      LoggingEvents2["INVITE"] = "INVITE";
      LoggingEvents2["CUSTOM_EVENT_1"] = "CUSTOM_EVENT_1";
      LoggingEvents2["CUSTOM_EVENT_2"] = "CUSTOM_EVENT_2";
      LoggingEvents2["CUSTOM_EVENT_3"] = "CUSTOM_EVENT_3";
      LoggingEvents2["CUSTOM_EVENT_4"] = "CUSTOM_EVENT_4";
      LoggingEvents2["CUSTOM_EVENT_5"] = "CUSTOM_EVENT_5";
      return LoggingEvents2;
    })(LoggingEvents || {});
    var LoggingEventParameters = /* @__PURE__ */ ((LoggingEventParameters2) => {
      LoggingEventParameters2["STAGE_ID"] = "STAGE_ID";
      LoggingEventParameters2["ONBOARDING_TIME"] = "ONBOARDING_TIME";
      LoggingEventParameters2["ENTRY"] = "ENTRY";
      LoggingEventParameters2["MATCH_TYPE"] = "MATCH_TYPE";
      LoggingEventParameters2["MATCH_ID"] = "MATCH_ID";
      LoggingEventParameters2["MATCH_TIME"] = "MATCH_TIME";
      LoggingEventParameters2["SHOP_TIME"] = "SHOP_TIME";
      LoggingEventParameters2["ITEM_ID"] = "ITEM_ID";
      LoggingEventParameters2["SOURCE"] = "SOURCE";
      LoggingEventParameters2["PAYMENT_TYPE"] = "PAYMENT_TYPE";
      LoggingEventParameters2["PRICE"] = "PRICE";
      LoggingEventParameters2["ITEM_CATEGORY"] = "ITEM_CATEGORY";
      LoggingEventParameters2["SUCCESS"] = "SUCCESS";
      LoggingEventParameters2["TRANSACTION_ID"] = "TRANSACTION_ID";
      LoggingEventParameters2["CURRENCY"] = "CURRENCY";
      LoggingEventParameters2["SEACH_STRING"] = "SEARCH_STRING";
      LoggingEventParameters2["PAGE_INFORMATION"] = "PAGE_INFORMATION";
      LoggingEventParameters2["PAYMENT_INFO_AVAILABLE"] = "PAYMENT_INFO_AVAILABLE";
      LoggingEventParameters2["NUMBER_ITEMS"] = "NUMBER_ITEMS";
      return LoggingEventParameters2;
    })(LoggingEventParameters || {});
  
    // src/api/analytics/log.ts
    var logEvent = async (eventName, parameters) => {
      return getMini()._sendAcrossBridge("logEvent", {
        eventName,
        parameters
      });
    };
  
    // src/api/auth/auth.ts
    var _auth;
    var getAuth = () => {
      if (_auth) {
        return _auth;
      }
      _auth = new AuthClient(getMini());
      return _auth;
    };
    var AuthClient = class {
      constructor(mini) {
        this.mini = mini;
        this.testTokenURL = "https://gcp.api.snapchat.com/games/auth/get_test_token?";
        this.authTokenExpiration = 0;
        this.cacheAuthToken = (token) => {
          if (!token) {
            this.authToken = token;
            this.authTokenExpiration = 0;
            return;
          }
          this.authToken = token;
          const jwt = JSON.parse(atob(token.split(".")[1]));
          this.authTokenExpiration = Date.now() + (Number.parseInt(jwt.exp) - Number.parseInt(jwt.iat) + 10) * 1e3;
        };
        this.sessionId = mini.sessionId;
        this._fetchSnapCanvasAuthToken = this.mini.runtime !== "LOCAL" /* LOCAL */ ? async () => {
          return mini._sendAcrossBridge("fetchAuthToken");
        } : async () => {
          const res = await fetch(`${this.testTokenURL}application_id=${this.mini.projectId}&user_id=${this.mini.user.id}&session_id=${this.mini.sessionId}`);
          const body = await res.text();
          return { token: body };
        };
        this.fetchOAuth2Token = this.mini.runtime !== "LOCAL" /* LOCAL */ ? async () => {
          return mini._sendAcrossBridge("fetchOAuth2Token");
        } : async () => {
          throw new Error("fetchOAuth2Token is not supported from local right now");
        };
      }
      async fetchAuthToken() {
        if (this.mini.sessionId === this.sessionId && this.authTokenExpiration > Date.now() + 5e3) {
          return { token: this.authToken };
        }
        const response = await this._fetchSnapCanvasAuthToken();
        if (response.token) {
          this.cacheAuthToken(response.token);
        }
        if (this.mini.sessionId !== this.sessionId) {
          this.sessionId = this.mini.sessionId;
        }
        return response;
      }
    };
  
    // src/api/bitmoji/constants.ts
    var AvatarVariants = /* @__PURE__ */ ((AvatarVariants2) => {
      AvatarVariants2["ANGRY"] = "10212034";
      AvatarVariants2["ARMS_RELAXED"] = "20023753";
      AvatarVariants2["ASLEEP"] = "10226430";
      AvatarVariants2["BIG_SMILE"] = "10226441";
      AvatarVariants2["BIG_SURPRISE"] = "10225967";
      AvatarVariants2["BIRTHDAY"] = "10226437";
      AvatarVariants2["BLUE"] = "10226463";
      AvatarVariants2["CAT"] = "20004331";
      AvatarVariants2["CHEEKY"] = "20004325";
      AvatarVariants2["CONFUSED"] = "20004327";
      AvatarVariants2["COVERED_COLD"] = "10226681";
      AvatarVariants2["COVERED_HEARTS"] = "10226425";
      AvatarVariants2["COVERED_EYES"] = "10226700";
      AvatarVariants2["COVERED_MOUTH"] = "10226710";
      AvatarVariants2["CROWN"] = "10219581";
      AvatarVariants2["CRY"] = "20004319";
      AvatarVariants2["DEER"] = "20004329";
      AvatarVariants2["DEFAULT"] = "20004322";
      AvatarVariants2["DEVIL"] = "10226594";
      AvatarVariants2["DIZZY"] = "10226812";
      AvatarVariants2["DOG"] = "10226798";
      AvatarVariants2["DOG_DALMATIAN"] = "10226805";
      AvatarVariants2["EMBARRASSED"] = "10228567";
      AvatarVariants2["EVIL"] = "10221921";
      AvatarVariants2["EYE_ROLL"] = "10226013";
      AvatarVariants2["FLOATING_HEARTS"] = "10226807";
      AvatarVariants2["FLOATING_HEARTS_CHRISTMAS"] = "10226809";
      AvatarVariants2["GRIN"] = "10226025";
      AvatarVariants2["HALO"] = "10226813";
      AvatarVariants2["HAPPY"] = "20004321";
      AvatarVariants2["HEART_EYES"] = "10226454";
      AvatarVariants2["HEART_ORBIT"] = "20061987";
      AvatarVariants2["HEARTBREAK"] = "10227483";
      AvatarVariants2["HEART_HEADBAND"] = "20061402";
      AvatarVariants2["KISS"] = "10212029";
      AvatarVariants2["LAUGH_CRY"] = "10225943";
      AvatarVariants2["LETS_EAT"] = "10226727";
      AvatarVariants2["MASK_BLACK_HISTORY"] = "20061656";
      AvatarVariants2["MASK_BLANK"] = "20052085";
      AvatarVariants2["MASK_BLM"] = "20052760";
      AvatarVariants2["MASK_PRIDE"] = "20052163";
      AvatarVariants2["MONEY_EYES"] = "20004337";
      AvatarVariants2["PEEK"] = "10208529";
      AvatarVariants2["PHONE_HAPPY"] = "10226259";
      AvatarVariants2["PHONE_HEART_EYES"] = "10226690";
      AvatarVariants2["PHONE_UNHAPPY"] = "10226688";
      AvatarVariants2["POWER_FIST"] = "20048519";
      AvatarVariants2["PUKING_RAINBOWS"] = "10226487";
      AvatarVariants2["RAGE"] = "10226820";
      AvatarVariants2["RAINBOW"] = "20004336";
      AvatarVariants2["RELAX"] = "20004326";
      AvatarVariants2["RELAXED"] = "10226442";
      AvatarVariants2["RELAXED_GRIN"] = "10226029";
      AvatarVariants2["ROLL"] = "10212047";
      AvatarVariants2["SAD"] = "10232166";
      AvatarVariants2["SCREAM"] = "10225994";
      AvatarVariants2["SHH"] = "10219373";
      AvatarVariants2["SHOCK"] = "10225970";
      AvatarVariants2["SHRUG"] = "9422789";
      AvatarVariants2["SHUSH"] = "10226723";
      AvatarVariants2["SICK"] = "10226396";
      AvatarVariants2["SLEEP"] = "10212036";
      AvatarVariants2["SMILE"] = "10226021";
      AvatarVariants2["SPA"] = "10226662";
      AvatarVariants2["SQUINT_GRIN"] = "10226440";
      AvatarVariants2["SQUINT_SMILE"] = "10226022";
      AvatarVariants2["STAY_TUNED"] = "10214712";
      AvatarVariants2["SUNGLASSES"] = "10223291";
      AvatarVariants2["SURPRISE"] = "20004323";
      AvatarVariants2["SUSPICIOUS"] = "10226843";
      AvatarVariants2["SWEAT"] = "10226427";
      AvatarVariants2["TEARS"] = "10225984";
      AvatarVariants2["THINKING"] = "20004317";
      AvatarVariants2["TONGUE_OUT"] = "10226473";
      AvatarVariants2["VERY_SUSPICIOUS"] = "10226822";
      AvatarVariants2["WAVE"] = "10211812";
      AvatarVariants2["WINK"] = "10226428";
      AvatarVariants2["WINK_TONGUE_OUT"] = "10226605";
      AvatarVariants2["YAWN"] = "10226724";
      AvatarVariants2["ZIPPED_LIP"] = "10225989";
      return AvatarVariants2;
    })(AvatarVariants || {});
    var BitmojiVariants = /* @__PURE__ */ ((BitmojiVariants2) => {
      BitmojiVariants2["USER"] = "USER";
      BitmojiVariants2["GROUP"] = "GROUP";
      return BitmojiVariants2;
    })(BitmojiVariants || {});
    var Test3dAvatarIds = [
      "1ead45b2-7e38-48a8-b121-6c998bf1becf",
      "4ab75fc9-fdae-4431-8976-c6571c06fbaf",
      "35e5af98-7e43-4057-a01c-2a80ac85e614",
      "8673bd37-3d91-4f46-a560-6a0931c74f7a",
      "6e21e203-f10d-4d69-ba04-1129671a298a",
      "05a2f2cc-7768-439c-914f-13e0c0527669",
      "c3e2ca7e-6023-42eb-9928-1de03e4874ac",
      "d8145ed9-70aa-4466-814a-04598494ded2",
      "0f2e4758-5d90-4623-9f3c-ee6c3d93aa5c",
      "920770b0-880f-4845-8db5-7160f3c84e9a",
      "e6661449-09a7-4009-81e7-4462f5388228",
      "36f8f3e6-6744-463e-985b-c9e1ccbd1fb1",
      "ef40e498-5324-4eb2-af39-c09587451a85",
      "5c88c5d1-2359-4ea7-83af-fc2743c3fa24",
      "6aa12757-bab8-456f-a125-b6b98742d4a3",
      "4835715c-dbf1-4570-9890-ee6ccc097727",
      "ecce82bd-cd96-498b-a1b5-c0df8a7a527f",
      "7fe0988a-6a73-4416-8e2e-fdbddbae5242",
      "251286c3-4bab-47b7-9641-0ae36c740e70",
      "dca38ce6-6b9c-4859-ac51-c8d8e7f486ee",
      "c44a71d1-7585-4d32-90c6-00076e092afe",
      "a2fd5b4f-9e60-41db-acf9-8e36c45a23ec",
      "9af0dad8-2c45-4972-a1ad-55a7cadbee3b",
      "983c116b-2d63-42d5-b472-3ec7bacdef70",
      "91248c5f-7a25-47e3-b969-36bc8768e8ca",
      "e3c98d76-43ec-4b11-ba1c-604589612cf5"
    ];
  
    // src/api/bitmoji/bitmoji.ts
    var getBitmoji = () => {
      const b = _components.bitmoji;
      if (b) {
        return b;
      }
      const mini = getMini();
      _components.bitmoji = mini.runtime === "LOCAL" /* LOCAL */ ? new Local2(mini) : new Native2(mini);
      return _components.bitmoji;
    };
    var Native2 = class {
      constructor(app) {
        this.app = app;
        this.fetchAvatar2D = async (avatarId, variant, size) => {
          return this.app._sendAcrossBridge("fetchAvatar2D", {
            avatarId,
            variant,
            size
          });
        };
        this.fetchAvatar3D = async (avatarId) => {
          return this.app._sendAcrossBridge("fetchAvatar3D", {
            avatarId
          });
        };
      }
    };
    var Local2 = class {
      constructor(app) {
        this.app = app;
        this.fetchAvatar2D = async (avatarId, variant, size) => {
          return {
            url: `https://images.bitmoji.com/render/panel/${variant}-${avatarId}-v1.png?transparent=1&width=${size > 0 ? size : 256}`
          };
        };
        this.fetchAvatar3D = async (avatarId) => {
          if (Test3dAvatarIds.includes(avatarId)) {
            return {
              url: `https://bitmoji.api.snapchat.com/bitmoji-for-games/test_avatar?avatar_id=${avatarId}&lod=3&pbr=true`
            };
          }
          throw new ScError("INVALID_PARAM" /* INVALID_PARAM */, "avatarId cannot be fetched local try a testing one");
        };
      }
    };
  
    // src/network/gateway.ts
    var APP_ENV_HEADER = "x-snap-games-app-env";
    var FETCH_TIMEOUT_MS = 1e3;
    var fetchGateway = async (path, body, runtime, env, authClient = getAuth()) => {
      const resp = await authClient.fetchAuthToken();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      return fetch(path, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resp.token}`,
          [APP_ENV_HEADER]: runtime === "LOCAL" /* LOCAL */ ? env : ""
        },
        body
      }).then(async (response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        throwHTTPError(response);
        return;
      }).finally(() => clearTimeout(timeout));
    };
    var throwHTTPError = (response) => {
      switch (response.status) {
        case 400:
          throw new ScError("INVALID_PARAM" /* INVALID_PARAM */, response.statusText);
        case 403:
          throw new ScError("INVALID_CONFIG" /* INVALID_CONFIG */, "app is not authorized to use this method");
        case 429:
          throw new ScError("RATE_LIMITED" /* RATE_LIMITED */, "rate limited");
        default:
          throw new ScError("INTERNAL_ERROR" /* INTERNAL_ERROR */, "internal error");
      }
    };
  
    // src/api/leaderboards/leaderboards.ts
    var getLeaderboards = () => {
      let lb = _components.leaderboards;
      if (lb) {
        return lb;
      }
      const mini = getMini();
      mini._registerHandler("didPresentLeaderboard", (response) => {
        mini.emit("didPresentLeaderboard" /* DID_PRESENT_LEADERBOARD */, response);
      });
      mini._registerHandler("didDismissLeaderboard", (response) => {
        mini.emit("didDismissLeaderboard" /* DID_DISMISS_LEADERBOARD */, response);
      });
      lb = mini.runtime === "LOCAL" /* LOCAL */ ? new Local3() : new Native3(mini);
      _components.leaderboards = lb;
      return lb;
    };
    var Local3 = class {
      async getScores() {
        return {
          records: {
            "123": {
              userId: "123",
              score: 100,
              displayScore: "100",
              globalExactRank: 9,
              globalPercentileRank: 99
            }
          }
        };
      }
      async presentLeaderboard() {
        return { success: true };
      }
      async submitScore() {
        return { success: true };
      }
    };
    var Native3 = class {
      constructor(app, auth = getAuth(), apiURL = "https://us-central1-gcp.api.snapchat.com/leaderboards/v1/") {
        this.app = app;
        this.auth = auth;
        this.apiURL = apiURL;
        this.getScores = async (leaderboardId, ...userIds) => {
          const oauth2Response = await this.auth.fetchOAuth2Token();
          const url = this.apiURL + "getUserRecords";
          const bearer = `Bearer ${oauth2Response.token}`;
          const body = JSON.stringify({
            leaderboardId,
            userIds
          });
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: bearer
            },
            body
          });
          if (res.status !== 200) {
            throwHTTPError(res);
          }
          const response = await res.json();
          const records = {};
          if (response.records) {
            for (const rec of response.records) {
              records[rec.userId] = __spreadProps(__spreadValues({}, rec), {
                score: Number(rec.score),
                globalExactRank: Number(rec.globalExactRank)
              });
            }
          }
          return { records };
        };
        this.submitScore = async (leaderboardId, score) => {
          return this.app._sendAcrossBridge("submitLeaderboardScore", {
            leaderboardId,
            score
          });
        };
        this.presentLeaderboard = async (leaderboardId) => {
          return this.app._sendAcrossBridge("presentLeaderboard", {
            leaderboardId
          });
        };
      }
    };
  
    // src/api/localstorage.ts
    var getLocalStorage = () => {
      if (_components.localStorage) {
        return _components.localStorage;
      }
      _components.localStorage = new Native4(getMini());
      return _components.localStorage;
    };
    var Native4 = class {
      constructor(app) {
        this.app = app;
        this.getData = async (keys) => {
          return this.app._sendAcrossBridge("localStorageGetData", {
            keys
          });
        };
        this.setData = async (data) => {
          return this.app._sendAcrossBridge("localStorageSetData", {
            data
          });
        };
        this.deleteData = async (keys) => {
          return this.app._sendAcrossBridge("localStorageDeleteData", {
            keys
          });
        };
      }
    };
  
    // src/network/canvas-api.ts
    var queryCanvasApi = async (auth, query) => {
      var _a, _b, _c, _d, _e, _f;
      const oauth2Response = await auth.fetchOAuth2Token();
      const url = "https://us-central1-gcp.api.snapchat.com/canvasapi/graphql";
      const bearer = `Bearer ${oauth2Response.token}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearer
        },
        body: JSON.stringify({
          query
        })
      });
      if (res.status !== 200) {
        throw new ScError("NETWORK_FAILURE" /* NETWORK_FAILURE */);
      }
      const json = await res.json();
      if (!((_a = json.errors) == null ? void 0 : _a[0])) {
        return json;
      }
      const errorCode = (_d = (_c = (_b = json.errors) == null ? void 0 : _b[0]) == null ? void 0 : _c.extensions) == null ? void 0 : _d.code;
      const errorMessage = (_f = (_e = json.errors) == null ? void 0 : _e[0]) == null ? void 0 : _f.messag;
      let errCode;
      switch (errorCode) {
        case "RATE_LIMITED": {
          errCode = "RATE_LIMITED" /* RATE_LIMITED */;
          break;
        }
        case "UNAUTHORIZED_APP": {
          errCode = "INVALID_CONFIG" /* INVALID_CONFIG */;
          break;
        }
        case "UNAUTHORIZED_USER": {
          errCode = "UNAUTHORIZED_USER" /* UNAUTHORIZED_USER */;
          break;
        }
        default: {
          errCode = "INTERNAL_ERROR" /* INTERNAL_ERROR */;
        }
      }
      throw new ScError(errCode, errorMessage);
    };
  
    // src/api/permissions/age-gate.ts
    var validateAgeThreshold = async () => {
      const mini = getMini();
      if (mini.runtime === "LOCAL" /* LOCAL */) {
        return { isAgeValid: true };
      }
      return queryCanvasApi(getAuth(), "query { me { ageGate } }").then((res) => {
        if (res.data.me.ageGate !== void 0) {
          return { isAgeValid: res.data.me.ageGate };
        }
        throw new ScError("INTERNAL_ERROR" /* INTERNAL_ERROR */);
      });
    };
  
    // src/api/permissions/types.ts
    var PermissionValue = /* @__PURE__ */ ((PermissionValue2) => {
      PermissionValue2["ALLOW"] = "ALLOW";
      PermissionValue2["DENY"] = "DENY";
      PermissionValue2["NONE"] = "NONE";
      return PermissionValue2;
    })(PermissionValue || {});
    var PermissionScope = /* @__PURE__ */ ((PermissionScope2) => {
      PermissionScope2["ACTIVITY_VISIBILITY"] = "ACTIVITY_VISIBILITY";
      return PermissionScope2;
    })(PermissionScope || {});
  
    // src/api/permissions/permissions.ts
    var getPermissions = () => {
      let p = _components.permissions;
      if (p) {
        return p;
      }
      const mini = getMini();
      mini._registerHandler("permissionsDidUpdate", (response) => {
        mini.emit("permissionsDidUpdate" /* PERMISSIONS_DID_UPDATE */, response);
      });
      p = mini.runtime === "LOCAL" /* LOCAL */ ? new Local4() : new Native5(mini);
      _components.permissions = p;
      return p;
    };
    var Local4 = class {
      async getPermissions() {
        return {
          permissions: {
            ACTIVITY_VISIBILITY: {
              permissionScope: "ACTIVITY_VISIBILITY" /* ACTIVITY_VISIBILITY */,
              permissionValue: "ALLOW" /* ALLOW */
            }
          }
        };
      }
      async requestPermission() {
        return {
          permissions: {
            ACTIVITY_VISIBILITY: {
              permissionScope: "ACTIVITY_VISIBILITY" /* ACTIVITY_VISIBILITY */,
              permissionValue: "ALLOW" /* ALLOW */
            }
          }
        };
      }
    };
    var Native5 = class {
      constructor(app) {
        this.app = app;
        this.getPermissions = async (permissionScopes) => {
          return this.app._sendAcrossBridge("getPermissions", {
            permissionScopes
          });
        };
        this.requestPermission = async (permissionScope) => {
          return this.app._sendAcrossBridge("requestPermission", {
            permissionScope
          });
        };
      }
    };
  
    // src/api/polls/client.ts
    var _polls;
    var getPolls = () => {
      if (_polls) {
        return _polls;
      }
      _polls = new PollsClient(getMini(), getAuth());
      return _polls;
    };
    var PollsClient = class {
      constructor(mini, auth) {
        this.mini = mini;
        this.auth = auth;
        this.apiURL = "https://gcp.api.snapchat.com/games/storage/v1/polls/";
      }
      getPath(method) {
        let path = this.apiURL;
        path += method;
        return path;
      }
      async createPoll(scope, metadata, choices) {
        const body = {
          scope,
          metadata,
          choices
        };
        return fetchGateway(this.getPath("createPoll"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth).then((r) => r.poll);
      }
      async listPolls(scope, cursor = "", limit = 10) {
        const body = {
          scope,
          cursor,
          limit
        };
        return fetchGateway(this.getPath("listPolls"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth).then((r) => {
          return {
            polls: r.polls,
            cursor: r.cursor
          };
        });
      }
      async getPoll(scope, poll_id) {
        const body = {
          scope,
          poll_id
        };
        return fetchGateway(this.getPath("getPoll"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth).then((r) => r.poll);
      }
      async vote(scope, poll_id, choice_ids) {
        const body = {
          scope,
          poll_id,
          choice_ids
        };
        return fetchGateway(this.getPath("vote"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth);
      }
      async getVotes(scope, poll_id) {
        const body = {
          scope,
          poll_id
        };
        return fetchGateway(this.getPath("getVotes"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth);
      }
      async deletePoll(scope, poll_id) {
        const body = {
          scope,
          poll_id
        };
        return fetchGateway(this.getPath("deletePoll"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth);
      }
    };
  
    // src/api/sharing/sharing.ts
    var getSharing = () => {
      let s = _components.sharing;
      if (s) {
        return s;
      }
      const mini = getMini();
      mini._registerHandler("didDismissLens", (response) => {
        mini.emit("didDismissLens" /* DID_DISMISS_LENS */, response);
      });
      s = mini.runtime === "LOCAL" /* LOCAL */ ? new Local5(mini) : new Native6(mini);
      _components.sharing = s;
      return s;
    };
    var isShareCard = (card) => {
      return "headline" in card;
    };
    var Native6 = class {
      constructor(mini) {
        this.mini = mini;
        this.launchCameraWithLens = async (lensUUID, launchInfo = { path: "", payload: "" }, lensLaunchData, enableFullScreenMode = false) => {
          return this.mini._sendAcrossBridge("shareLensToSnapchat", {
            lensUUID,
            shareInfo: launchInfo,
            lensLaunchData,
            enableFullScreenMode
          }).then(async () => {
            return new Promise((resolve) => {
              this.mini.once("didDismissLens" /* DID_DISMISS_LENS */, (resp) => resolve(resp));
            });
          });
        };
        this.launchCameraWithStickers = async (stickers, launchInfo = { path: "", payload: "" }) => {
          return this.mini._sendAcrossBridge("shareMediaToSnapchat", {
            stickers,
            shareInfo: launchInfo
          });
        };
        this.sendShareCardToChat = async (card, launchInfo = { path: "", payload: "" }) => {
          return this.mini._sendAcrossBridge("shareAppToChat", {
            shareCard: isShareCard(card) ? card : null,
            imageShareCard: isShareCard(card) ? null : card,
            shareInfo: launchInfo
          });
        };
      }
    };
    var Local5 = class extends Native6 {
      constructor() {
        super(...arguments);
        this.launchCameraWithLens = async (lensUUID, launchInfo = { path: "", payload: "" }, lensLaunchData, enableFullScreenMode = false) => {
          await this.mini._sendAcrossBridge("shareLensToSnapchat", {
            lensUUID,
            shareInfo: launchInfo,
            lensLaunchData,
            enableFullScreenMode
          });
          return { lensUUID };
        };
      }
    };
  
    // src/api/shortcut.ts
    var getShortcut = () => {
      let s = _components.shortcut;
      if (s) {
        return s;
      }
      const mini = getMini();
      mini._registerHandler("createShortcutComplete", (response) => {
        mini.emit("createShortcutComplete" /* CREATE_SHORTCUT_COMPLETE */, response);
      });
      s = mini.runtime === "ANDROID" /* ANDROID */ ? new Android(mini) : new Disabled();
      _components.shortcut = s;
      return s;
    };
    var Disabled = class {
      async canCreateShortcut() {
        return {
          canCreate: false,
          failureReason: "CLIENT_UNSUPPORTED" /* CLIENT_UNSUPPORTED */
        };
      }
      async createShortcut() {
        throw new ScError("CLIENT_UNSUPPORTED" /* CLIENT_UNSUPPORTED */);
      }
    };
    var Android = class {
      constructor(mini) {
        this.mini = mini;
        this.canCreateShortcut = async () => {
          return this.mini._sendAcrossBridge("canCreateShortcut");
        };
        this.createShortcut = async () => {
          return this.mini._sendAcrossBridge("createShortcut");
        };
      }
    };
  
    // src/api/social/social.ts
    var getSocial = () => {
      let s = _components.social;
      if (s) {
        return s;
      }
      const mini = getMini();
      s = mini.runtime === "LOCAL" /* LOCAL */ ? new Local6() : new Native7(mini);
      _components.social = s;
      return s;
    };
    var Local6 = class {
      constructor() {
        this.switchToIndividualSession = async () => {
          throw "cannot switch to individual from local";
        };
      }
      async discoverFriends() {
        return { friends: [] };
      }
      async getParticipants(sessionIds) {
        const res = {};
        for (const s of sessionIds) {
          res[s] = [];
        }
        return {
          participants: res
        };
      }
      async getSessions() {
        return { sessions: [] };
      }
      async playWithFriends() {
        throw "cannot play with friends from local";
      }
      async switchToSession() {
        throw "cannot switch app session from local";
      }
      async switchToFriend() {
        throw "cannot switch to friend from local";
      }
    };
    var Native7 = class {
      constructor(mini, auth = getAuth()) {
        this.mini = mini;
        this.auth = auth;
        this.playWithFriends = async (maxNumberOfPlayers) => {
          const resp = await this.mini._sendAcrossBridge("playWithFriends", {
            maxNumberOfPlayers
          });
          this.mini.sessionId = resp.sessionId;
          this.mini.conversationSize = resp.conversationSize;
          this.mini.context = "CONVERSATION" /* CONVERSATION */;
          this.mini.user = new User(resp.user.id, resp.user.avatarId, resp.user.name, resp.user.color);
          return resp;
        };
        this.switchToFriend = async (friendId) => {
          const resp = await this.mini._sendAcrossBridge("switchToFriend", {
            friendId
          });
          this.mini.sessionId = resp.sessionId;
          this.mini.conversationSize = 2;
          this.mini.context = "CONVERSATION" /* CONVERSATION */;
          return resp;
        };
        this.switchToSession = async (targetSessionId) => {
          const resp = await this.mini._sendAcrossBridge("switchAppSession", {
            targetSessionId
          });
          this.mini.sessionId = targetSessionId;
          this.mini.conversationSize = resp.conversationSize;
          this.mini.context = resp.context;
          return resp;
        };
        this.switchToIndividualSession = async () => {
          if (this.mini.context === "INDIVIDUAL" /* INDIVIDUAL */) {
            throw new ScError("INVALID_CONTEXT" /* INVALID_CONTEXT */, "already in the individual context");
          }
          const response = await this.mini._sendAcrossBridge("playWithStrangers");
          this.mini.sessionId = response.sessionId;
          this.mini.conversationSize = 1;
          this.mini.context = "INDIVIDUAL" /* INDIVIDUAL */;
          return response;
        };
        this.discoverFriends = async () => {
          if (this.discoverableFriends) {
            return { friends: this.discoverableFriends };
          }
          const queryFields = "discoverableFriends { abbreviatedDisplayName externalAvatarID externalUserID }";
          const query = `query { me { discoverable { ${queryFields} } } }`;
          return queryCanvasApi(this.auth, query).then((res) => {
            const friendsResponse = res.data.me.discoverable.discoverableFriends;
            if (friendsResponse) {
              const friends = friendsResponse.map((friend) => {
                return {
                  id: friend.externalUserID,
                  name: friend.abbreviatedDisplayName,
                  avatarId: friend.externalAvatarID
                };
              });
              this.discoverableFriends = friends;
              return { friends };
            }
            throw new ScError("INTERNAL_ERROR" /* INTERNAL_ERROR */);
          });
        };
        this.getParticipants = async (sessionIds) => {
          if (sessionIds.length > 10) {
            throw new ScError("INVALID_PARAM" /* INVALID_PARAM */);
          }
          const sessionIdsJSON = JSON.stringify(sessionIds);
          const queryFields = "participants { abbreviatedDisplayName externalAvatarID externalUserID} sessionID";
          const query = `query { me { connection { participants(sessionIDs: ${sessionIdsJSON} ) { ${queryFields} } } } }`;
          return queryCanvasApi(this.auth, query).then((res) => {
            const { participants } = res.data.me.connection;
            if (participants) {
              const participantsResponse = {};
              for (const participant of participants) {
                const sessionId = participant.sessionID;
                participantsResponse[sessionId] = participant.participants.map((index) => {
                  return {
                    id: index.externalUserID,
                    name: index.abbreviatedDisplayName,
                    avatarId: index.externalAvatarID
                  };
                });
              }
              return { participants: participantsResponse };
            }
            throw new ScError("INTERNAL_ERROR" /* INTERNAL_ERROR */);
          });
        };
        this.getSessions = async () => {
          const query = "query { me { connection { sessions { sessionID participantsCount} } } }";
          return queryCanvasApi(this.auth, query).then((res) => {
            const { sessions } = res.data.me.connection;
            if (sessions) {
              const sessionsResponse = sessions.map((session) => ({
                sessionId: session.sessionID,
                participantCount: session.participantsCount
              }));
              return { sessions: sessionsResponse };
            }
            throw new ScError("INTERNAL_ERROR" /* INTERNAL_ERROR */);
          });
        };
      }
    };
  
    // src/api/storage/types.ts
    var Status = /* @__PURE__ */ ((Status2) => {
      Status2["OK"] = "OK";
      Status2["INVALID_ARGUMENT"] = "INVALID_ARGUMENT";
      Status2["NOT_FOUND"] = "NOT_FOUND";
      Status2["PERMISSION_DENIED"] = "PERMISSION_DENIED";
      Status2["INTERNAL_ERROR"] = "INTERNAL_ERROR";
      return Status2;
    })(Status || {});
    var Scope = /* @__PURE__ */ ((Scope2) => {
      Scope2["USER"] = "USER";
      Scope2["SESSION"] = "SESSION";
      Scope2["APP"] = "APP";
      return Scope2;
    })(Scope || {});
  
    // src/api/storage/codes.ts
    var codeToStatus = (code) => {
      switch (code) {
        case 0:
          return "OK" /* OK */;
        case 3:
          return "INVALID_ARGUMENT" /* INVALID_ARGUMENT */;
        case 5:
          return "NOT_FOUND" /* NOT_FOUND */;
        case 7:
          return "PERMISSION_DENIED" /* PERMISSION_DENIED */;
        default:
          return "INTERNAL_ERROR" /* INTERNAL_ERROR */;
      }
    };
  
    // src/api/storage/parse.ts
    var b64EncodeUnicode = (str) => {
      return btoa(encodeURIComponent(str).replace(/%([\dA-F]{2})/g, (_match, p1) => {
        return String.fromCharCode(Number("0x" + p1));
      }));
    };
    var b64DecodeUnicode = (str) => {
      return decodeURIComponent(atob(str).split("").map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
    };
    var deserializeData = (data) => {
      if (!data) {
        return [];
      }
      try {
        return data.map((d) => {
          const { entry, status } = d;
          return {
            entry: {
              key: entry.key,
              value: entry.value ? JSON.parse(b64DecodeUnicode(entry.value)) : void 0
            },
            status: {
              code: status.code ? codeToStatus(status.code) : "OK" /* OK */
            }
          };
        });
      } catch (err) {
        throw new Error(`Failed to deserialize cloud storage data. ${err}`);
      }
    };
    var serializeData = (data) => {
      try {
        return data.map((d) => {
          return {
            key: d.key,
            value: d.value ? b64EncodeUnicode(JSON.stringify(d.value)) : void 0
          };
        });
      } catch (err) {
        throw new Error(`Failed to serialize cloud storage data. ${err}`);
      }
    };
  
    // src/api/storage/client.ts
    var _storage;
    var getStorage = () => {
      if (_storage) {
        return _storage;
      }
      _storage = new StorageClient(getMini(), getAuth());
      return _storage;
    };
    var StorageClient = class {
      constructor(mini, auth, setTTL = mini.runtime === "LOCAL" /* LOCAL */ ? 30 * 24 * 3600 : 0) {
        this.mini = mini;
        this.auth = auth;
        this.setTTL = setTTL;
        this.apiURL = "https://gcp.api.snapchat.com/games/storage/v1/";
      }
      getPath(scope, method) {
        let path = this.apiURL;
        switch (scope) {
          case "USER" /* USER */:
            path += "user/";
            break;
          case "SESSION" /* SESSION */:
            path += "session/";
            break;
          case "APP" /* APP */:
            path += "app/";
            break;
          default:
            throw new ScError("INVALID_PARAM" /* INVALID_PARAM */, `scope: "${scope}" is not supported`);
        }
        path += method;
        return path;
      }
      async getData(scope, collection, keys) {
        const body = {
          collection,
          keys
        };
        return fetchGateway(this.getPath(scope, "getData"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth).then((r) => {
          return {
            responses: deserializeData(r.responses)
          };
        });
      }
      async scanData(scope, collection, limit = 100, cursor = "") {
        const body = {
          collection,
          cursor,
          limit
        };
        return fetchGateway(this.getPath(scope, "scanData"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth).then((r) => {
          return {
            responses: deserializeData(r.responses),
            cursor: r.cursor
          };
        });
      }
      async setData(scope, collection, data, ttlSec = this.setTTL) {
        if (scope === "APP" /* APP */) {
          throw new ScError("INVALID_PARAM" /* INVALID_PARAM */, "can not set cloud storage app data.");
        }
        const body = {
          collection,
          data: serializeData(data),
          permission: 1
        };
        if (ttlSec > 0) {
          body.ttl_sec = ttlSec;
        }
        return fetchGateway(this.getPath(scope, "putData"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth);
      }
      async deleteData(scope, collection, keys) {
        if (scope === "APP" /* APP */) {
          throw new ScError("INVALID_PARAM" /* INVALID_PARAM */, "can not delete cloud storage app data.");
        }
        const body = {
          collection,
          keys
        };
        return fetchGateway(this.getPath(scope, "deleteData"), JSON.stringify(body), this.mini.runtime, this.mini.env, this.auth);
      }
    };
  
    // src/api/tokens/tokens.ts
    var getTokens = () => {
      let t = _components.tokens;
      if (t) {
        return t;
      }
      const mini = getMini();
      switch (mini.runtime) {
        case "ANDROID" /* ANDROID */:
          t = new Native8(mini);
          break;
        case "IOS" /* IOS */:
          t = new iOS();
          break;
        case "LOCAL" /* LOCAL */:
          t = new Local7();
          break;
      }
      _components.tokens = t;
      return t;
    };
    var Local7 = class {
      async isSupported() {
        return { isEnabled: false };
      }
      async consumePurchase() {
        throw "cannot consume purchase on local";
      }
      async getAllProducts() {
        return { products: [] };
      }
      async getProducts() {
        return { products: [] };
      }
      async getUnconsumedPurchases() {
        return { unconsumedPurchases: [] };
      }
      async purchase() {
        throw "cannot purchase on local";
      }
    };
    var iOSErr = new ScError("TOKEN_SHOP_DISABLED" /* TOKEN_SHOP_DISABLED */, "Token shop is not supported on this client");
    var iOS = class {
      async isSupported() {
        return { isEnabled: false };
      }
      async consumePurchase() {
        throw iOSErr;
      }
      async getAllProducts() {
        throw iOSErr;
      }
      async getProducts() {
        throw iOSErr;
      }
      async getUnconsumedPurchases() {
        throw iOSErr;
      }
      async purchase() {
        throw iOSErr;
      }
    };
    var Native8 = class {
      constructor(app) {
        this.app = app;
        this.isSupported = async () => {
          return this.app._sendAcrossBridge("isTokenShopSupported");
        };
        this.getUnconsumedPurchases = async () => {
          return this.app._sendAcrossBridge("getUnconsumedPurchases");
        };
        this.getAllProducts = async () => {
          return this.app._sendAcrossBridge("getAllProducts", {});
        };
        this.getProducts = async (skus) => {
          return this.app._sendAcrossBridge("getProducts", {
            skus
          });
        };
        this.purchase = async (sku) => {
          if (!sku) {
            throw new ScError("INVALID_PARAM" /* INVALID_PARAM */, "attempting to purchase empty sku.");
          }
          return this.app._sendAcrossBridge("purchase", {
            sku
          });
        };
        this.consumePurchase = async (transactionId) => {
          if (!transactionId) {
            throw new ScError("INVALID_PARAM" /* INVALID_PARAM */, "attempting to purchase empty transactionId.");
          }
          return this.app._sendAcrossBridge("consumePurchase", {
            transactionId
          });
        };
      }
    };
  
    // src/api/updates/updates.ts
    var getUpdates = () => {
      let s = _components.updates;
      if (s) {
        return s;
      }
      const mini = getMini();
      s = mini.runtime === "LOCAL" /* LOCAL */ ? new Local8(mini) : new Native9(mini);
      _components.updates = s;
      return s;
    };
    var Native9 = class {
      constructor(mini, auth = getAuth()) {
        this.mini = mini;
        this.auth = auth;
        this.sendCustomNotification = async (updateId, inputs) => {
          if (this.mini.context === "INDIVIDUAL" /* INDIVIDUAL */) {
            throw new ScError("INVALID_CONTEXT" /* INVALID_CONTEXT */, "sendCustomNotification cannot be called in individual context");
          }
          return this.mini._sendAcrossBridge("sendUpdateNotification", {
            updateId,
            inputs
          });
        };
        this.sendCustomChatMessage = async (updateId, inputs, bitmojiVariant, launchInfo = { path: "", payload: "" }) => {
          if (this.mini.context === "INDIVIDUAL" /* INDIVIDUAL */) {
            throw new ScError("INVALID_CONTEXT" /* INVALID_CONTEXT */, "sendCustomChatMessage cannot be called in individual context");
          }
          return this.mini._sendAcrossBridge("sendCustomUpdateToChat", {
            updateId,
            inputs,
            bitmojiVariant,
            shareInfo: launchInfo
          });
        };
        this.sendHappeningNowUpdateToSelf = async (updateId, inputs, thumbnail, startTimeMs = Date.now(), endTimeMs = startTimeMs + 48 * 60 * 60 * 1e3, launchInfo = { path: "", payload: "" }) => {
          const oauth2Response = await this.auth.fetchOAuth2Token();
          const url = "https://us-central1-gcp.api.snapchat.com/updates/v1/happeningNow/self";
          const bearer = `Bearer ${oauth2Response.token}`;
          const body = JSON.stringify(__spreadProps(__spreadValues({
            updateId,
            inputs
          }, this._createHappeningNowThumbnail(thumbnail)), {
            startTimeMs,
            endTimeMs,
            updateInfo: launchInfo
          }));
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: bearer
            },
            body
          });
          if (res.status !== 200) {
            throwHTTPError(res);
          }
        };
        this.sendHappeningNowUpdateToConversation = async (updateId, includeSelf, inputs, thumbnail, startTimeMs = Date.now(), endTimeMs = startTimeMs + 48 * 60 * 60 * 1e3, launchInfo = { path: "", payload: "" }) => {
          if (this.mini.context === "INDIVIDUAL" /* INDIVIDUAL */) {
            throw new ScError("INVALID_CONTEXT" /* INVALID_CONTEXT */, "sendHappeningNowUpdateToConversation cannot be called in individual context");
          }
          const oauth2Response = await this.auth.fetchOAuth2Token();
          const canvasToken = await this.auth.fetchAuthToken();
          const url = "https://us-central1-gcp.api.snapchat.com/updates/v1/happeningNow/conversation";
          const bearer = `Bearer ${oauth2Response.token}`;
          const body = JSON.stringify(__spreadProps(__spreadValues({
            updateId,
            includeSelf,
            inputs
          }, this._createHappeningNowThumbnail(thumbnail)), {
            startTimeMs,
            endTimeMs,
            updateInfo: launchInfo
          }));
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: bearer,
              "X-Snap-Canvas-Token": canvasToken.token
            },
            body
          });
          if (res.status !== 200) {
            throwHTTPError(res);
          }
        };
        this.sendHappeningNowUpdateToFriends = async (updateId, inputs, thumbnail, startTimeMs = Date.now(), endTimeMs = startTimeMs + 48 * 60 * 60 * 1e3) => {
          const oauth2Response = await this.auth.fetchOAuth2Token();
          const url = "https://us-central1-gcp.api.snapchat.com/updates/v1/happeningNow/friends";
          const bearer = `Bearer ${oauth2Response.token}`;
          const body = JSON.stringify(__spreadProps(__spreadValues({
            updateId,
            inputs
          }, this._createHappeningNowThumbnail(thumbnail)), {
            startTimeMs,
            endTimeMs
          }));
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: bearer
            },
            body
          });
          if (res.status !== 200) {
            throwHTTPError(res);
          }
        };
        this._createHappeningNowThumbnail = (thumbnail) => {
          const isBitmojiThumbnail = (thumbnail2) => {
            return "userId" in thumbnail2;
          };
          return {
            renderId: isBitmojiThumbnail(thumbnail) ? thumbnail.userId : null,
            thumbnailUrl: isBitmojiThumbnail(thumbnail) ? null : thumbnail.url
          };
        };
      }
    };
    var Local8 = class extends Native9 {
      constructor() {
        super(...arguments);
        this.sendHappeningNowUpdateToSelf = async (updateId, inputs, thumbnail, startTimeMs = Date.now(), endTimeMs = startTimeMs + 48 * 60 * 60 * 1e3, launchInfo = { path: "", payload: "" }) => {
          console.log(JSON.stringify(__spreadProps(__spreadValues({
            updateId,
            inputs
          }, this._createHappeningNowThumbnail(thumbnail)), {
            startTimeMs,
            endTimeMs,
            updateInfo: launchInfo
          })));
        };
        this.sendHappeningNowUpdateToConversation = async (updateId, includeSelf, inputs, thumbnail, startTimeMs = Date.now(), endTimeMs = startTimeMs + 48 * 60 * 60 * 1e3, launchInfo = { path: "", payload: "" }) => {
          if (this.mini.context === "INDIVIDUAL" /* INDIVIDUAL */) {
            throw new ScError("INVALID_CONTEXT" /* INVALID_CONTEXT */, "sendHappeningNowUpdateToConversation cannot be called in individual context");
          }
          console.log(JSON.stringify(__spreadProps(__spreadValues({
            updateId,
            includeSelf,
            inputs
          }, this._createHappeningNowThumbnail(thumbnail)), {
            startTimeMs,
            endTimeMs,
            updateInfo: launchInfo
          })));
        };
        this.sendHappeningNowUpdateToFriends = async (updateId, inputs, thumbnail, startTimeMs = Date.now(), endTimeMs = startTimeMs + 48 * 60 * 60 * 1e3) => {
          console.log(JSON.stringify(__spreadProps(__spreadValues({
            updateId,
            inputs
          }, this._createHappeningNowThumbnail(thumbnail)), {
            startTimeMs,
            endTimeMs
          })));
        };
      }
    };
  
    // package.json
    var version = "3.0.5";
  
    // src/version.ts
    var sdkVersion = version;
  
    exports.AvatarVariants = AvatarVariants;
    exports.BitmojiVariants = BitmojiVariants;
    exports.ClientEvents = ClientEvents;
    exports.Context = Context;
    exports.ErrorCodes = ErrorCodes;
    exports.FocusEvents = FocusEvents;
    exports.LoggingEventParameters = LoggingEventParameters;
    exports.LoggingEvents = LoggingEvents;
    exports.Mini = Mini;
    exports.PermissionScope = PermissionScope;
    exports.PermissionValue = PermissionValue;
    exports.Runtime = Runtime;
    exports.ScError = ScError;
    exports.Scope = Scope;
    exports.Status = Status;
    exports.Test3dAvatarIds = Test3dAvatarIds;
    exports.User = User;
    exports.getAds = getAds;
    exports.getAuth = getAuth;
    exports.getBitmoji = getBitmoji;
    exports.getLeaderboards = getLeaderboards;
    exports.getLocalStorage = getLocalStorage;
    exports.getMini = getMini;
    exports.getPermissions = getPermissions;
    exports.getPolls = getPolls;
    exports.getSharing = getSharing;
    exports.getShortcut = getShortcut;
    exports.getSocial = getSocial;
    exports.getStorage = getStorage;
    exports.getTokens = getTokens;
    exports.getUpdates = getUpdates;
    exports.initializeMini = initializeMini;
    exports.logEvent = logEvent;
    exports.sdkVersion = sdkVersion;
    exports.validateAgeThreshold = validateAgeThreshold;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  