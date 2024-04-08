import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { PROJECT_NAME, WC_PROJECT_ID, ALCHEMY_SEPOLIA_URL } from '@/utils/app/constants'

// This is redefined in web3Providers fix this
export const wagmiConfig = createConfig({
  chains: [ sepolia ],
  connectors: [
    walletConnect({ projectId: WC_PROJECT_ID }),
    coinbaseWallet({
        appName: PROJECT_NAME,
      }),
    injected(),
  ],
  transports: {
    [sepolia.id]: http(ALCHEMY_SEPOLIA_URL),
  },
  ssr: true,
})