# MWA-Auth

Account creation, authentication, and Multi-Factor Authentication for MetaWarrior Army. 

Accounts are authenticated by signing a message with their web3 wallets and MFA is provided via WebAuthn supported Passkeys and Security Keys.

Accounts are created by minting and [NFT](https://github.com/metawarrior-army/mwa-nft) on an EVM compatible blockchain. NFT images are Blockies generated off the account wallet address. NFT image and metadata is stored in Pinata IPFS cloud.

Account authentication is backed by an OAuth2 server providing account access to a variety of products and services offered by MetaWarrior Army.

## Dependencies

- NodeJS
- NextJS
- Next-Auth
- Wagmi/Viem
- Sign In With Ethereum
- Pinata IPFS Cloud account
- Ory Hydra OAuth Server
- PostgreSQL Database of Users

### Honorable Mentions

- `react-blockies` and `@download/blockies` for user profile images
- `js-cookie` for the help client side

## Notes:

This app acts as the custom UI for an OAuth2/OpenID Identity Provider. As such, not all OAuth implementations are created equal. Ory Hydra has it's quirks, but if you follow best practices and the `.well-known/openid-configuration` you'll be fine. 

There's a special API endpoint called `imapGrant` created for older clients of the OpenID `/userinfo` endpoint where the `access_token` is sent as parameters in a GET request instead of POSTing the token in the HTTP Authorization headers. Our custom endpoint serves as a relay for an Dovecot IMAP server that needs a little help. The only purpose of the `PGSQL_MAIL_` variables are for this endpoint.

We use Wagmi/Viem for interacting with user's wallets. We attempt to provide the best experience allowing users to connect with as many wallets as possible, but might not support all wallets due to limited testing capabilities or the wallet provider's limited support for Wagmi/Viem.

## Screenshots

![connect wallet](https://github.com/MetaWarrior-Army/mwa-auth/blob/main/docs/images/mwa-auth-scrot1.png?raw=true)
![login](https://github.com/MetaWarrior-Army/mwa-auth/blob/main/docs/images/mwa-auth-scrot2.png?raw=true)
![consent](https://github.com/MetaWarrior-Army/mwa-auth/blob/main/docs/images/mwa-auth-scrot3.png?raw=true)