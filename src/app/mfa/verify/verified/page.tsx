'use client'

import { QuestionsBanner, Modal, SignOutModal } from '@/components/app/page'
import { ProfileBanner } from '@/components/web3/web3'
import Web3Providers  from '@/app/web3providers'
// Public
const APP_DOMAIN = 'auth.metawarrior.army'

// Login
export default function VerifiedMfaPage() {
  const signOutRedirect = 'https://'+APP_DOMAIN+'/mfa/verify/verified'
  
  return (
    <Web3Providers>
      <Modal>
        <ProfileBanner />

          <div>
            <p>Passkey Verified.</p>
          
          </div>


        <SignOutModal redirect={signOutRedirect} />
        <QuestionsBanner/>
      </Modal>
    </Web3Providers>
  )
}