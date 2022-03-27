## node-restful-api
a pure node restful api project.

## Feature
An "uptime monitor" allows users to enter URLs they want to be monitored, and receive
alerts when those resources "go down" or "come back up".

## API Spec
- The API listens on a PORT and accepts incoming HTTP requests for POST, GET, PUT, DELETE, and HEAD.
- The API allows a client to connect, then create a new user, then edit and delete that user.
- The API allows a user to "sign in" which gives them a token that they can use for subsequest authenticated requests.
- The API allows the user to "sign out" which invalidates their token.
- The API allows a signed-in user to use their token to create a new "check".
- The API allows a signed-in user to edit or delete any of their checks.
- In the background, workers perform all the "checks" at the appropriate times, and send alerts to users when a check changes its state from "up" to "down", and vise versa.

## Generate https .pem files with openssl
```bash
1、install openssl with brew

2、openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```

## 3rd party service
Integrate Twilio services to this node project.  
```js
website: https://www.twilio.com/
```

## Debug mode
Start the server in node debug http mode
```bash
NODE_DEBUG=http node src/index.js
```

## License
This repo is licensed under the terms of MIT.
