
import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from 'next-auth'
import { verifyCredentials } from './verify'
import { NEXTAUTH_SECRET } from '@/utils/app/constants'



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

  async authorize(credentials) {
    if(credentials){
      const verified = await verifyCredentials({
        address: credentials.address,
        signature: credentials.signature,
        message: credentials.message,
        type: credentials.type,
      })
      return verified
    }
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