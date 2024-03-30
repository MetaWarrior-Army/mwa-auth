// Our Public OAuth Client Token
export type OAuthClientToken = {
  access_token: {
    id: string,
    username?: string,
    email?: string,
    address: string,
    userObj?: string,
    using?: string,
    active?: boolean,
  },
  id_token: {
    id: string,
    username?: string,
    email?: string,
    address: string,
    userObj?: string,
    using?: string,
    active?: boolean,
  }
}