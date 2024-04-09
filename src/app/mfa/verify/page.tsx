'use client'

import Web3Providers from '@/app/web3providers'
import { FrameHeader, Modal } from '@/components/app/page'
import { MfaLoginModal } from '@/components/mfa/login'
import {useState,useEffect} from 'react'
import Cookies from 'js-cookie'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


// Login
export default function VerifyMfaPage() {
  const [redirect,setRedirect] = useState('')
  const cookies = Cookies.get()

  useEffect(() => {
    if(redirect == ''){
      if(cookies.auth_redirect){
        setRedirect(cookies.auth_redirect)
      }
    }
  },[redirect,cookies])
  
  return (
    <>
    <Web3Providers>
      <Modal>
        <FrameHeader title="Multi-Factor Authentication"/>

        {cookies ? 
          <>
            <MfaLoginModal client={cookies.auth_client} redirect={cookies.auth_redirect} login_challenge={cookies.login_challenge} mfa_session={cookies.mfa_session}/>
          </> : <></>
        }
      </Modal>
      <ToastContainer/>
    </Web3Providers>
    </>
  )
}