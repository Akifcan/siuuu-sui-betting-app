interface MyBetsProps {
  bets: string[]
}

const MyBets = ({ bets }: MyBetsProps) => {
  const formatTxId = (txId: string): string => {
    if (!txId) return 'Unknown'
    return `${txId.slice(0, 10)}...${txId.slice(-8)}`
  }

  const openInExplorer = (txId: string) => {
    const url = `https://suiscan.xyz/testnet/tx/${txId}`
    window.open(url, '_blank')
  }

  const openContractTransactions = () => {
    const url = `https://suiscan.xyz/testnet/object/0x4f34bf51146c28a8cfce3376dd255a637df43d3380fd58803668517ee410f659/tx-blocks`
    window.open(url, '_blank')
  }

  if (bets.length === 0) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            ⚽
          </div>
          <h2 className="text-xl font-bold">My Football Bets</h2>
        </div>
        <div className="bg-white/10 rounded-lg p-8 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <p className="text-white/80">No bets placed yet</p>
          <p className="text-sm text-white/60 mt-2">Place your first bet to start tracking!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            ⚽
          </div>
          <div>
            <h2 className="text-xl font-bold">My Football Bets</h2>
            <p className="text-sm text-white/80">{bets.length} active transactions</p>
          </div>
        </div>
        <button
          onClick={openContractTransactions}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
        >
          📊 View All Contract Bets
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bets.map((txId, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors border border-white/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-lg">
                  🎲
                </div>
                <div>
                  <p className="font-mono text-sm font-medium text-white">{formatTxId(txId)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/60">Bet #{index + 1}</span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openInExplorer(txId)}
                className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium"
              >
                🔍 View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBets