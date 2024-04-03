'use client'

import { Page, Header, Frame, Footer } from '@/components/app/layout'
import { FrameHeader, InfoBanner, Modal } from '@/components/app/page'
import Web3Providers  from '@/app/web3providers'
import { ToastContainer } from 'react-toastify'
import { ProfileBanner } from '@/components/web3/web3'


export default function Home() {
  return (
    <>
    <Web3Providers>
      <Header title="MWA"/>
      <Page>
        <Frame>
          <Modal>
            <p className="text-2xl">Welcome.</p>

            <InfoBanner/>
          </Modal>
          <ToastContainer/>
        </Frame>
        <Footer/>
      </Page>
    </Web3Providers>
    </>
  )
}
