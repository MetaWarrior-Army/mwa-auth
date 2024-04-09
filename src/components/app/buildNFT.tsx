import { useAccount, useSwitchChain } from 'wagmi'
import { ConnectWalletModal } from '../web3/web3'
import { useEffect, useState } from 'react'
import { screenUsername } from './utils/screenusername'
import { APP_BASE_URL, PINATA_GATEWAY_URL } from '@/utils/app/constants'
import Image from 'next/image'
import { MintNFTModal } from './mintNFT'
import { toasterNotify } from '@/utils/app/toaster'
import { sepolia } from 'viem/chains'

type Username = {
  value: string,
}

export function BuildNFTModal({userWallet,nftMinted,nftUploaded,username,svdAvatarCID,svdNftCID}:{
  userWallet: string,
  nftMinted: any,
  nftUploaded: any,
  username?: string,
  svdAvatarCID?: string,
  svdNftCID?: string,
}){
  const [tos,setTOS] = useState(false)
  const [validUsername,setValidUsername] = useState(false)
  const [nftCID,setNFTCID] = useState('')
  const [avatarCID,setAvatarCID] = useState('')
  const [buildingNFT,setBuildingNFT] = useState(false)
  const [nftName,setNftName] = useState('')
  const [nftLevel,setNftLevel] = useState('')
  const [nftOp,setNftOp] = useState('')
  const [nftSign,setNftSign] = useState('')
  const [minting,setMinting] = useState(false)
  const [minted,setMinted] = useState(false)
  const [wrongChain,setWrongChain] = useState(true)
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()

  // Build NFT 
  async function build(){
    try{
      setBuildingNFT(true)
      console.log('build()')
      // Get Username
      const username = document.getElementById('usernameInput') as unknown as Username
      if(!username) throw Error('Failed to capture username')
      // Build NFT
      const buildReq = await fetch(APP_BASE_URL+'/api/nft/build',{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body: JSON.stringify({id:btoa(address as string),msg:btoa(username.value.toLowerCase())})
      })
      const build = await buildReq.json()
      // Update UI
      if(build.nft_cid){
        nftUploaded()
        setBuildingNFT(false)
        toasterNotify({message:'NFT Ready',type:'success'})
        // Get NFT Meta
        setNFTCID(build.nft_cid)
        setAvatarCID(build.avatar_cid)
        const fetchNFT = await fetch(PINATA_GATEWAY_URL+'/ipfs/'+build.nft_cid)
        const nftMeta = await fetchNFT.json()
        console.log(nftMeta)
        setNftName(nftMeta.name)
        setNftLevel(nftMeta.attributes[3].value)
        setNftOp(nftMeta.attributes[2].value)
        setNftSign(nftMeta.attributes[4].value)
      }
      return true

    } catch(e: any) {
      toasterNotify({message:e.message,type:'error'})
    }
    
  }

  // Screen usernames
  async function checkUsername(event: any){
    // Screen username
    const check = await screenUsername(event.target.value)
    if(!check) throw Error('Failed to screen username')
    // Update status
    const usernameStatus = document.getElementById('usernameStatus')
    if(!usernameStatus) throw Error('Failed to grab usernameStatus')
    if(check.ok){
      setValidUsername(true)
      usernameStatus.innerHTML = '<span class="text-green-500">'+check.msg+'</span>'
    }
    // Bad username
    else{
      setValidUsername(false)
      usernameStatus.innerHTML = '<span class="text-red-500">'+check.msg+'</span>'
    }
  }

  // Check Terms of Service
  async function checkTOS(event: any){
    if(event.target.checked) {
      setTOS(true)
    }
    else {
      setTOS(false)
    }
  }

  

  useEffect(()=>{
    async function getNFT(){
      setNftName(username as string)
      setNFTCID(svdNftCID as string)
      setAvatarCID(svdAvatarCID as string)
      const nftReq = await fetch(PINATA_GATEWAY_URL+'/ipfs/'+svdNftCID)
      const nftMeta = await nftReq.json()
      setNftLevel(nftMeta.attributes[3].value)
      setNftSign(nftMeta.attributes[4].value)
      setNftOp(nftMeta.attributes[2].value)
    }
    if(username && svdAvatarCID && svdNftCID){
      getNFT()
    }

    if(chain?.id !== sepolia.id) {
      setWrongChain(true)
      console.log('Wrong chain connected')
    }
    else{
      setWrongChain(false)
      console.log('Right chain connected')
    }
  },[setWrongChain,chain,username,svdAvatarCID,svdNftCID,setNftLevel,setNftName,setNftSign,setNftOp,setAvatarCID,setNFTCID])

  // Return page
  return (
    <>

    {buildingNFT ? 
      <>
      <div className="relative px-6 pt-10 pb-8 ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10 mt-5">
        <div className="mx-auto max-w-md">
          <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
        </div>
      </div>
      <div>
        <p className="text-slate-400 font-base">Building NFT ⚙️</p>
      </div>
      </> 
      : <></>
    }


    {(nftCID !== '' && avatarCID !== '') ? 
      <>
        <div className="mt-3 mb-3 w-full justify-center space-y-3 bg-slate-900 rounded-lg shadow-2xl p-5">
          <div className="flex w-full justify-between items-start">
            <Image src={(avatarCID) ? PINATA_GATEWAY_URL+"/ipfs/"+avatarCID as string : '#'} width={100} height={100} alt="avatar" className="rounded-lg shadow-lg mb-5"/>
            <h1 className="text-2xl">{nftSign}</h1>
          </div>
          <h1 className="text-2xl font-bold text-yellow-500">{nftName}</h1>
          <p className="text-base text-slate-400"><u>{nftName+'@metawarrior.army'}</u></p>
          <p className="text-base text-slate-400">Membership Level: <span className="font-bold text-green-400">{nftLevel}</span></p>
          <p className="text-base text-slate-400">Operation: <span className="font-bold text-red-400">{nftOp}</span></p>
        </div>
      </>
      :
      <></>
    }


    {(isConnected && userWallet == address && !buildingNFT && nftCID == '') ? 
      <>
        <div className="flex-col w-full mx-auto object-center space-y-7 mt-5 mb-5">
        <div>
          <input onChange={(event)=>checkTOS(event)}
            type="checkbox" className="mr-3 text-yellow-500" id="tosInput"></input>
          <span className="text-yellow-500 text-base">I agree to the <a href="https://www.metawarrior.army/tos" target="_blank"><u>Terms of Service</u></a></span>
        </div>
        <div className="mt-5">
          <p className="text-base text-slate-400 font-bold mb-5">
            Choose your MetaWarrior Army username:
          </p>
          
        </div>
        <div className="text-yellow-950">
          <input disabled={!tos}
            onChange={(event) => checkUsername(event)}
            className="shadow-xl border-solid w-full border-2 rounded" type="text" id="usernameInput"></input>
        </div>
        <div>
          <p className="text-xs" id="usernameStatus"></p>
        </div>
        <div>
        </div>
      </div>
      </> : <></>
    }


    {(isConnected && userWallet == address && !buildingNFT && nftCID == '') ?
      <>
      <div className="mt-5 mb-5">
        <button hidden={false}
          onClick={build}
          id="buildButton"
          disabled={(!tos || !validUsername)}
          className="bg-slate-950 p-2 text-yellow-500 font-bold rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
          >Build NFT</button>
      </div>
      </> : <></>
    }


    {(!wrongChain && isConnected && userWallet == address && !buildingNFT && nftCID !== '') ?
      <>
        <MintNFTModal 
          tokenUri={'ipfs://'+nftCID} 
          address={address as string} 
          onMint={()=>nftMinted()} 
          minted={()=>{
            setMinting(false)
            setMinted(true)
          }}
          minting={()=>setMinting(true)}/>
      </> : (wrongChain && isConnected && userWallet == address && !buildingNFT && nftCID !=='') ? 
            <>
            <div className="mt-5">
              <p className="text-base text-slate-400">Your wallet is connected to the wrong network.</p>
              <div className="mt-5 mb-5">
                <button hidden={false}
                  onClick={()=>switchChain({chainId: sepolia.id})}
                  id="buildButton"
                  disabled={(!tos || !validUsername)}
                  className="bg-slate-950 p-2 text-yellow-500 font-bold rounded-lg w-full shadow-xl border-solid border-2 hover:border-dotted border-yellow-500"
                  >Switch Network</button>
              </div>
            </div>
            </> : <></>
    }
    

    {(userWallet !== address && isConnected && !buildingNFT) ?
      <>
        <p className="p-3 text-base text-slate-400">Connected wallet doesn&apos;t match logged in account. Please disconnect wallet and reconnect with <span className="text-yellow-500">{userWallet}</span>.</p>
      </> : <></>
    }

    { (buildingNFT || minting || minted) ? <></> :
      <>
        <ConnectWalletModal showDisconnect={true}/>
      </>
    }
    
    </>
  )
}