import { ETHERSCAN_API_KEY, ETHERSCAN_SEPOLIA_API_URL } from '@/utils/app/constants'
import { getMwaUser, updateNftTx } from '@/utils/app/db/utils'
import { updateMfaSession } from '@/utils/mfa/db/utils'
import { MwaUser, AppSessionToken } from '@/utils/app/types'
import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { setTimeout } from "timers/promises"

export async function POST(req: NextRequest) {
  console.log('/api/nft/verifytx: ')

  // Get Token
  const token = await getToken({req}) as AppSessionToken
  if(!token) return NextResponse.json({error:'Invalid session'})

  // Get parameters
  const { id,msg,num } = await req.json()

  // Decode parameters
  const address = atob(id)
  const txHash = atob(msg)
  const tokenId = num

  // Validate Session
  if(token.id !== address) return NextResponse.json({error:'Session mismatch',status:500})

  // Get user
  const user = await getMwaUser(address) as MwaUser
  if(!user) return NextResponse.json({error:'Failed to get user',status:500})
  if(user.email_active) return NextResponse.json({error:'User already active',status:500})

  // Validate tx hash with a 3rd party or trusted RPC
  // Loop until value is either (0==Err) or (1==Succ)
  console.log('Pinging Etherscan Sepolia API Endpoint')
  let pingSuccess = false
  let pingCount = 0
  while(!pingSuccess && pingCount < 100){
    
    // Ping Etherscan
    const api_url = ETHERSCAN_SEPOLIA_API_URL+'/api?module=transaction&action=gettxreceiptstatus&txhash='+txHash+'&apikey='+ETHERSCAN_API_KEY
    const pingEtherscan = await fetch(api_url)
    const txCheck = await pingEtherscan.json()
    console.log(txCheck)
    // Check txStatus
    if(txCheck.result.status == '0') return NextResponse.json({error:'Transaction Failed'})
    
    // Verified TX
    if(txCheck.result.status == '1') {

      // Update Tx Info in Database
      const uNftTx = await updateNftTx(user.address,txHash,tokenId)
      if(!uNftTx) return NextResponse.json({error:'Failed to update TX',status:500})

      // Update repurposed MfaSession
      const session = await updateMfaSession(address)
      if(!session) return NextResponse.json({error:'Failed to update session',status:500})
      
      // Return result
      return NextResponse.json({verified:true,session:session})
    }
    
    // Wait 3 seconds before trying again
    pingCount += 1
    await setTimeout(3000)
  }
  
  return NextResponse.json({error:'Failed to verify tx with Etherscan',status:500})
}