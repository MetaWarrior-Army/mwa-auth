import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import {PROJECT_NAME, WC_PROJECT_ID} from '@/utils/app/constants'

// This is redefined in web3Providers fix this
export const wagmiConfig = createConfig({
  chains: [mainnet ],
  connectors: [
    walletConnect({ projectId: WC_PROJECT_ID }),
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