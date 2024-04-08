'use client'

import { Page, Header, Frame, Footer } from '@/components/app/layout'
import Web3Providers  from '@/app/web3providers'
import { Modal, FrameHeader, InfoBanner, TinyDivider } from '@/components/app/page'
import Cookies from 'js-cookie'
import { APP_BASE_URL } from '@/utils/app/constants'
import { BuildNFTModal } from '@/components/app/buildNFT'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function MintPage() {
  const [nftUploaded,setNftUploaded] = useState(false)
  const [nftMinted,setNftMinted] = useState(false)
  const cookies = Cookies.get()

  return (
    <>
    <Web3Providers>
      <Page>
        <Header title="MWA"/>
        <Frame>
          <Modal>
            

            {(!nftMinted && !nftUploaded) ?
              <>
                <FrameHeader title="Mint Your Membership" icon="📜"/>
                <p className="text-base text-slate-400 mb-10">Mint your Membership and join MetaWarrior Army.</p>
              </> : (!nftMinted && nftUploaded) ?
                    <>
                      <FrameHeader title="Membership Ready"/>
                      <p className="text-base text-slate-400 mb-10">Your Membership is ready to Mint.</p>
                    </> : (nftMinted) ?
                          <>
                            <FrameHeader title="Minted"/>
                            <p className="text-base text-slate-400 mb-10">Your Membership has been Minted!</p>
                          </> : <></>
            }
            
            {cookies ? 
              <>
                <BuildNFTModal userWallet={cookies.address} nftMinted={()=>setNftMinted(true)} nftUploaded={()=>setNftUploaded(true)}/>
              </> : <></>
            }
            
            <TinyDivider/>
            
            <InfoBanner signOutRedirect={APP_BASE_URL+"/mint"}/>
          </Modal>
        </Frame>
        <Footer/>
      </Page>
      <ToastContainer/>
    </Web3Providers>
    </>
  )
}