'use client'

import { Page, Header, Frame, Footer } from '@/components/app/layout'
import Web3Providers  from '@/app/web3providers'
import { Modal, FrameHeader, InfoBanner, TinyDivider, ServicesModal } from '@/components/app/page'
import Cookies from 'js-cookie'
import { APP_BASE_URL } from '@/utils/app/constants'
import { ProfileModal } from '@/components/app/profile'

export default function Profile() {
  const cookies = Cookies.get()

  return (
    <>
    <Web3Providers>
      <Page>
        <Header title="MWA"/>
        <Frame>
          <Modal>
            <FrameHeader title="Membership Profile"/>

            {cookies ?
              <>
              <ProfileModal nftCID={cookies.nft_cid} avatarCID={cookies.nft_avatar_cid} nftTx={cookies.nft_tx} nftId={cookies.nft_id}/>
              </>
              : <></>
            }
              
            <ServicesModal/>

            <TinyDivider/>

            <InfoBanner signOutRedirect={APP_BASE_URL+"/profile"}/>
          </Modal>
        </Frame>
        <Footer/>
      </Page>
    </Web3Providers>
    </>
  )
}