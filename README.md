## node-restful-api
a pure node restful api project

## API Spec
- The API listens on a PORT and accepts incoming HTTP reqeusts for POST, GET, PUT, DELETE, and HEAD.
- The API allows a client to connect, then create a new user, then edit and delete that user.
- The API allows a user to "sign in" which gives them a token that they can use for subsequest authenticated requests.
- The API allows the user to "sign out" which invalidates their token.
- The API allows a signed-in user to use their token to create a new "check".
- The API allows a signed-in user to edit or delete any of their checks.
- In the background, workers perform all the "checks" at the appropriate times, and send alerts to users when a check changes its state from "up" to "down", or vise versa.

## License
This repo is licensed under the terms of MIT.
