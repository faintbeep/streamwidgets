# streamwidgets

`yarn start`

Starts an electron app which receives Twitch EventSub webhooks via an ngrok connection, and repeats them over a local websocket server.

You can then write your own stream alerts in HTML/CSS/JS by connecting to the websocket, and using a browser source in OBS:

```html
<html>
  <head>
    <title>My latest follower widget</title>
    <script>
        function handleEvent(streamEvent) {
          // Trigger an alert however you want, CSS animations, videos, a full blown React app, whatever. Eg:
          switch(event.type) {
            case 'TwitchFollow':
              document.body.textContent = `Latest follower: ${event.payload.user.displayName}`;
          }
        }

        const websocket = new WebSocket("ws://localhost:9090");
        websocket.onmessage = (event) => handleEvent(JSON.parse(event.data));
    </script>
  </head>
  <body></body>
</html>
```

Code is documentation atm, see typescript definitions.
