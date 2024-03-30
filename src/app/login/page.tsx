'use client'

import { QuestionsBanner, Modal } from '@/components/page'
import { ProfileBanner } from '@/components/web3'
import { LoginModal } from '@/components/login'
import Web3Providers  from '../web3providers'


// Login
export default function LoginPage() {
  
  return (
    <Web3Providers>
    <Modal>
      <ProfileBanner />

      <LoginModal/>
      
      <QuestionsBanner/>
    </Modal>
    </Web3Providers>
  )
}