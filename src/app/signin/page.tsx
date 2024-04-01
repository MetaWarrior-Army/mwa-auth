'use client'

import { QuestionsBanner, Modal } from '@/components/app/page'
import { ProfileBanner } from '@/components/web3/web3'
import { LoginModal } from '@/components/app/login'
import Web3Providers  from '@/app/web3providers'
import {useState,useEffect} from 'react'
import Cookies from 'js-cookie'

// Login
export default function SigninPage() {
  const [redirect,setRedirect] = useState('')
  const cookies = Cookies.get()

  useEffect(() => {
    if(redirect == ''){
      if(cookies.signin_redirect_to){
        setRedirect(cookies.signin_redirect_to)
        console.log('Set redirect to: '+cookies.signin_redirect_to)
      }
    }
  },[redirect,cookies])
  
  return (
    <Web3Providers>
    <Modal>
      <ProfileBanner />

      <LoginModal client='signin' redirect={redirect} authType='siwe'/>
      
      <QuestionsBanner/>
    </Modal>
    </Web3Providers>
  )
}