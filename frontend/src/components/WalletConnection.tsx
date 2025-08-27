import { ConnectButton, useCurrentAccount, useSuiClientQuery, useConnectWallet, useWallets } from '@mysten/dapp-kit'
import { isEnokiWallet } from '@mysten/enoki'
import SuiIcon from './icons/sui'


function WalletConnection() {
  const currentAccount = useCurrentAccount()
  const { mutate: connect } = useConnectWallet()
  
  const wallets = useWallets().filter(isEnokiWallet)
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map()
  )

  const googleWallet = walletsByProvider.get('google')
  
  const { data: balance, isLoading: balanceLoading } = useSuiClientQuery(
    'getBalance',
    {
      owner: currentAccount?.address!,
    },
    {
      enabled: !!currentAccount?.address,
    }
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-[#C0E6FF]">
      <div className="flex items-center space-x-3 mb-4">
        <div className="rounded-full flex items-center justify-center">
          <SuiIcon />
        </div>
        <h2 className="text-xl font-bold text-[#011829]">Enoki Wallet</h2>
      </div>

      {currentAccount ? (
        <div className="space-y-4">
          <div className="bg-[#C0E6FF] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#011829]">Connected Address</span>
              <div className="w-2 h-2 bg-[#4DA2FF] rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-mono bg-white px-3 py-2 rounded border text-[#011829] block">
              {currentAccount.address.slice(0, 12)}...{currentAccount.address.slice(-8)} <br />
            </span>
          </div>

          <div className="bg-gradient-to-r from-[#4DA2FF] to-[#C0E6FF] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white">SUI Balance</span>
              <SuiIcon fill="white" />
            </div>
            {balanceLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-white">Loading...</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-white">
                {balance ? (
                  <>
                    {(Number(balance.totalBalance) / 1_000_000_000).toFixed(4)} <span className="text-sm font-normal">SUI</span>
                  </>
                ) : (
                  <span className="text-sm">0.0000 SUI</span>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
            <ConnectButton 
              connectText="Connect Sui Wallet"
              className="bg-[#4DA2FF] hover:bg-[#C0E6FF] hover:text-[#011829] text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
            />
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-sm text-[#011829] mb-4">
            Connect your Enoki wallet to start placing bets on Super Lig matches
          </div>
          
          <div className="space-y-3">
            {googleWallet && (
              <button 
                onClick={() => connect({ wallet: googleWallet })}
                className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            )}
            
            
            <ConnectButton
              connectText={<div className='flex gap-2 items-center' style={{color: 'white'}}>
                <SuiIcon fill='#FFFFFF' />
                Connect Wallet
              </div>}
              className="w-full"
              style={{ background: '#4DA2FF', color: 'white' }}
            />
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Supported: Google and other Sui wallets
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletConnection