'use client'

import Web3Providers  from '@/app/web3providers'
import { FrameHeader, InfoBanner, Modal, TinyDivider } from '@/components/app/page'
import { SIWELoginModal } from '@/components/siwe/login'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'

export default function LoginPage() {
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
          <FrameHeader title="Login to MetaWarrior Army"/>
          
          <div className="w-full flex-col text-center">
              <p className="text-base leading-7 text-slate-400 mb-10">Sign a message with your wallet to <b>Log In</b>.</p>
          </div>

          {cookies ? 
            <>
              <SIWELoginModal redirect={cookies.auth_redirect} client={cookies.auth_client} login_challenge={cookies.login_challenge}/>        
              <TinyDivider/>
              <InfoBanner/>
            </> : <></>
          }
        </Modal>
        <ToastContainer/>
      </Web3Providers>
    </>
  )
}