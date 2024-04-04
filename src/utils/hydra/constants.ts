// Private Constants
export const HYDRA_ADMIN_URL = process.env.HYDRA_ADMIN_URL as string
export const OAUTH_LOGIN_REMEMBER = 60
export const OAUTH_LOGIN_SKIP = true
export const OAUTH_CONSENT_REMEMBER = 60
export const OAUTH_CONSENT_SKIP = true


// Protected OAuth clients have consent rejected unless user's `email_active` field is set to true
export const PROTECTED_OAUTH_CLIENTS = [
  'c0261bb0-49ea-41c1-b4fb-8bfefaafddf5', // Roundcube
  '57a8acfe-6374-4b2e-98a7-82156506bd81', // Discourse
  '6b4eb82f-667a-4a5e-8167-bb7d1cf061ed', // Mastodon
  '72835e0a-58fc-4e6d-b2cf-4ec6d5bc598a', // Matrix
]

export const TRUSTED_OAUTH_CLIENTS = [
  '984ba2a8-2a94-487b-90fb-dc74810c0f79', // WWW
  // metawarrior.army/member
]