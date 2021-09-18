import { TwitchSettings } from "../types";

export default class AppSettingsElement extends HTMLElement {
  public onsave?: (settings: Omit<TwitchSettings, "secret">) => void;

  static get observedAttributes(): string[] {
    return ["client-id", "client-secret", "redirect-uri", "channel"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.shadowRoot.innerHTML = `<form>
      <dl>
        <dt>
          <label for="client-id">Client ID:</label>
        </dt>
        <dd>
          <input id="client-id" />
        </dd>
        <dt>
          <label for="client-secret">Client secret:<label>
        </dt>
        <dd>
          <input type="password" id="client-secret" />
        </dd>
        <dt>
          <label for="redirect-uri">Redirect URI:</label>
        </dt>
        <dd>
          <input id="redirect-uri" />
        </dd>
        <dt>
          <label for="channel">Channel name</label>
        </dt>
        <dd>
          <input id="channel" />
        </dd>
      </dl>
      <button id="save-button">Save</button>
    </form>`;

    this.shadowRoot.getElementById("save-button").onclick =
      this.save.bind(this);
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (
      AppSettingsElement.observedAttributes.includes(name) &&
      newValue !== oldValue
    ) {
      this.setInputValue(name, newValue);
    }
  }

  private save(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.onsave?.({
      clientId: this.getInputValue("client-id"),
      clientSecret: this.getInputValue("client-secret"),
      redirectUri: this.getInputValue("redirect-uri"),
      channel: this.getInputValue("channel"),
    });
  }

  private getInputValue(id: string): string {
    return (this.shadowRoot.getElementById(id) as HTMLInputElement).value;
  }

  private setInputValue(id: string, value: string): void {
    (this.shadowRoot.getElementById(id) as HTMLInputElement).value = value;
  }
}

export const AppSettingsTagName = "app-settings";

customElements.define(AppSettingsTagName, AppSettingsElement);
