---
source: https://qlik.dev/authenticate/jwt/jwt-proxy/
last_updated: 2025-10-31T14:06:52+01:00
---

# Session Cookie Proxy for Embedding Qlik Cloud

Embedding content from one web application to another can be difficult due to
increasing browser security controls, as consumers expect a seamless authorization
process, requiring mitigation of third-party cookie restrictions imposed by popular
web browsers.

If you need to support seamless authorization to
Qlik Cloud and cannot use Qlik's [OAuth capabilities](https://qlik.dev/authenticate/oauth/),
you can choose to mitigate third-party cookies in the browser for embedded analytics
use cases using a session cookie proxy.

This topic delves into the theory behind a session proxy solution.

## The use case: Seamlessly authenticated embedded analytics

- You want to embed analytics content from Qlik Cloud into your own web
  application.
- Your users should not receive prompts to authenticate to Qlik Cloud in
  order for the analytics content to render in the browser.

## The problem: Third-party cookie controls

- Web browsers such as Chrome, Edge, and Safari block third-party cookies.
- Cloud applications like Qlik Cloud use session cookies to validate users have
  and active connection to view content and web pages within the application.
- Cloud applications like Qlik Cloud offer developers the capability to embed
  analytics content into web applications.

In this scenario, Qlik Cloud is a third-party embedded into the web
application. Qlik needs the session cookie to render the content, but the web
browser blocks the content from rendering because it's a third-party to the web
application.

## The solution: Session proxy

To overcome the obstacles posed by third-party cookie restrictions, you can utilize a
proxy that intercepts requests from your web application destined for Qlik
Cloud. This ensures seamless authorization:

1. Proxy Setup: Set up a proxy within your web application's backend to handle
   requests targeted at Qlik Cloud.

2. Backend Authorization: Authenticate users to Qlik Cloud from your web
   application's backend, storing the received session cookie from Qlik Cloud.

3. Proxied Requests: When the web application's frontend requests content from
   Qlik Cloud, the request is intercepted by the backend proxy.

4. Inclusion of Session Cookie: The backend reformats the request, ensuring it
   includes the valid Qlik session cookie obtained during the authorization
   process.

5. Communication with Qlik: The modified request is then forwarded to Qlik
   Cloud, enabling the retrieval of the desired analytics content.

6. Rendering the Content: The response received from Qlik Cloud is sent back to
   the web application's frontend, where it can be seamlessly rendered in the end
   user's browser.

To visualize this solution, refer to the following diagram:

![a mermaid diagram showing the flow of communication.](https://qlik.dev/_astro/ProxyQlikEmbeddedRequestsshort.Cg8pBRtN.png)

## Next steps

Now that you understand the theory behind a session cookie proxy, move on
to [implement your own proxy](https://qlik.dev/authenticate/jwt/jwt-proxy/quickstart-qlik-jwt-proxy).
