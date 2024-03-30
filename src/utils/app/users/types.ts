export type MwaUser = {
  address: string,
  username?: string,
  email?: string,
  nft_0_avatar_cid?: string,
  nft_0_cid?: string,
  nft_0_id?: string,
  nft_0_tx?: string,
  email_active?: boolean,
  invite_code?: string,
  num_referrals?: number
}

export type AppSessionToken = {
  id: string,
  user: MwaUser
}