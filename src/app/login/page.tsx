'use client'

import { FrameHeader, InfoBanner, Modal } from '@/components/app/page'
import Web3Providers  from '@/app/web3providers'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { SIWELoginModal } from '@/components/siwe/login'
import { ProfileBanner } from '@/components/web3/web3'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
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
      <FrameHeader title="Login to MetaWarrior Army"/>
      <Modal>
          {cookies ? 
            <>
            <SIWELoginModal redirect={cookies.auth_redirect} client={cookies.auth_client} login_challenge={cookies.login_challenge}/>
          
            <InfoBanner/>
            </>
            : <></>
          }
      </Modal>
      <ProfileBanner/>
      <ToastContainer/>
    </Web3Providers>
  )
}