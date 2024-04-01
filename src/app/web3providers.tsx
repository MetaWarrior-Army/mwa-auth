'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider} from 'wagmi'
import { useState, type ReactNode } from 'react'
import {wagmiConfig} from '@/utils/wagmi/config'

// Wagmi and Tanstack React Query Providers
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