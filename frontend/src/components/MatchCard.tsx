import TeamInfo from './TeamInfo'
import OddsButton from './OddsButton'

function MatchCard({ match, index, betSlip, onAddToBetSlip }: MatchCardProps) {
  const odds = {
    '1': 2.5,
    'X': 3.2,
    '2': 2.8
  }

  const selectedBetType = betSlip.bets.find(bet => bet.matchIndex === index)?.betType

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-sm text-gray-500 mb-4">{match.date}</div>
      
      <div className="flex items-center justify-between mb-6">
        <TeamInfo team={match.home} isHome={true} />
        <span className="text-gray-400 font-bold">VS</span>
        <TeamInfo team={match.away} isHome={false} />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <OddsButton
          betType="1"
          odds={odds['1']}
          label={match.home.title}
          isSelected={selectedBetType === '1'}
          onClick={() => onAddToBetSlip(index, '1')}
        />
        <OddsButton
          betType="X"
          odds={odds['X']}
          label="Draw"
          isSelected={selectedBetType === 'X'}
          onClick={() => onAddToBetSlip(index, 'X')}
        />
        <OddsButton
          betType="2"
          odds={odds['2']}
          label={match.away.title}
          isSelected={selectedBetType === '2'}
          onClick={() => onAddToBetSlip(index, '2')}
        />
      </div>
    </div>
  )
}

export default MatchCard