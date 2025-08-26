import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import SuiIcon from './icons/sui'

function WalletConnection() {
  const currentAccount = useCurrentAccount()
  
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
        <h2 className="text-xl font-bold text-[#011829]">Sui Wallet</h2>
      </div>

      {currentAccount ? (
        <div className="space-y-4">
          <div className="bg-[#C0E6FF] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#011829]">Connected Address</span>
              <div className="w-2 h-2 bg-[#4DA2FF] rounded-full animate-pulse"></div>
            </div>
            <span className="text-sm font-mono bg-white px-3 py-2 rounded border text-[#011829] block">
              {currentAccount.address.slice(0, 12)}...{currentAccount.address.slice(-8)}
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
            Connect your Sui wallet to start placing bets on Super Lig matches
          </div>
          <ConnectButton
            connectText={<div className='flex gap-2 items-center' style={{color: 'white'}}>
              <SuiIcon fill='#FFFFFF' />
              Connect SUI Wallet
            </div>}
            className="w-full"
            style={{ background: '#4DA2FF', color: 'white' }}
          />

          <div className="text-xs text-gray-500 mt-2">
            Supported wallets: Sui Wallet
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletConnection