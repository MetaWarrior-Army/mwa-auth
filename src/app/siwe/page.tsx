'use client'

import { QuestionsBanner, Modal } from '@/components/app/page'
import { ProfileBanner } from '@/components/web3/web3'
import { SIWEVerifyModal } from '@/components/siwe/verify'
import Web3Providers  from '@/app/web3providers'
import {useState,useEffect} from 'react'
import Cookies from 'js-cookie'

// Login
export default function SIWEPage() {
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
        <SIWEVerifyModal redirect={cookies.auth_redirect} client={cookies.auth_client} login_challenge={cookies.login_challenge}/>
        :  <></>
      }
      
      
      <QuestionsBanner/>
    </Modal>
    </Web3Providers>
  )
}