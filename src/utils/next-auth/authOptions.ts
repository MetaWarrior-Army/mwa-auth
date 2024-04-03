import { createMwaUser, getMwaUser } from '@/utils/app/db/utils'
import { MwaUser } from '@/utils/app/types'
import { APP_DOMAIN, NEXTAUTH_SECRET } from '@/utils/app/constants'
import { verifyCredentialAuthenticationResponse } from '../mfa/verify'
import { getMfaCredentials, validateMfaSession } from '../mfa/db/utils'
import { MfaCredential } from '../mfa/types'
import CredentialsProvider from "next-auth/providers/credentials"
import { SiweMessage } from 'siwe'
import { NextAuthOptions } from 'next-auth'


export const MWAProvider = CredentialsProvider({
  id: 'MWA',
  name: "Ethereum",
  credentials: {
    address: {
      label: "Address",
      type: "text",
      placeholder: "0x0",
    },
    message: {
      label: "Message",
      type: "text",
      placeholder: "0x0",
    },
    signature: {
      label: "Signature",
      type: "text",
      placeholder: "0x0",
    },
    type: {
      label: "Type",
      type: "text",
      placeholder: 'siwe',
    },
  },

  // Establish Server Side Session
  // Supports SIWE and WebAuthn
  async authorize(credentials) {
    console.log('/utils/next-auth/authOptions: ')

    // SIWE login
    // This is the first signature we ever receive from the user.
    // If the user doesn't exist, we create them here.
    if(credentials && credentials.type == 'siwe'){
      console.log('/utils/next-auth/authOptions: siwe: ')
      try {
        // Get SIWE Message
        const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
        // Verify Message
        const result = await siwe.verify({
          signature: credentials?.signature || "",
          domain: APP_DOMAIN,
        })
        // Authentication successful, check for existing user or create one if needed
        if (result.success) {
          // Get User
          let user: MwaUser
          const userCheck = await getMwaUser(siwe.address)
          // Create new user
          if(!userCheck) {
            const newUser = await createMwaUser(siwe.address)
            if(!newUser) return null
            user = newUser
          }
          else{
            user = userCheck
            // Make sure user doesn't have any MFA keys, if so, they should be forced
            // to authenticate via 'mfa'
            const mfaCreds: MfaCredential[] = await getMfaCredentials(siwe.address)
            if(mfaCreds.length > 0) return null
          }
          // return SessionToken
          return {
            id: user.address,
            user: user,
          }
        }
        console.log(result)
        return null
      } catch (e) {
        console.log(e)
        return null
      }
    }

    // MFA login (Simple WebAuthn)
    // User has already authenticated with SIWE and received a MFA Session
    else if(credentials && credentials.type == 'mfa'){
      console.log('/utils/next-auth/authOptions: mfa: ')
      // Validate signature (MFA Session)
      const validSession = await validateMfaSession(credentials.address,credentials.signature)
      if(!validSession) return null
      // Valid Session
      if(validSession){
        // Get message
        const body = JSON.parse(credentials.message)
        // Get User
        const user = await getMwaUser(credentials.address)
        if(!user) return null
        // Verify User
        const verified = await verifyCredentialAuthenticationResponse(user,body)
        if(!verified) return null
        // Return user
        return {
          id: user.address,
          user: user,
        }
      }
    }

    // signIn() failed
    console.log('/utils/next-auth/authOptions: Invalid credentials')
    return null
  },
})

const providers = [MWAProvider]

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.user = user;
        token.user.address = user.id
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user = token.user
      return session
    },
  },
} as NextAuthOptions