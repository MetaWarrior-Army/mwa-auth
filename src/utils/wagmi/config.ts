import { http, createConfig, cookieStorage, createStorage } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'
import { PROJECT_NAME, WC_PROJECT_ID, ALCHEMY_SEPOLIA_URL } from '@/utils/app/constants'

// This is redefined in web3Providers fix this
const wcMetaData = {
  name: PROJECT_NAME,
  description: 'Connect to MetaWarrior Army',
  url: 'https://www.metawarrior.army',
  icons: ['https://www.metawarrior.army/media/img/icon.png'],
}

export const wagmiConfig = createConfig({
  chains: [ sepolia ],
  connectors: [
    walletConnect({ projectId: WC_PROJECT_ID, metadata: wcMetaData }),
    coinbaseWallet({
        appName: wcMetaData.name,
        appLogoUrl: wcMetaData.icons[0]
      }),
    injected({shimDisconnect:true}),
  ],
  transports: {
    [sepolia.id]: http(ALCHEMY_SEPOLIA_URL),
  },
  ssr: true,
})