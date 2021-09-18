import { contextBridge, ipcRenderer } from "electron";
import { TwitchSettings } from "./types";

contextBridge.exposeInMainWorld("twitch", {
  getAppSettings() {
    return new Promise<TwitchSettings>((resolve) => {
      ipcRenderer.once("twitch.get-settings", (_event, arg: TwitchSettings) =>
        resolve(arg)
      );
      ipcRenderer.send("twitch.get-settings");
    });
  },
  setAppSettings(arg: Omit<TwitchSettings, "secret">) {
    return new Promise<TwitchSettings>((resolve) => {
      ipcRenderer.once("twitch.get-settings", (_event, arg: TwitchSettings) =>
        resolve(arg)
      );
      ipcRenderer.send("twitch.set-settings", arg);
    });
  },
});
