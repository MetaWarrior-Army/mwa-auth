'use client'

import { FrameHeader, InfoBanner, Modal } from '@/components/app/page'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { SIWELoginModal } from '@/components/siwe/login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Page, Header, Frame, Footer } from '@/components/app/layout'
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
        <Header title="Login"/>
        <Page>
          <Frame>
            <Modal>
              <FrameHeader title="Login to MetaWarrior Army"/>

              {cookies ? 
                <>
                  <SIWELoginModal redirect={cookies.auth_redirect} client={cookies.auth_client} login_challenge={cookies.login_challenge}/>        
                  <InfoBanner/>
                </> : <></>
              }
            </Modal>
            <ToastContainer/>
          </Frame>
          <Footer/>
        </Page>
      </Web3Providers>
    </>
  )
}