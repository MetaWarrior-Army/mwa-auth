'use client'

import { QuestionsBanner, Modal, SignOutModal } from '@/components/page'
import { ProfileBanner } from '@/components/web3'
import Web3Providers  from '../web3providers'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { start } from 'repl';

// Public
const APP_DOMAIN = 'auth.metawarrior.army'

// Login
export default function MfaPage() {
  const signOutRedirect = 'https://'+APP_DOMAIN+'/mfa'

  // Get Registration Options
  async function generateOptions() {

    const getOptsReq = await fetch('/api/mfa/register')
    const getOptsRes = await getOptsReq.json()
    console.log('received registration options')
    console.log(getOptsRes)
    return getOptsRes
  }

  // Verify Registration
  async function register(attestationResponse: any) {
    console.log('Posting attestationResponse')
    console.log(attestationResponse)
    const verifyReq = await fetch('/api/mfa/register',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify(attestationResponse)
    })
    const verifyRes = await verifyReq.json()
    if(!verifyRes) throw Error('Failed to register security key')

    console.log('Registration response: ')
    console.log(verifyRes)

  }

  async function registerNewKey() {
    const options = await generateOptions()

    const attestationResponse = await startRegistration(options)
    console.log('Received attestationResponse')
    console.log(attestationResponse)

    const registerResult = await register(attestationResponse)

  }

  async function getAuthOptions(){
    const getOptsReq = await fetch('/api/mfa/verify')
    const getOptsRes = await getOptsReq.json()
    console.log('received authentication options')
    console.log(getOptsRes)
    return getOptsRes
  }
  async function verifyAuthentication(verifyResponse: any) {
    const authReq = await fetch('/api/mfa/verify', {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify(verifyResponse)
    })
    const authResp = await authReq.json()
    if(!authResp) throw Error('Failed to get response from /api/mfa/verify')
    return authResp
  }

  async function verifyKey() {
    console.log('generating options')
    const options = await getAuthOptions()

    const verifyResponse = await startAuthentication(options)
    console.log('Received verifyResponse')
    console.log(verifyResponse)

    const authResponse = await verifyAuthentication(verifyResponse)
    console.log(authResponse)


  }
  
  return (
    <Web3Providers>
    <Modal>
      <ProfileBanner />

      <h1>MFA</h1>

      <p>Here you can manage your security keys.</p>

      <p>
      <button className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
      onClick={()=>registerNewKey()}
      >Register New Key</button>
      </p>

      <p>
      <button className="bg-slate-950 p-2 text-yellow-500 rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
      onClick={()=>verifyKey()}
      >Verify Key</button>
      </p>
      
      <QuestionsBanner/>

      <SignOutModal redirect={signOutRedirect} />
      
    </Modal>
    </Web3Providers>
  )
}