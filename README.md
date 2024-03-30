# MWA-Auth
A Custom UI for authenticating with an OAuth2/OpenID server providing a Web3 authentication mechanism for the rest of Web2.

## Dependencies

- NodeJS
- NextJS
- Next-Auth
- Wagmi/Viem
- Sign In With Ethereum
- Ory Hydra OAuth Server
- PostgreSQL Database of Users

### Honorable Mentions

- `react-blockies` for user profile images
- `js-cookie` for the help client side

## Notes:
This serves as the custom UI for an OAuth2/OpenID Identity Provider. As such, not all OAuth implementations are created equal. Ory Hydra has it's quirks, but if you follow best practices and the `.well-known/openid-configuration` you'll be fine. 

There's a special API endpoint called `imapGrant` created for older clients of the OpenID `/userinfo` endpoint where the `access_token` is sent as parameters in a GET request instead of POSTing the token in the HTTP Authorization headers. Our custom endpoint serves as a relay for an Dovecot IMAP server that needs a little help. The only purpose of the `PGSQL_MAIL_` variables are for this endpoint.

We use Wagmi/Viem for interacting with user's wallets. We attempt to provide the best experience allowing users to connect with as many wallets as possible, but might not support all wallets due to limited testing capabilities or the wallet provider's limited support for Wagmi/Viem. 

