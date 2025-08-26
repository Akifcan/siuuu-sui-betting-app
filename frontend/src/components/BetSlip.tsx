import fixture from '../../lov/fixture'
import BetItem from './BetItem'

function BetSlip({ betSlip, stakes, onUpdateStake, onRemoveBet, onPlaceBets, isWalletConnected }: BetSlipProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-4">
      <h2 className="text-xl font-bold mb-4">Bet Slip</h2>
      
      {betSlip.bets.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Select odds from matches to place bets
        </p>
      ) : (
        <div className="space-y-4">
          {betSlip.bets.map((bet) => {
            const match = fixture.matches[bet.matchIndex]
            return (
              <BetItem
                key={bet.matchIndex}
                bet={bet}
                match={match}
                stake={stakes[`${bet.matchIndex}`] || ''}
                onUpdateStake={(value) => onUpdateStake(bet.matchIndex, value)}
                onRemoveBet={() => onRemoveBet(bet.matchIndex)}
              />
            )
          })}
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Total Stake:</span>
              <span className="font-semibold">{betSlip.totalStake.toFixed(2)} SUI</span>
            </div>
            <div className="flex justify-between">
              <span>Potential Win:</span>
              <span className="font-semibold text-green-600">
                {betSlip.potentialWin.toFixed(2)} SUI
              </span>
            </div>
          </div>
          
          <button
            onClick={onPlaceBets}
            disabled={!isWalletConnected}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isWalletConnected 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            {isWalletConnected ? 'Confirm Bets' : 'Connect Wallet to Bet'}
          </button>
        </div>
      )}
    </div>
  )
}

export default BetSlip