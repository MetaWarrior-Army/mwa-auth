'use client'

import { QuestionsBanner, Modal } from '@/components/app/page'
import { ProfileBanner } from '@/components/web3/web3'
import Web3Providers  from '@/app/web3providers'
import {useState,useEffect} from 'react'
import Cookies from 'js-cookie'
import { VerifyMfaModal } from '@/components/mfa/login'

// Login
export default function VerifyMfaPage() {
  const [redirect,setRedirect] = useState('')
  const cookies = Cookies.get()

  useEffect(() => {
    if(redirect == ''){
      if(cookies.auth_redirect){
        setRedirect(cookies.auth_redirect)
        console.log('Set redirect to: '+cookies.auth_redirect)
      }
    }
  },[redirect,cookies])
  
  return (
    <Web3Providers>
    <Modal>
      <ProfileBanner />
      <p>Verify your Passkey or Security Key.</p>

      {cookies ? 
        <VerifyMfaModal client={cookies.auth_client} redirect={redirect} login_challenge={cookies.login_challenge}/>
        : <></>
      }
          
      <QuestionsBanner/>
    </Modal>
    </Web3Providers>
  )
}