## LTI Login

Our app supports authentication through LTI. The LTI launch is the POST request including user and authorization data made to the server, that launches and responds with a redirect to *jitsi-meet* `/ROOM_ID` route. It makes that redirect url with LTI data as a meeting info, user id, user name, email and token. That data is used to store user info and token as for the logged user.