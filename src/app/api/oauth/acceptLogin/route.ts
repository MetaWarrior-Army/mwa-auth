import { getOAuth2LoginRequest, acceptOAuth2LoginRequest } from '@/utils/hydra/admin';
import { OAUTH_LOGIN_SKIP,OAUTH_LOGIN_REMEMBER } from '@/utils/hydra/constants';
import { AppSessionToken } from '@/utils/app/types';
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"


// Only accept POST
export async function POST(req: NextRequest, res: NextResponse) {
  console.log('/api/oauth/acceptLogin: POST')
  // Get Secure Server Session (Next-Auth)
  const token = await getToken({ req }) as AppSessionToken
  if(!token) return NextResponse.json({error:'No session token',status:500})
  // Get the login_challenge and wallet from the request
  const { login_challenge, address } = await req.json();
  if(!login_challenge) return NextResponse.json({error:'Invalid parameters',status:500})
  // Validate login challenge
  const loginRequest = await getOAuth2LoginRequest(login_challenge)
  if(!loginRequest) return NextResponse.json({error:'Failed to get login request',status:500})
  // Accept Login
  const acceptReq = await acceptOAuth2LoginRequest(login_challenge, {
    subject: address, 
    remember: OAUTH_LOGIN_SKIP, 
    remember_for: OAUTH_LOGIN_REMEMBER,
  })
  if(!acceptReq) return NextResponse.json({error:'Failed to accept login request'},{status:500})
  // Return redirect_to
  return NextResponse.json({redirect_to:acceptReq.redirect_to, status:200})
}