'use client'

import { FrameHeader, Modal } from '@/components/app/page'
import Web3Providers  from '@/app/web3providers'
import {useState,useEffect} from 'react'
import Cookies from 'js-cookie'
import { MfaLoginModal } from '@/components/mfa/login'
import { ProfileBanner } from '@/components/web3/web3'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

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
    <>
    <Web3Providers>
      <FrameHeader title="Multi-Factor Authentication"/>
      <Modal>
        {cookies ? 
          <>
            <MfaLoginModal client={cookies.auth_client} redirect={redirect} login_challenge={cookies.login_challenge}/>
          </> : <></>
        }
      </Modal>
      <ProfileBanner/>
      <ToastContainer/>
    </Web3Providers>
    </>
  )
}