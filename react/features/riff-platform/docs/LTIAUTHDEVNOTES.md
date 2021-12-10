## LTI Login

Our app supports authentication through LTI. The LTI launch is the POST request including user and authorization data made to the server, that launches and responds with a redirect to *jitsi-meet* `/ROOM_ID` route. It makes that redirect url with LTI data as a room name and token.

We use for LTI user`s credentials check function:
```
isLtiUser()
```