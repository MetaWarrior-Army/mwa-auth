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
                <div className="w-full flex-col text-center">
                  <p className="text-base leading-7 text-slate-400 mb-10">Mint your Membership and <b>Join</b>.</p>
                </div>
              </> : (!nftMinted && nftUploaded) ?
                    <>
                      <FrameHeader title="Membership Ready"/>
                      <div className="w-full flex-col text-center">
                        <p className="text-base leading-7 text-slate-400 mb-10">Your Membership is ready to <b>Mint</b>.</p>
                      </div>
                    </> : (nftMinted) ?
                          <>
                            <FrameHeader title="Minted"/>
                            <div className="w-full flex-col text-center">
                              <p className="text-base leading-7 text-slate-400 mb-5">Your <b>Membership</b> has been Minted!.</p>
                            </div>
                            <p className="text-base leading-7 text-slate-400 mb-10">You are now a member of MetaWarrior Army. Visit your new <a href="https://mail.metawarrior.army" className="text-yellow-500 hover:text-yellow-300 font-bold"><u>Mailbox</u></a> to learn more.</p>
                          </> : <></>
            }
            
            {cookies ? 
              <>
                <BuildNFTModal userWallet={cookies.address} nftMinted={()=>setNftMinted(true)} nftUploaded={()=>setNftUploaded(true)} username={cookies.username} svdAvatarCID={cookies.nft_avatar_cid} svdNftCID={cookies.nft_cid} invite={cookies.invite}/>
              </> : <></>
            }
            
            <TinyDivider/>
            
            {cookies ? 
              <>
                <InfoBanner signOutRedirect={APP_BASE_URL+"/mint?invite="+cookies.invite}/>
              </> : <></>
            }
          </Modal>
        </Frame>
        <Footer/>
      </Page>
      <ToastContainer/>
    </Web3Providers>
    </>
  )
}