---
title: "Login REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/login/"
local_path: "docs/endpoints/login.md"
---

Title: Login REST | Qlik Developer Portal


Initiates login using the active interactive identity provider associated with the tenant. Uses default Qlik identity provider if no customer-configured interactive identity provider is active.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Qlik-Web-Integration-ID string 
Web Integration ID associated with origin whitelist used to validate returnto value.

### Query Parameters

*   login_hint string 
Hint to the Authorization Server about the login identifier the End-User might use to log in.

*   max_age number 
Specifies the allowable elapsed time in seconds since the last time the End-User was actively authenticated by the OpenID Provider. If time is greater than max_age, force user to re-authorize.

*   prompt string 
Specifies whether the Authorization Server prompts the End-User for re-authentication and consent.

Can be one of: "none""login"

*   returnto string 
Relative or full URL on the tenant to redirect to after successful login.

*   scope array 
Specifies the scope of access for login. Only supports offline_access to request a refresh token from the identity provider.

Can be one of: "offline_access"

### Responses

GET /login

`// qlik-api has not implemented support for `GET /login` yet.// In the meantime, you can use fetch like this:const response = await fetch('/login', {  method: 'GET',  headers: { 'Content-Type': 'application/json' },})`

Exchanges a token in the form of a user JWT for a session cookie. The JWT should be securely signed with an algorithm other than HS, and it should contain the following claims:

1.   . iss: identifies the principal that issued the JWT; it must match the issuer in the IDP definition.
2.   . aud: identifies the recipients of the JWT, which in this case is "qlik.api/login/jwt-session".
3.   . sub: identifies the subject of the JWT.
4.   . subType: the type of identifier the sub represents, which in this case is "user".
5.   . name: the name of the user.
6.   . email: the email address of the user.
7.   . email_verified: a claim indicating to Qlik that the JWT source has verified that the email address belongs to the subject.
8.   . jti: JWT ID; it should be unique for each consumed JWT token.
9.   . iat: identifies the time at which the JWT was issued.
10.   . nbf: identifies the starting time on which the JWT is accepted. The current unix time must be passed this value.
11.   . exp: identifies the expiration time after which the JWT is not accepted.
12.   . keyid: identifies the KeyID used to sign the JWT; it must match the KeyID in the IDP definition.

And the time window between exp and nbf should not exceed 1 hour.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Responses

POST /login/jwt-session

`// qlik-api has not implemented support for `POST /login/jwt-session` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/login/jwt-session',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },  },)`

### Example Response

`{}`