'use client'

import { QuestionsBanner, Modal, SignOutModal } from '@/components/app/page'
import { ProfileBanner } from '@/components/web3/web3'
import Web3Providers  from '@/app/web3providers'
import {VerifyMFAModal} from '@/components/mfa/verify'
import {RegisterMFAModal} from '@/components/mfa/register'
import {MAX_MFA_PER_USER} from '@/utils/mfa/constants'
import {ShowKeyCount, RevokeAllKeysModal} from '@/components/mfa/page'
import {useState,useEffect} from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Public
const APP_DOMAIN = 'auth.metawarrior.army'

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
    <Web3Providers>
    <Modal>
      <ProfileBanner />
        <div className="space-y-6 py-8 text-base leading-7 dark:text-slate-400">

          <h1>Manage Security Keys</h1>

          <p>Here you can register and verify up to 3 Passkeys or Security Keys.</p>

          {(keyCount+1) > MAX_MFA_PER_USER ? <></> :
            <>
            <RegisterMFAModal onRegister={()=>incrementKeyCount()}/>
            </>
          }
          

          {(hasKeys) ? 
              (
                <>
                <VerifyMFAModal/>
                <ShowKeyCount keycount={keyCount}/>
                <RevokeAllKeysModal onRevoke={()=>clearKeyCount()}/>
                </>
              )
              : (<></>)
          }
        </div>
          
      <QuestionsBanner/>

      <SignOutModal redirect={signOutRedirect} />
      
    </Modal>
    <ToastContainer/>
    </Web3Providers>
  )
}