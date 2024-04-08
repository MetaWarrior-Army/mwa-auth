'use client'

import { NFT_CONTRACT_ADDRESS, PINATA_GATEWAY_URL } from '@/utils/app/constants'
import { useEffect, useState } from 'react'
import Image from 'next/image'


export function ProfileModal({nftCID, avatarCID, nftTx, nftId}:{
  nftCID: string,
  avatarCID: string,
  nftTx: string,
  nftId: string,
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


  useEffect(()=>{
    if(nftName == ''){
      console.log("Getting NFT")
      getNft()
    }
    
  },[nftName,getNft])

  return (
    <>
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
          <p className="text-base text-slate-400">View on <a href={'https://testnets.opensea.io/assets/sepolia/'+NFT_CONTRACT_ADDRESS+'/'+nftId} target="_blank"><u>OpenSea</u></a></p>
        </div>
      </> : <></>
    }
    </>
  )
}