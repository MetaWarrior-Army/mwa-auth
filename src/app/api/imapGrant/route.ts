// Custom access_token endpoint for Dovecot IMAP's implementation of OAuth
// Dovecot passes the access_token in the parameters of a GET request
// which is no longer best practice and supported by Ory Hydra OAuth server
// https://doc.dovecot.org/configuration_manual/authentication/oauth2/
// Additionally, dovecot takes it's quota rules from the userinfo
// so we have to populate that as well.
// This endpoint can only be secured by the access_token.
// None of this is ideal
import { getMailQuota } from "@/utils/mail/db/utils"
import { NextRequest, NextResponse } from "next/server"
import {APP_DOMAIN} from '@/utils/app/constants'


// Only support GET, dovecot should never POST
export async function GET(req: NextRequest, res: NextResponse) {
    console.log('imapGrant: ')
    // Get access_token from request
    const access_token = req.nextUrl.searchParams.get('access_token')
    if(!access_token) return NextResponse.json({error:'Invalid parameters',status:500})

    // Get user profile from OAuth server
    const userTokenReq = await fetch('https://'+APP_DOMAIN+'/userinfo',{
        method: 'POST',
        headers: {
            'Content-type':'application/json',
            'Authorization':'Bearer '+access_token
        },
        body: JSON.stringify({token: access_token})
    })
    const userTokenRes = await userTokenReq.json()
    if(!userTokenRes || userTokenRes.error) return NextResponse.json({error:'Failed to get user information',status:500})
    // Get Mailbox Quota
    const quotaRule = await getMailQuota(userTokenRes.email)
    if(!quotaRule) return NextResponse.json({error:'Failed to get quota rule',status:500})
    // Build return object
    const returnObj = {
        auth_time: userTokenRes.auth_time,
        email: userTokenRes.email,
        iat: userTokenRes.iat,
        iss: userTokenRes.iss,
        rat: userTokenRes.rat,
        sub: userTokenRes.sub,
        username: userTokenRes.username,
        using: userTokenRes.using,
        quota_rule: quotaRule,
        active: true
    };
    // Return response
    return NextResponse.json(returnObj)
}