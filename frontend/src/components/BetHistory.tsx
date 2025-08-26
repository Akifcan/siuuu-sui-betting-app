interface BetHistory {
  id: number
  match_id: number
  bet_type: number
  amount: string
  bettor: string
  timestamp: number
}

interface BetHistoryProps {
  bets: BetHistory[]
}

const BetHistory = ({ bets }: BetHistoryProps) => {
  const getBetTypeText = (betType: number): string => {
    switch (betType) {
      case 1: return 'Home Win'
      case 2: return 'Away Win'
      case 3: return 'Draw'
      default: return 'Unknown'
    }
  }

  const mistToSui = (mist: string): number => {
    return parseInt(mist) / 1000000000
  }

  const formatAddress = (address: string): string => {
    if (!address) return 'Unknown'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (bets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Bet History</h2>
        <p className="text-gray-500 text-center py-8">No bets found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Bet History ({bets.length} bets)</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {bets.map((bet) => (
          <div key={bet.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">Match #{bet.match_id}</p>
                <p className="text-sm text-gray-600">{getBetTypeText(bet.bet_type)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{mistToSui(bet.amount).toFixed(2)} SUI</p>
                <p className="text-xs text-gray-500">Epoch: {bet.timestamp}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <p>Bettor: {formatAddress(bet.bettor)}</p>
              <p>Bet ID: #{bet.id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BetHistory