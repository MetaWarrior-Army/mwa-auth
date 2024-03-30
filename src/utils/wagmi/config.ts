import { http, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors'

const projectId = '4bacdb3e525e8b52bd47677842435182'
const projectName = 'MetaWarrior Army'

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