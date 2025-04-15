# JWT Pizza Security Testing - Attack Records
### for Minami Ford and David Bauch

## Self-Attack Records

## Tester Information
- **Tester Name:** Minami Ford
- **Test Environment:** https://pizza.minbyu.click
- **Test Date:** April 14, 2025
---

## Attack Record 1:

- **Date:** April 14, 2025  
- **Target Endpoint:** `GET /api/franchise/1`  pizza.minbyu.click
- **Classification:** Broken Access Control  
- **Severity:** 3 – High  

#### Description
A user with valid JWT for franchise ID `1` was able to access **any franchise ID** by modifying the URL to `/api/franchise/2`, `/api/franchise/349`, etc.

GET /api/franchise/2 HTTP/2
Authorization: Bearer <valid JWT> 


#### Correction
Add middleware to validate user’s userRole.objectId against the requested :id.


## Attack Record 2:

- **Date:** April 14, 2025  
- **Target Endpoint:** `GET /api/order/menu`  pizza.minbyu.click
- **Classification:** Broken Auth 
- **Severity:** 4 – Critical  

#### Description
A tampered JWT with a fake payload was still accepted by the server. Any user can modify roles or ID and gain access to admin functionality.

PAYLOAD:
{
  "id": 1,
  "name": "hacker",
  "email": "h@jwt.com",
  "roles": [{"role": "admin"}],
  "iat": 1744687363
}

#### Correction
Enforce token signature validation using a strong, secret key and
cross-check decoded token id against DB and token table for valid session.


## Attack Record 3: 

- **Date:** April 14, 2025  
- **Target Endpoint:** `POST /api/order`  pizza.minbyu.click
- **Classification:** Broken Access Control  
- **Severity:** 3 – High  

#### Description
Able to submit orders for any storeId, menuId, and franchiseId — even those of other users by modifying the JSON body

http
POST /api/order HTTP/2
Authorization: Bearer <valid JWT>

#### Correction
1. Validate that the storeId and franchiseId match user's role and access.
2. Reject orders referencing unauthorized resources.


## Tester Information
- **Tester Name:** David Bauch
- **Test Environment:** pizza.borea.io 
- **Test Date:** April 11, 2025  
---

### Attack 1: 

- **Date Executed:** April 11, 2025  
- **Target:** pizza.borea.io 
- **Classification:** Broken Authentication
- **Severity:** 2 – High  

#### Description
Authentication tokens are stored in `localStorage`, making them vulnerable to XSS attacks. Tokens are accessible via JavaScript and persist after the session ends.

#### Correction
1. Move token storage to HttpOnly cookies
2. Implement proper session management
3. Add token expiration checks

---

### Attack 2: 

- **Date Executed:** April 12, 2025  
- **Target:** pizza.borea.io 
- **Classification:** Security Misconfiguration  
- **Severity:** 3 – Medium  

#### Description 
API endpoints leak internal implementation details through error messages. For example, attempting to create a franchise returns `"franchise.admins is not iterable"`, revealing internal object structure and validation logic.

#### Correction
1. Implement proper error handling middleware
2. Return generic error messages to clients
3. Log detailed errors server-side only
4. Sanitize all error responses

---


## Peer-Attack Records

### Attack on David: Mass Request Injection

- **Date Executed:** April 14, 2025  
- **Target Endpoint:** `POST /api/order`  pizza.borea.io 
- **Classification:** Broken Access Control  
- **Severity:** 4 – Critical  

#### Description
The attacker can exploit a weak implementation of the POST /api/order endpoint by injecting multiple requests with slight modifications, and flood requests. The attacker can send thousands of requests by exploiting this vulnerability.

http
POST /api/order HTTP/2

{"items":[{"menuId":3,"description":"Margarita","price":0.0042}],"storeId":"1","franchiseId":1}

#### Correction
1. Implement rate limiting to prevent high-frequency requests from a single source.
2. Ensure proper validation and access control to prevent unauthorized modifications to storeId, franchiseId, or other sensitive fields.


### Attack on Minami: Privilege Escalation via User Update Endpoint

- **Date Executed:** April 14, 2025  
- **Target Endpoint:** `POST /api/auth/:userId`  pizza.minbyu.click
- **Classification:** Broken Access Control 
- **Severity:** 2 – High  

#### Description
The `/api/auth/:userId` endpoint allows a user to attempt to update another user's account by specifying their `userId` in the URL. A regular user can attempt to update another user's email or password. If access controls are not properly enforced, this could allow privilege escalation or account takeover.

1. Make a `POST` request to `/api/auth/:userId` as a regular user.
2. Attempt to update another user's details by modifying the `userId`.

#### Correction
1. Ensure strict server-side access control checks so only the account owner or an admin can update a user's info.
2. Add tests for privilege escalation attempts.
3. Return clear but generic error messages for unauthorized attempts.

---

## Lessons Learned

1. Use the authorization token for all user validation
2. Use cookies that are controlled by HTTP, which the server can control. Not localstorage.
3. Be careful about which request parameters can be used to modify server-side objects
4. There should be limits set in place to prevent high frequency attacks from a single source/user