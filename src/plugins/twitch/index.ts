import { ipcMain, BrowserWindow } from "electron";
import { EventEmitter } from "events";
import store from "electron-settings";
import { v4 } from "uuid";

import { ApiClient } from "@twurple/api";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { ElectronAuthProvider } from "@twurple/auth-electron";
import { EventSubListener } from "@twurple/eventsub";
import { NgrokAdapter } from "@twurple/eventsub-ngrok";
import { Emit } from "../../types";
import { TwitchSettings } from "./types";
import {
  getCheerListener,
  getFollowListener,
  getSubscribeListener,
} from "./listeners";

declare const TWITCH_WINDOW_WEBPACK_ENTRY: string;
declare const TWITCH_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let adapter: NgrokAdapter;

function createTwitchSettingsWindow() {
  const settingsEmitter = new EventEmitter();

  const twitchWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: TWITCH_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  ipcMain.on("twitch.get-settings", async () => {
    twitchWindow.webContents.send(
      "twitch.get-settings",
      await store.get("twitch")
    );
  });

  ipcMain.on("twitch.set-settings", async (_, arg) => {
    const secret = await store.get("twitch.secret");
    await store.set("twitch", { ...arg, secret });

    settingsEmitter.emit("settings_updated", arg);

    twitchWindow.webContents.send(
      "twitch.get-settings",
      await store.get("twitch")
    );
  });

  twitchWindow.loadURL(TWITCH_WINDOW_WEBPACK_ENTRY);

  return settingsEmitter;
}

async function listen(emit: Emit, settings: TwitchSettings) {
  try {
    const authProvider = new ClientCredentialsAuthProvider(
      settings.clientId,
      settings.clientSecret
    );

    const apiClient = new ApiClient({
      authProvider,
    });

    const user = await apiClient.users.getUserByName(settings.channel);

    adapter = adapter ?? new NgrokAdapter();

    const listener = new EventSubListener({
      apiClient,
      adapter,
      secret: settings.secret,
    });

    const electronAuthProvider = new ElectronAuthProvider({
      clientId: settings.clientId,
      redirectUri: settings.redirectUri,
    });

    electronAuthProvider.allowUserChange();

    await electronAuthProvider.getAccessToken([
      "bits:read",
      "channel:read:subscriptions",
      "channel:read:redemptions",
    ]);

    await listener.listen();

    const followSubscription = await listener
      .subscribeToChannelFollowEvents(user.id, getFollowListener(emit))
      .catch(async (e) => {
        await listener.unlisten();
        throw e;
      });

    const cheerSubscription = await listener
      .subscribeToChannelCheerEvents(user.id, getCheerListener(emit))
      .catch(async (e) => {
        await followSubscription.stop();
        await listener.unlisten();
        throw e;
      });

    const subscribeSubscription = await listener
      .subscribeToChannelSubscriptionEvents(user.id, getSubscribeListener(emit))
      .catch(async (e) => {
        await followSubscription.stop();
        await cheerSubscription.stop();
        await listener.unlisten();
        throw e;
      });

    return async () => {
      await Promise.all([
        followSubscription.stop(),
        cheerSubscription.stop(),
        subscribeSubscription.stop(),
      ]);
      await listener.unlisten();
      await apiClient.eventSub.deleteAllSubscriptions();
    };
  } catch (e) {
    console.error(e);
  }
}

export default async function setup(emit: Emit): Promise<() => void> {
  let stopServer: () => Promise<void>;

  async function startServer() {
    await stopServer?.();
    stopServer = undefined;

    const settings = (await store.get("twitch")) as unknown as TwitchSettings;

    if (
      settings.clientId &&
      settings.clientSecret &&
      settings.redirectUri &&
      settings.channel &&
      settings.secret
    ) {
      stopServer = await listen(emit, settings);
    }
  }

  if (!(await store.get("twitch"))) {
    await store.set("twitch", {
      clientId: "",
      clientSecret: "",
      redirectUri: "",
      channel: "",
      secret: v4(),
    });
  }

  startServer();

  const settingsWindow = createTwitchSettingsWindow();

  settingsWindow.on("settings_updated", startServer);

  return () => stopServer?.();
}
