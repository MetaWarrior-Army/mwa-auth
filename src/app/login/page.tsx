'use client'

import { FrameHeader, InfoBanner, Modal } from '@/components/app/page'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { SIWELoginModal } from '@/components/siwe/login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Web3Providers  from '@/app/web3providers'

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
              <div className="inline-flex items-center justify-center w-full">
                <hr className="w-64 h-1 my-8 border-0 rounded bg-gray-700"/>
                <div className="absolute px-4 -translate-x-1/2 left-1/2 ">
                </div>
              </div>
              <InfoBanner/>
            </> : <></>
          }
        </Modal>
        <ToastContainer/>
      </Web3Providers>
    </>
  )
}