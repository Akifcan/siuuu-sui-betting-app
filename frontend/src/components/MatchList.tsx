import MatchCard from './MatchCard'

function MatchList({ matches, betSlip, onAddToBetSlip }: MatchListProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {matches.map((match, index) => (
        <MatchCard
          key={index}
          match={match}
          index={index}
          betSlip={betSlip}
          onAddToBetSlip={onAddToBetSlip}
        />
      ))}
    </div>
  )
}

export default MatchList