import { MwaUser } from '@/utils/app/users/types'
import { OAuthClientToken } from "./types"


// Private
const HYDRA_ADMIN_URL = process.env.HYDRA_ADMIN_URL as string
const MAIL_DOMAIN = process.env.MAIL_DOMAIN as string

export const OAUTH_LOGIN_REMEMBER = 60
export const OAUTH_LOGIN_SKIP = true
export const OAUTH_CONSENT_REMEMBER = 60
export const OAUTH_CONSENT_SKIP = true

// For generating OAuthClientToken
// This is also called on /api/acceptConsent
export async function genOAuthClientToken(
	user: MwaUser
) {
	const token: OAuthClientToken = {
		// OAUTH2 access token
		access_token: {
			id: user.address,
			username: user.username,
			email: user.username+'@'+MAIL_DOMAIN,
			address: user.address,
			userObj: JSON.stringify(user),
			using: 'access_token',
			active: true,
		},
		// Open ID user token
		id_token: {
			id: user.address,
			username: user.username,
			email: user.username+'@'+MAIL_DOMAIN,
			address: user.address,
			userObj: JSON.stringify(user),
			using: 'id_token',
			active: true,
		}
	}
	return token
}

/*********************
 * Login
 *********************/
export async function getOAuth2LoginRequest(
	loginChallenge: string
) {
	// GET Login
	const getLoginReq = await fetch(HYDRA_ADMIN_URL + '/admin/oauth2/auth/requests/login?login_challenge=' + loginChallenge)
	const getLoginRes = await getLoginReq.json()
	return getLoginRes
}


export async function acceptOAuth2LoginRequest(
	loginChallenge: string, 
	OAuth2LoginRequest: object
) {
	// ACCEPT Login
	const accptLoginReq = await fetch(HYDRA_ADMIN_URL + '/admin/oauth2/auth/requests/login/accept?login_challenge=' + loginChallenge, {
		method: 'PUT',
		headers: { 'Content-type': 'application/json', },
		body: JSON.stringify(OAuth2LoginRequest),
	})
	const accptLoginRes = await accptLoginReq.json()
	return accptLoginRes
}


/*********************
 * Consent
 *********************/

export async function getOAuth2ConsentRequest(
	consentChallenge: string
) {
	// GET Consent
	const getConsentReq = await fetch(HYDRA_ADMIN_URL + '/admin/oauth2/auth/requests/consent?consent_challenge=' + consentChallenge)
	const getConsentRes = await getConsentReq.json()
	return getConsentRes
}


export async function acceptOAuth2ConsentRequest(
	consentChallenge: string, 
	OAuth2ConsentRequest: object
) {
	// ACCEPT Consent
	const accptConsentReq = await fetch(HYDRA_ADMIN_URL + '/admin/oauth2/auth/requests/consent/accept?consent_challenge=' + consentChallenge, {
		method: 'PUT',
		headers: { 'Content-type': 'application/json', },
		body: JSON.stringify(OAuth2ConsentRequest),
	})
	const accptConsentRes = await accptConsentReq.json()
	return accptConsentRes
}

export async function rejectOAuth2ConsentRequest(
	consentChallenge: string
) {
	const rejectRequest = await fetch(HYDRA_ADMIN_URL + '/admin/oauth2/auth/requests/consent/reject?consent_challenge=' + consentChallenge , {
		method: 'PUT',
		headers: {'Content-type':'application/json'},
		body: JSON.stringify({})
	})
	const rejectResponse = await rejectRequest.json()
	return rejectResponse
}

/*********************
 * Logout
 *********************/

export async function getOAuth2LogoutRequest(
	logoutChallenge: string
) {
    // GET Logout
    const getLogoutReq = await fetch(HYDRA_ADMIN_URL+'/admin/oauth2/auth/requests/logout?logout_challenge='+logoutChallenge)
    const getLogoutRes = await getLogoutReq.json()
    return getLogoutRes
}

export async function acceptOAuth2LogoutRequest(
	logoutChallenge: string
) {
    // ACCEPT Logout
    const accptLogoutReq = await fetch(HYDRA_ADMIN_URL+'/admin/oauth2/auth/requests/logout/accept?logout_challenge='+logoutChallenge,{
        method: 'PUT',
        headers: {'Content-type':'application/json',},
        body: JSON.stringify({logout_challenge: logoutChallenge})
    })
    const accptLogoutRes = await accptLogoutReq.json()
    return accptLogoutRes
}

/*********************
 * Revoke All Sessions
 *********************/

export async function revokeOAuth2Sessions(
	sub: string
) {
    // REVOKE ALL SESSIONS
    const revokeSessReq = await fetch(HYDRA_ADMIN_URL+'/admin/oauth2/auth/sessions/login', {
        method: 'DELETE',
        headers: {'Content-type':'application/json',},
        body: JSON.stringify({ subject: sub}),
    })
    const revokeSessRes = await revokeSessReq.json()
    return revokeSessRes
}