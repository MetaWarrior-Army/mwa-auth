'use client'

import { QuestionsBanner, Modal, SignOutModal } from '@/components/page'
import { ProfileBanner } from '@/components/web3'
import Web3Providers  from '../web3providers'

// Public
const APP_DOMAIN = 'auth.metawarrior.army'

// Login
export default function MfaPage() {
  const signOutRedirect = 'https://'+APP_DOMAIN+'/mfa'
  
  return (
    <Web3Providers>
    <Modal>
      <ProfileBanner />

      <h1>MFA</h1>
      
      <QuestionsBanner/>

      <SignOutModal redirect={signOutRedirect} />
      
    </Modal>
    </Web3Providers>
  )
}