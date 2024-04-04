'use client'

import { Page, Header, Frame, Footer } from '@/components/app/layout'
import Web3Providers  from '@/app/web3providers'

export default function Home() {
  return (
    <>
    <Web3Providers>
      <Page>
        <Header title="MWA"/>
        <Frame>
          <div className={"relative text-slate-200 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10"}>
            <div className="mx-auto max-w-screen">
              <div className="flex-col justify-start items-end">
                <div className="w-full justify-center items-center">
                  <p className="text-2xl">🔐</p>
                </div>
              </div>
            </div>
          </div>
        </Frame>
        <Footer/>
      </Page>
    </Web3Providers>
    </>
  )
}
