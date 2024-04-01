import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import {PROJECT_NAME,WC_PROJECT_ID} from '@/utils/app/constants'
// Public
const projectId = WC_PROJECT_ID
const projectName = PROJECT_NAME

// This is redefined in web3Providers fix this
export const wagmiConfig = createConfig({
  chains: [mainnet ],
  connectors: [
    walletConnect({ projectId }),
    coinbaseWallet({
        appName: projectName,
      }),
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: true,
})