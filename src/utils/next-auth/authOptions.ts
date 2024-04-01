import { createMwaUser, getMwaUser } from '@/utils/app/db/utils'
import { MwaUser } from '@/utils/app/types'
import CredentialsProvider from "next-auth/providers/credentials"
import { SiweMessage } from 'siwe'
import { NextAuthOptions } from 'next-auth'

// Private
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string
const NEXTAUTH_URL = process.env.NEXTAUTH_URL as string

export const SIWEProvider = CredentialsProvider({
  id: 'MWA',
  name: "Ethereum",
  credentials: {
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
  },
  async authorize(credentials) {
    console.log('signIn: ')
    try {
      const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
      const nextAuthUrl = new URL(NEXTAUTH_URL)

      const result = await siwe.verify({
        signature: credentials?.signature || "",
        domain: nextAuthUrl.host,
      })
      
      // Authentication successful, check for existing user or create one if needed
      if (result.success) {
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
  },
})

const providers = [SIWEProvider]

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