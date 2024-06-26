import {NextRequest,NextResponse} from 'next/server'
import {sha512} from '@/utils/app/sha512'
import {getOAuth2ConsentRequest,
  acceptOAuth2ConsentRequest,
  genOAuthClientToken,
  rejectOAuth2ConsentRequest
} from '@/utils/hydra/admin'
import {APP_BASE_URL} from '@/utils/app/constants'
import {PROTECTED_OAUTH_CLIENTS,
  OAUTH_CONSENT_SKIP,
  OAUTH_CONSENT_REMEMBER} from '@/utils/hydra/constants'
import { PRIVATE_API_KEY } from '@/utils/app/constants'

export async function consentMiddleware(req: NextRequest) {
  console.log('middleware: /consent')
  const SECRET_HASH = await sha512(PRIVATE_API_KEY)

  // We should receive a consent_challenge
  const consent_challenge = req.nextUrl.searchParams.get('consent_challenge')
  if(!consent_challenge) return NextResponse.json({error:'invalid parameters',status:500})

  // Validate consent challenge or Error
  const consentRequest = await getOAuth2ConsentRequest(consent_challenge)
  if(!consentRequest) return NextResponse.json({error:'Failed to get consent request',status:500})
  if(consentRequest.redirect_to) return NextResponse.redirect(consentRequest.redirect_to)
  
  // Get MwaUser from /api
  const getUserReq = await fetch(APP_BASE_URL+'/api/user/getMwaUser',{
    method: 'POST',
    headers: {'Content-type':'application/json'},
    body: JSON.stringify({secret: SECRET_HASH, address: consentRequest.subject})
  })
  const mwaUser = await getUserReq.json()
  if(!mwaUser) return NextResponse.json({error:'Failed to interact with /api/getMwaUser',status:500})

  // Redirect inactive users to mint
  if(!mwaUser.email_active) return NextResponse.redirect(APP_BASE_URL+'/mint')
    
  // Build the response
  const resp = NextResponse.next()
  resp.cookies.delete('oauth_consent_redirect')
  resp.cookies.set('oauth_client_name',consentRequest.client.client_name)
  resp.cookies.set('oauth_logo_uri',consentRequest.client.logo_uri)
  resp.cookies.set('consent_challenge',consentRequest.challenge)
  
  // Are we being asked to skip?
  
  if(consentRequest.skip || consentRequest.client.skip_consent){
    console.log('skipping consent')
    // generate tokenData
    const tokenData = genOAuthClientToken(mwaUser)
    // Accept consent
    const acceptReq = await acceptOAuth2ConsentRequest(consentRequest.challenge,{
      grant_scope: consentRequest.requested_scope,
      remember: OAUTH_CONSENT_SKIP, 
      remember_for: OAUTH_CONSENT_REMEMBER,
      session: tokenData
    })
    if(!acceptReq) return NextResponse.json({error:'Failed to accept consent request',status:500})
    // Set cookie for the client-side redirect
    resp.cookies.set('oauth_consent_redirect',acceptReq.redirect_to)
  }
  
  
  // Return response
  return resp
}