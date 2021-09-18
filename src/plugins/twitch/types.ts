export interface TwitchSettings {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  channel: string;
  secret: string;
}

export interface TwitchUser {
  id: string;
  name: string;
  displayName: string;
}
