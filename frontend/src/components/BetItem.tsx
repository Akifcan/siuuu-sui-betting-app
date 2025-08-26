function BetItem({ bet, match, stake, onUpdateStake, onRemoveBet }: BetItemProps) {
  const getBetTypeLabel = (betType: '1' | 'X' | '2') => {
    switch (betType) {
      case '1': return 'Home'
      case 'X': return 'Draw'
      case '2': return 'Away'
    }
  }

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm">
          <div className="font-semibold">
            {match.home.title} vs {match.away.title}
          </div>
          <div className="text-gray-600">
            {getBetTypeLabel(bet.betType)} - Oran: {bet.odds}
          </div>
        </div>
        <button
          onClick={onRemoveBet}
          className="text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="number"
          placeholder="Amount"
          value={stake}
          onChange={(e) => onUpdateStake(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min="0"
          step="0.01"
        />
        <span className="text-sm text-gray-500">SUI</span>
      </div>
      
      {bet.stake > 0 && (
        <div className="text-sm text-gray-600 mt-1">
          Potential Win: {(bet.stake * bet.odds).toFixed(2)} SUI
        </div>
      )}
    </div>
  )
}

export default BetItem