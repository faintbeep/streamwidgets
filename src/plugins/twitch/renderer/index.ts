import AppElement, { AppTagName } from "./App";

const root = document.getElementById("root");
const app = document.createElement(AppTagName) as AppElement;
root.appendChild(app);

app.onsavesettings = window.twitch.setAppSettings;
app.onrequestsettings = window.twitch.getAppSettings;
