import { getOAuth2ConsentRequest, acceptOAuth2ConsentRequest, genOAuthClientToken } from '@/utils/hydra/hydraAdmin';
import { OAUTH_CONSENT_SKIP,OAUTH_CONSENT_REMEMBER } from '@/utils/hydra/hydraAdmin';

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { getMwaUser } from '@/utils/app/users/db/utils';
import { MwaUser } from '@/utils/app/users/types';

// Only accept POST
export async function POST(req: NextRequest, res: NextResponse) {
  
  // Get Secure Server Session (Next-Auth)
  const token = await getToken({ req })
  if(!token) return NextResponse.json({error:'No session token',status:500})
  
  // Get the login_challenge and wallet from the request
  const { consent_challenge } = await req.json();
  if(!consent_challenge) return NextResponse.json({error:'Invalid parameters',status:500})

  // Validate login challenge
  const consentRequest = await getOAuth2ConsentRequest(consent_challenge)
  if(!consentRequest) return NextResponse.json({error:'Failed to get consent request',status:500})

  // Get user
  const user = await getMwaUser(consentRequest.subject) as MwaUser

  // Generate token
  const tokenData = await genOAuthClientToken(user)

  // Accept Login
  const acceptReq = await acceptOAuth2ConsentRequest(consentRequest.challenge, {
    grant_scope: consentRequest.requested_scope,
    remember: OAUTH_CONSENT_SKIP, 
    remember_for: OAUTH_CONSENT_REMEMBER,
    session: tokenData
  })
  if(!acceptReq) return NextResponse.json({error:'Failed to accept login request'},{status:500})

  // Return redirect_to
  return NextResponse.json({redirect_to:acceptReq.redirect_to, status:200})
}