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