'use client'

import { Page, Header, Frame } from '@/components/app/layout'
import { FrameHeader, Modal } from '@/components/app/page'
import { screenInvite } from './screeninvite'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { APP_BASE_URL } from '@/utils/app/constants'

type inputElement = {
  value: string
}

export default function InvitePage() {
  const [validInvite,setValidInvite] = useState(false)
  const router = useRouter()

  // Screen usernames
  async function checkInvite(event: any){
    // Screen username
    const check = await screenInvite(event.target.value)
    if(!check) throw Error('Failed to screen invite code')
    // Update status
    const inputStatus = document.getElementById('inputStatus')
    if(!inputStatus) throw Error('Failed to grab inputStatus')
    if(check.ok){
      setValidInvite(true)
      inputStatus.innerHTML = '<span class="text-green-500">'+check.msg+'</span>'
    }
    // Bad username
    else{
      setValidInvite(false)
      inputStatus.innerHTML = '<span class="text-red-500">'+check.msg+'</span>'
    }
  }

  async function useInvite() {
    const inviteElement = document.getElementById('inviteInput') as HTMLInputElement
    if(!inviteElement) throw Error('Failed to capture inviteInput')
    router.push(APP_BASE_URL+'/mint?invite='+inviteElement.value)
  }


  return (
    <>
    <Page>
      <Header title="MWA"/>
      <Frame>
        <Modal>
          <FrameHeader title="Use Your Invite Code"/>

          <div className="flex-col items-center space-y-2 mb-10">
            <p className="text-base text-slate-400">MetaWarrior Army membership is by invite only.</p>
            <p className="text-base text-slate-400">To find out how to get an invite code and follow along with the community sign up for the <a href="https://www.metawarrior.army/sitrep" className="text-yellow-500 hover:text-yellow-300 font-bold"><u>SITREP</u></a>.</p>
          </div>

          <div className="flex-col w-full mx-auto object-center space-y-7 mt-5 mb-5">
            
            <div className="mt-5">
              <p className="text-base text-slate-400 font-bold mb-5">
                Enter your invite code:
              </p>
              
            </div>
            <div className="text-yellow-950">
              <input
                onChange={(event) => checkInvite(event)}
                className="shadow-xl border-solid w-full border-2 rounded" type="text" id="inviteInput"></input>
            </div>
            <div>
              <p className="text-xs" id="inputStatus"></p>
            </div>
            <div>
            </div>
          </div>

          <div className="mt-5 mb-5">
            <button hidden={false}
              onClick={useInvite}
              id="buildButton"
              disabled={(!validInvite)}
              className="bg-slate-950 p-2 text-yellow-500 font-bold rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
              >Use Invite</button>
          </div>

        </Modal>
      </Frame>
    </Page>
    </>
  )
}
