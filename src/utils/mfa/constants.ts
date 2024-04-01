// Human-readable title for your website
export const RP_NAME = process.env.RP_NAME as string
// A unique identifier for your website
export const RP_ID = process.env.RP_ID as string
// The URL at which registrations and authentications should occur
export const RP_ORIGIN = process.env.RP_ORIGIN as string
// MFA table in database
export const MFA_DB_TABLE = process.env.MFA_DB_TABLE as string
// Max MFA creds per user
export const MAX_MFA_PER_USER = 3
