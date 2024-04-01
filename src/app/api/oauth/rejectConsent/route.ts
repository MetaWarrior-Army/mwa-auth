import { getOAuth2ConsentRequest, rejectOAuth2ConsentRequest } from '@/utils/hydra/admin';
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"
import { AppSessionToken } from '@/utils/app/types';

// Only accept POST
export async function POST(req: NextRequest, res: NextResponse) {
  console.log('rejectConsent: ')
  // Get Secure Server Session (Next-Auth)
  const token = await getToken({ req }) as AppSessionToken
  if(!token) return NextResponse.json({error:'No session token',status:500})
  // Get the login_challenge and wallet from the request
  const { consent_challenge } = await req.json();
  if(!consent_challenge) return NextResponse.json({error:'Invalid parameters',status:500})
  // Validate login challenge
  const consentRequest = await getOAuth2ConsentRequest(consent_challenge)
  if(!consentRequest) return NextResponse.json({error:'Failed to get consent request',status:500})
  // Reject Consent Request
  const rejectReq = await rejectOAuth2ConsentRequest(consentRequest.challenge)
  if(!rejectReq) return NextResponse.json({error:'Failed to reject login request'},{status:500})
  // Return redirect_to
  return NextResponse.json({redirect_to:rejectReq.redirect_to, status:200})
}