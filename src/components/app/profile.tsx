'use client'

import { NFT_CONTRACT_ADDRESS, PINATA_GATEWAY_URL } from '@/utils/app/constants'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { toasterNotify } from '@/utils/app/toaster'


export function ProfileModal({nftCID, avatarCID, nftTx, nftId, referral}:{
  nftCID: string,
  avatarCID: string,
  nftTx: string,
  nftId: string,
  referral?: string,
}) {
  const [nftName,setNftName] = useState('')
  const [nftLevel,setNftLevel] = useState('')
  const [nftOp,setNftOp] = useState('')
  const [nftSign,setNftSign] = useState('')

  async function getNft(){
    const req = await fetch(PINATA_GATEWAY_URL+'/ipfs/'+nftCID)
    const nftMeta = await req.json()
    console.log('NFT Meta:')
    console.log(nftMeta)

    setNftName(nftMeta.name)
    setNftOp(nftMeta.attributes[2].value)
    setNftLevel(nftMeta.attributes[3].value)
    setNftSign(nftMeta.attributes[4].value)
  }

  async function copyReferral(){
    await navigator.clipboard.writeText('https://auth.metawarrior.army/mint?invite='+referral)
    toasterNotify({message:'Invite link copied!',type:'success'})
  }


  useEffect(()=>{
    if(nftName == ''){
      console.log("Getting NFT")
      getNft()
    }
    
  },[nftName,getNft])

  return (
    <>
    {referral ? 
      <>
      <p className="text-base text-slate-400">Invite others to join MetaWarrior Army with your personal referral code: <a className="text-yellow-400 font-bold hover:text-yellow-500" onClick={copyReferral}><u>{referral}</u></a></p>
      </> : <></>
    }

    {(nftName !== '') ? 
      <>
        <div className="mt-3 mb-3 w-full justify-center space-y-3 bg-slate-900 rounded-lg shadow-2xl p-5">
          <div className="flex w-full justify-between items-start">
            <Image src={(avatarCID) ? PINATA_GATEWAY_URL+"/ipfs/"+avatarCID : '#'} width={100} height={100} alt="avatar" className="rounded-lg shadow-lg mb-5"/>
            <h1 className="text-2xl">{nftSign}</h1>
          </div>
          <h1 className="text-2xl font-bold text-yellow-500">{nftName}</h1>
          <p className="text-base text-slate-400"> <a href="https://mail.metawarrior.army" target="_blank"><u>{nftName+'@metawarrior.army'}</u></a></p>
          <p className="text-base text-slate-400">Token ID: <span className="font-bold">{nftId}</span></p>
          <p className="text-base text-slate-400">Membership Level: <span className="font-bold text-green-400">{nftLevel}</span></p>
          <p className="text-base text-slate-400">Operation: <span className="font-bold text-red-400">{nftOp}</span></p>
          <p className="text-base text-slate-400"><a href={'https://sepolia.etherscan.io/tx/'+nftTx} target="_blank"><u>Transaction</u></a></p>
          <div className="w-full flex justify-between text-right">
            <p className="text-base text-slate-400">View on <a href={'https://testnets.opensea.io/assets/sepolia/'+NFT_CONTRACT_ADDRESS+'/'+nftId} target="_blank"><u>OpenSea</u></a></p>
            <p className="text-xl"><a href="https://discourse.metawarrior.army/t/metawarrior-army-membership-nft/31" target="_blank">❔</a></p>
          </div>
        </div>
      </>
      : 
      <>
        <div className="relative px-6 pt-10 pb-8 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 mt-5">
          <div className="mx-auto max-w-md">
            <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
          </div>
        </div>
        <div>
          <p className="text-slate-400 font-base">Loading NFT ⚙️</p>
        </div>
      </>
    }
    </>
  )
}

export function ThingsToDoModal(){
  return (
    <>
      <div className="mx-auto max-w-full mt-10">
        <p className="text-base text-slate-400 font-bold">Things to do:</p>
        <div className="flex-col mx-auto justify-center mt-5 space-y-8">
          <div></div>

          <div className="flex mx-auto justify-between items-center">
            <div className="flex-col mr-3">
              <p className="text-2xl"><a href="/mfa" className="font-bold text-yellow-500 hover:text-yellow-300">🔐</a></p>
            </div>
            <div className="flex-col p-5">
              <p className="text-base text-slate-400">Setup Multi-Factor Authentication (MFA) using passkeys or security keys.</p>
            </div>
          </div>

          <div className="flex mx-auto justify-between items-center">
            <div className="flex-col mr-3">
              <p className="text-2xl"><a href="https://mail.metawarrior.army" target="_blank" className="font-bold text-yellow-500 hover:text-yellow-300">✉️</a></p>
            </div>
            <div className="flex-col p-5">
              <p className="text-base text-slate-400">Login to your email to send and receive messages.</p>
            </div>
          </div>

          <div className="flex mx-auto justify-between items-center">
            <div className="flex-col mr-3">
              <p className="text-2xl"><a href="https://mail.metawarrior.army" target="_blank" className="font-bold text-yellow-500 hover:text-yellow-300">📢</a></p>
            </div>
            <div className="flex-col p-5">
              <p className="text-base text-slate-400">Join us on Mastodon, follow the news and explore federated social media.</p>
            </div>
          </div>
          
          <div className="flex mx-auto justify-between items-center">
            <div className="flex-col mr-3">
              <p className="text-2xl"><a href="https://matrix.metawarrior.army" target="_blank" className="font-bold text-yellow-500 hover:text-yellow-300">💬</a></p>
            </div>
            <div className="flex-col p-5">
              <p className="text-base text-slate-400">Login to our Matrix space to chat with other members in realtime. Create your own rooms and explore federated chat.</p>
            </div>
          </div>

          <div className="flex mx-auto justify-between items-center">
            <div className="flex-col mr-3">
              <p className="text-2xl"><a href="https://discourse.metawarrior.army" target="_blank" className="font-bold text-yellow-500 hover:text-yellow-300">📝</a></p>
            </div>
            <div className="flex-col p-5">
              <p className="text-base text-slate-400">Read up on MetaWarrior Army and join the discussion. Excercise your voice as a member of the community!</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}