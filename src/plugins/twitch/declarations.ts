import { TwitchSettings } from "./types";

declare global {
  interface Window {
    twitch: {
      getAppSettings: () => Promise<TwitchSettings>;
      setAppSettings: (
        arg: Omit<TwitchSettings, "secret">
      ) => Promise<TwitchSettings>;
    };
  }
}

export default "";
