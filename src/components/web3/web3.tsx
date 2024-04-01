import { useAccount, 
  useDisconnect, 
  //useEnsAvatar, 
  useEnsName, 
  Connector, 
  useConnect } from 'wagmi'
import { useState, useEffect } from 'react'
import Blockies from 'react-blockies'

export function ProfileBanner() {
  const { isConnected, address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  //const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  function sliceWallet(wallet: string) {
    if (wallet) {
      return wallet.slice(0, 6) + '...' + wallet.slice(-4)
    }
  }
  return(
    <div className="text-base leading-7 dark:text-slate-400" id="avatar" hidden={isConnected ? false : true} >
      <div className="p-2">
        <Blockies seed={address ? address.toLowerCase(): ''} size={8} scale={8} className="rounded-lg shadow-xl"/>
      </div>
      {address && <p className="text-yellow-500">{ensName ? `${ensName} (${sliceWallet(address)})` : sliceWallet(address)}</p>}
      <p className="text-xs">Wallet Connected</p>
    </div>
  )
}

export function ConnectWalletModal({showDisconnect}:{
  showDisconnect: boolean
}) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectors, connect } = useConnect()

  // Wallet Option Component for connecting wallet
  function WalletOption({
    connector,
    onClick,
  }: {
    connector: Connector
    onClick: () => void
  }) {
    const [ready, setReady] = useState(false)
    useEffect(() => {
      ;(async () => {
        const provider = await connector.getProvider()
        setReady(!!provider)
      })()
    }, [connector])
    // Wallet Button
    return (
      <>
      <p className="p-2">
        {(ready) ? 
          <>
            <button className="bg-slate-950 w-full p-2 text-yellow-500 rounded-lg shadow-xl border-solid border-2 hover:border-dotted border-yellow-500" disabled={!ready} onClick={onClick}>
              {connector.name}
              </button>
          </>
          :
          <>
          <div className="bg-slate-950 w-full p-2 text-yellow-500 rounded-lg shadow-xl border-solid border-2 hover:border-dotted border-yellow-500">
            <span className="relative mx-auto flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span></span>
          </div>
          </>
          }
      </p>
      </>
    )
  }

  return (
    <>
    <div id="connector_group" hidden={isConnected ? true : false}>

      <p className="p-2 mx-auto font-bold">Connect your wallet</p>
      {connectors.map((connector) => (
        <WalletOption
        key={connector.uid}
        connector={connector}
        onClick={() => connect({ connector })}
        />
      ))}                     
    </div>
    <div>
      {showDisconnect ? (
          <div hidden={isConnected ? false : true}>
            <button className="bg-slate-950 p-2 w-full text-slate-500 rounded-lg shadow-xl border-solid border-2 hover:border-dotted border-slate-500" onClick={() => disconnect()}>Disconnect Wallet</button>
          </div>
        ) : (<></>)
      }
    </div>
    
    </>
  )
}