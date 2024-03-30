import NextAuth from "next-auth";
import { authOptions } from '@/utils/next-auth/authOptions'

// Very simple API handler... use Next-Auth
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}