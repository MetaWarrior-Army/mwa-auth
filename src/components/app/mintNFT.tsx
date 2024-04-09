import { APP_BASE_URL, NFT_CONTRACT_ADDRESS } from '@/utils/app/constants'
import { contractAbi } from '@/utils/app/nft/abi'
import { useEffect, useState } from 'react'
import { Address, parseEther } from 'viem'
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'

export function MintNFTModal({tokenUri,address,onMint}:{
  tokenUri: string,
  address: string,
  onMint: any,
}) {
  const [mintFinished,setMintFinished] = useState(false)
  const [txConfirming,setTxConfirming] = useState(false)
  const [txConfirmed,setTxConfirmed] = useState(false)
  const [activateSession,setActivateSession] = useState('')
  const [accountActivating,setAccountActivating] = useState(false)
  const [accountActivated,setAccountActivated] = useState(false)
  const { data: hash, writeContract } = useWriteContract()
  const { data: simData, error: simError } = useSimulateContract({
    abi: contractAbi,
    address: NFT_CONTRACT_ADDRESS as Address,
    functionName: 'mintNFT',
    args: [address as Address, tokenUri],
    value: parseEther("0.00"),
  })
  const { data: WaitForTransactionReceiptData, isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({hash})

  // Activate Account
  async function activateAccount(){
    console.log('activateAccount()')
    setAccountActivating(true)
    const activateRequest = await fetch(APP_BASE_URL+'/api/user/activateUser',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({id:btoa(address),msg:btoa(activateSession)})
    })
    const activateRes = await activateRequest.json()
    if(!activateRes) throw Error('Failed to activate account')
    if(!activateRes.activated) throw Error('Failed to activate account.')

    console.log('Account Activated')
    setAccountActivated(true)
    setAccountActivating(false)
    onMint()
  }

  // Confirm TX
  async function confirmTx(){
    setTxConfirming(true)
    if(!WaitForTransactionReceiptData) throw Error('Now Tx Receipt')
    
    // Encode parameters
    const id = btoa(address)
    const msg = btoa(WaitForTransactionReceiptData.transactionHash)
    const num = parseInt(WaitForTransactionReceiptData.logs[0].topics[3] as string,16)
    
    // Verify transaction 
    const confirmReq = await fetch(APP_BASE_URL+'/api/nft/verifytx',{
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body: JSON.stringify({id,msg,num})
    })
    const res = await confirmReq.json()
    if(!res) throw Error('Failed to verify transaction.')
    if(!res.verified) throw Error('Failed to verify transaction')
    console.log('Got activation session: '+res.session)
    // Update UI
    console.log('Transaction verified')
    setActivateSession(res.session)
    setTxConfirmed(true)
    setTxConfirming(false)
    setMintFinished(true)
  }
  
  useEffect(()=>{
    // Confirm Tx Server Side and activate user account
    console.log('tokenUri: '+tokenUri)
    console.log('address: '+address)
    if(isConfirmed && !txConfirmed){
      confirmTx()
    }

    if(txConfirmed && !accountActivated){
      activateAccount()
    }

  },[isConfirmed,txConfirmed,accountActivated,confirmTx,activateAccount,address,tokenUri])

  return (
    <>
    {(!simData && !simError) ? 
      <>
        <div className="flex w-full justify-between items-center mt-5 mb-3">
          <div>
            <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
          </div>
          <div className="p-5">
            <p className="font-base text-slate-400">Preparing your wallet 🧾</p>
          </div>
        </div>
      </> : <></>

    }
    {isConfirming ? 
      <>
        <div className="flex w-full justify-between items-center mt-5 mb-3">
          <div>
            <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
          </div>
          <div className="p-5">
            <p className="font-base text-slate-400">Waiting for transaction. Do not browse away from this page 🔎</p>
          </div>
        </div>
      </> : <></>
    }
    {txConfirming ? 
      <>
        <div className="flex w-full justify-between items-center mt-5 mb-3">
          <div>
            <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
          </div>
          <div className="p-5">
            <p className="font-base text-slate-400 font-base">Verifying transaction. Do not browse away from this page 🧾</p>
          </div>
        </div>
      </> : <></>
    }
    {accountActivating ?
      <>
        <div className="flex w-full justify-between items-center mt-5 mb-3">
          <div>
            <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
          </div>
          <div className="p-5">
            <p className="font-base text-slate-400 font-base">Activating account ⚙️</p>
          </div>
        </div>
      </> : <></>
    }
    {simError ? 
      <>
        <div className="flex-col w-full justify-between mt-5 mb-3 text-wrap space-y-3">
          <div>
            <p className="text-base text-slate-400">Looks like your wallet can&apos;t handle this transaction right now. Usually this is because your wallet balance is too low.</p>
            <p className="text-base text-slate-500"><a href="/" className="text-slate-500 hover:text-slate-300">Go Back</a></p>
          </div>
          <div>
            <article className="text-xs font-base text-orange-500 text-wrap">{simError.message.toString()}</article>
          </div>
        </div>
      </> : <></>
    }


    {(simData) ? 
      <>
        
        <div className="mt-5 mb-5"
          hidden={isConfirmed || isConfirming || txConfirming}
          >
          <p className="text-base text-slate-400 mb-10">You cannot change your username once you mint. Other variables such as Membership Level and your Sign have been predetermined for you. <a className="text-slate-500 hover:text-slate-300" href="/">Go Back</a> to choose a different username.</p>
          <button
            hidden={isConfirmed || isConfirming || txConfirming}
            disabled={isConfirmed || isConfirming}
            onClick={() => writeContract(simData.request)}
            id="mintButton"
            className="bg-slate-950 p-2 text-yellow-500 font-bold rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
            >Mint NFT</button>
        </div>
      </> : <></>
    }

    {

    }
    

    {(mintFinished && WaitForTransactionReceiptData && accountActivated) ? 
      <>
        <div className="mt-10 flex justify-between items-center">
          <div className="flex-col space-y-2 justify-start">
            <p className="text-xs text-late-400">Finished! ⚔️</p>
            <p className="text=xs text-yellow-500"><a href={'https://sepolia.etherscan.io/tx/'+WaitForTransactionReceiptData.transactionHash} target="_blank"><u>View Transaction</u></a></p>
            <p>Visit your <a href="/profile" className="font-bold text-yellow-500"><u>Profile</u></a></p>
          </div>
          <div className="flex-col justify-end">
            <p className="text-4xl"><a href={'https://sepolia.etherscan.io/tx/'+WaitForTransactionReceiptData.transactionHash} target="_blank">🧾</a></p>
          </div>
        </div>
      </> : <></>
    }

    </>
  )
}