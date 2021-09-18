import { TwitchSettings } from "../types";
import AppSettingsElement, { AppSettingsTagName } from "./AppSettings";

export default class AppElement extends HTMLElement {
  private settingsElement: AppSettingsElement;

  public set onsavesettings(
    newFn: (settings: Omit<TwitchSettings, "secret">) => void
  ) {
    this.settingsElement.onsave = newFn;
  }

  public set onrequestsettings(newFn: () => Promise<TwitchSettings>) {
    newFn().then((settings) => {
      this.settingsElement.setAttribute("client-id", settings.clientId);
      this.settingsElement.setAttribute("client-secret", settings.clientSecret);
      this.settingsElement.setAttribute("redirect-uri", settings.redirectUri);
      this.settingsElement.setAttribute("channel", settings.channel);
    });
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.settingsElement = document.createElement(
      AppSettingsTagName
    ) as AppSettingsElement;
  }

  connectedCallback(): void {
    this.shadowRoot.innerHTML = `
      <h1>Twitch Settings</h1>
    `;
    this.shadowRoot.appendChild(this.settingsElement);
  }
}

export const AppTagName = "twitch-app";

customElements.define(AppTagName, AppElement);
