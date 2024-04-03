'use client'

import { Modal, InfoBanner, FrameHeader } from '@/components/app/page'
import { ConsentModal } from '@/components/app/consent'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { Page, Header, Frame, Footer } from '@/components/app/layout'
import Web3Providers  from '@/app/web3providers'

export default function ConsentPage() {
  const cookies = Cookies.get()
  const [redirect,setRedirect] = useState('')
  const [consentChallenge,setConsentChallenge] = useState('')
  const [clientName,setClientName] = useState('')
  const [logoUri,setLogoUri] = useState('')
  
  useEffect(() => {
      if(redirect){
        window.location.href=redirect
      }
      else if(cookies.oauth_consent_redirect) {
        setRedirect(cookies.oauth_consent_redirect)
      }
      else if(cookies){
        setConsentChallenge(cookies.consent_challenge)
        setClientName(cookies.oauth_client_name)
        setLogoUri(cookies.oauth_logo_uri)
      }
  },[redirect, cookies])

  if(redirect !== ''){
    // Redirecting/Loading
    return(
      <div className="relative px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
      <div className="mx-auto max-w-md">
        <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
      </div>
      </div>
    )
  }
  else{
    return (
      <>
      <Web3Providers>
        <Header title="Consent"/>
        <Page>
          <Frame>
            <FrameHeader title="Do You Authorize?"/>
            <Modal>
              
              <ConsentModal clientName={clientName} logoUri={logoUri} consentChallenge={consentChallenge} />
                
              <InfoBanner/>
            </Modal>
          </Frame>
          <Footer/>
        </Page>
      </Web3Providers>
      </>
    )
  }
  
}
