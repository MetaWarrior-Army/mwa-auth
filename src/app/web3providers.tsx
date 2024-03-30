'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { useState, type ReactNode } from 'react'

const projectId = '4bacdb3e525e8b52bd47677842435182'

// Public
const WALLETCONNECT_PROJECTID = process.env.WALLETCONNECT_PROJECTID as string
const PROJECT_NAME = process.env.PROJECT_NAME as string

export const wagmiConfig = createConfig({
  chains: [mainnet ],
  connectors: [
    walletConnect({ projectId }),
    coinbaseWallet({
        appName: PROJECT_NAME,
      }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
})

export default function Web3Providers(props: { children: ReactNode }) {

  const [queryClient] = useState(() => new QueryClient())
 
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>

        {props.children}
      
      </QueryClientProvider>
    </WagmiProvider>
  )

}