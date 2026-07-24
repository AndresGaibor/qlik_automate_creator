---
source: https://qlik.dev/authenticate/oauth/oauth-private-key-jwt-reference/
last_updated: 2026-04-09T12:49:26Z
---

# Private Key JWT reference

## Overview

This reference guide covers the technical details of Private Key JWT authentication for OAuth
clients in Qlik Cloud. For a step-by-step tutorial, see [Authenticate with Private Key
JWT](https://qlik.dev/authenticate/oauth/oauth-private-key-jwt).

Private Key JWT allows OAuth applications to authenticate using asymmetric cryptography
(public/private key pairs) instead of shared secrets.

## Supported algorithms

Qlik Cloud accepts public keys using the following signing algorithms:

| Algorithm | Key Type | Min Key Size | Description                        |
| --------- | -------- | ------------ | ---------------------------------- |
| `RS256`   | RSA      | 2048 bits    | RSASSA-PKCS1-v1\_5 with SHA-256    |
| `RS512`   | RSA      | 2048 bits    | RSASSA-PKCS1-v1\_5 with SHA-512    |
| `ES384`   | EC       | N/A          | ECDSA with P-384 curve and SHA-384 |

> **Warning:** RSA keys must be at least 2048 bits. For long-term production keys, 4096 bits is recommended.

## JWT assertion structure

When your application requests a token, it creates a JWT assertion with the following structure.

### Required JWT claims

| Claim              | Value                                        | Notes                                                  |
| ------------------ | -------------------------------------------- | ------------------------------------------------------ |
| `iss` (issuer)     | Your OAuth client ID                         | Must match the client ID registered in Qlik Cloud      |
| `sub` (subject)    | Your OAuth client ID                         | Must match the `iss` claim                             |
| `aud` (audience)   | `https://<TENANT>.qlikcloud.com/oauth/token` | The token endpoint URL. No trailing slash.             |
| `jti` (JWT ID)     | Universally unique identifier (UUID)         | Generate a new UUID for each token request             |
| `iat` (issued at)  | Unix timestamp                               | When the assertion was issued (seconds since epoch)    |
| `exp` (expiration) | Unix timestamp                               | When the assertion expires (max 5 minutes after `iat`) |

### JWT headers

| Header | Value                        | Required | Notes                                |
| ------ | ---------------------------- | -------- | ------------------------------------ |
| `alg`  | `RS256`, `RS512`, or `ES384` | Yes      | Must match your private key type     |
| `kid`  | Key ID                       | Yes      | Identifier for tracking key versions |

### Example JWT payload

```json
{
  "iss": "my-oauth-client-id",
  "sub": "my-oauth-client-id",
  "aud": "https://my-tenant.qlikcloud.com/oauth/token",
  "jti": "550e8400-e29b-41d4-a716-446655440000",
  "iat": 1712525123,
  "exp": 1712525423
}
```

## JSON Web Key (JWK) format

Register your public key in JWK format with your OAuth client.
The JWK must include the signing algorithm and usage metadata.

### JWK field reference

| Field | RSA          | EC    | Required  | Description                                            |
| ----- | ------------ | ----- | --------- | ------------------------------------------------------ |
| `kid` | N/A          | N/A   | Yes       | Identifier for the key, used for tracking and rotation |
| `kty` | RSA          | EC    | Yes       | Key type: `"RSA"` or `"EC"`                            |
| `alg` | RS256, RS512 | ES384 | Yes       | Signing algorithm that must match the private key      |
| `e`   | ✓            | —     | Yes (RSA) | RSA exponent (typically `"AQAB"`)                      |
| `use` | sig          | sig   | Yes       | Key usage: must be `"sig"` (signing)                   |
| `n`   | ✓            | —     | Yes (RSA) | RSA modulus (base64url-encoded)                        |
| `crv` | —            | ✓     | Yes (EC)  | Elliptic curve: For ES384, use `"P-384"`               |
| `x`   | —            | ✓     | Yes (EC)  | EC X coordinate (base64url-encoded)                    |
| `y`   | —            | ✓     | Yes (EC)  | EC Y coordinate (base64url-encoded)                    |

### RSA example (RS256)

```json
{
  "kid": "my-key-1",
  "kty": "RSA",
  "alg": "RS256",
  "e": "AQAB",
  "use": "sig",
  "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw"
}
```

### EC example (ES384)

```json
{
  "kid": "my-ec-key-1",
  "kty": "EC",
  "alg": "ES384",
  "crv": "P-384",
  "use": "sig",
  "x": "gI0GAILBdu7-ViNS8tBj...",
  "y": "SLrelm8_SWcV8uAPAVLV..."
}
```

## Related resources

- [Authenticate with Private Key JWT](https://qlik.dev/authenticate/oauth/oauth-private-key-jwt): Step-by-step tutorial
- [Create a M2M OAuth2 client](https://qlik.dev/authenticate/oauth/create/create-oauth-client/): Set up a new OAuth client
- [OAuth tokens API](https://qlik.dev/apis/rest/oauth-tokens/): Reference for token endpoint parameters and responses
- [OAuth scopes](https://qlik.dev/authenticate/oauth/scopes): Available scopes and permissions
