import { WidgetEvent } from "./types";

const websocket = new WebSocket("ws://localhost:9090");

websocket.onmessage = (event) => handleEvent(JSON.parse(event.data));

/***/

const LIST_MAX = 5;

const eventsListElement = document.getElementById("events-list");
const eventsList: HTMLLIElement[] = [];

let even = false;

function handleEvent(event: WidgetEvent) {
  const li = document.createElement("li");
  const pre = document.createElement("pre");
  pre.innerText = JSON.stringify(event, null, 2);
  li.appendChild(pre);
  if (even) {
    li.className = "even";
  }
  even = !even;
  eventsList.push(li);
  eventsListElement.prepend(li);
  if (eventsList.length > LIST_MAX) {
    eventsList.shift().remove();
  }
}
