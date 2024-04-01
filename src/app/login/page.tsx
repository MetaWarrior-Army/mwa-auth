'use client'

import { QuestionsBanner, Modal } from '@/components/app/page'
import { ProfileBanner } from '@/components/web3/web3'
import { LoginModal } from '@/components/app/login'
import Web3Providers  from '@/app/web3providers'

// Login
export default function LoginPage() {
  
  return (
    <Web3Providers>
    <Modal>
      <ProfileBanner />

      <LoginModal client='oauth' redirect='' authType='siwe'/>
      
      <QuestionsBanner/>
    </Modal>
    </Web3Providers>
  )
}