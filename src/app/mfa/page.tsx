'use client'

import Web3Providers  from '@/app/web3providers'
import { Page, Header, Frame, Footer } from '@/components/app/layout'
import { FrameHeader, InfoBanner, Modal, TinyDivider } from '@/components/app/page'
import {VerifyMFAModal} from '@/components/mfa/verify'
import {RegisterMFAModal} from '@/components/mfa/register'
import {MAX_MFA_PER_USER} from '@/utils/mfa/constants'
import {ShowKeyCount, RevokeAllKeysModal} from '@/components/mfa/page'
import { APP_DOMAIN } from '@/utils/app/constants'
import {useState,useEffect} from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


// Login
export default function MfaPage() {
  const signOutRedirect = 'https://'+APP_DOMAIN+'/mfa'
  const [keyCount,setKeyCount] = useState(0)
  const [hasKeys,setHasKeys] = useState(false)
  
  // Increment keycount through RegisterMFAModal
  async function incrementKeyCount(){
    setHasKeys(true)
    setKeyCount(keyCount+1)
  }
  // Clear keys through RevokeAllKeysModal
  async function clearKeyCount(){
    setHasKeys(false)
    setKeyCount(0)
  }

  useEffect(()=>{
    // Get Key Count from API
    async function getKeyCount(){
      const getReq = await fetch('/api/mfa/getKeyCount')
      const res = await getReq.json()
      if(res.keycount > 0) setHasKeys(true)
      setKeyCount(res.keycount)
      return res.keycount
    }

    if(!keyCount){
      getKeyCount()
    }
    else if(keyCount == 0){
      setHasKeys(false)
    }
  },[hasKeys,keyCount,setKeyCount,setHasKeys])
  
  return (
    <>
    <Web3Providers>
      <Header title="MFA"/>

      <Frame>

        <Modal>
          <FrameHeader title="Manage MFA Keys"/>

          <div className="space-y-6 py-8 text-base leading-7 dark:text-slate-400">
            <p><b>Register</b> and <b>verify</b> up to <span className="text-xl text-yellow-500"><b>3</b></span> Passkeys or Security Keys.</p>
            <p>Registering <span className="text-xl text-yellow-500"><b>1</b></span> key will <b>force</b> you to use it the next time you login.</p>
            {hasKeys ? 
              <>
                <ShowKeyCount keycount={keyCount}/>
              </> : <></>
            
            }
            {(keyCount+1) > MAX_MFA_PER_USER ? <></> :
              <>
                <RegisterMFAModal onRegister={()=>incrementKeyCount()}/>
              </>
            }
            {hasKeys ? 
              <>
                <VerifyMFAModal/>
                <RevokeAllKeysModal onRevoke={()=>clearKeyCount()}/>
              </> : <></>
            }
            <TinyDivider/>
            <p>Multi-Factor Authentication (MFA) secures account from your main credential (your wallet) becoming compromised.</p>
            <p>You can also use MFA to bind your account to 1-3 devices, password managers, security keys, or a combination thereof.</p>
            <p>MetaWarrior Army implements the WebAuthn standard which supports most physical security keys. This is our preferred method.</p>
            <p>Passkeys are also supported. Most browsers and devices support passkeys, as do most password managers installed as extensions in browsers or on mobile phones.</p>
          </div>
          <div className="inline-flex items-center justify-center w-full">
            <hr className="w-64 h-1 my-8 border-0 rounded bg-gray-700"/>
            <div className="absolute px-4 -translate-x-1/2 left-1/2 ">
            </div>
          </div>


          <InfoBanner signOutRedirect={signOutRedirect} showProfileLink={true}/>
        </Modal>
        <ToastContainer/>
      </Frame>
      <Footer/>
    </Web3Providers>
    </>
  )
}