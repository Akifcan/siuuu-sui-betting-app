
interface Bet {
  matchIndex: number
  betType: '1' | 'X' | '2'
  odds: number
  stake: number
}

interface BetSlip {
  bets: Bet[]
  totalStake: number
  potentialWin: number
}

interface HeaderProps {
  title: string
}

interface TeamInfoProps {
  team: { title: string; logo: string }
  isHome?: boolean
}

interface OddsButtonProps {
  betType: '1' | 'X' | '2'
  odds: number
  label: string
  isSelected: boolean
  onClick: () => void
}

interface Match {
  id: number
  date: string
  home: {
    title: string
    logo: string
  }
  away: {
    title: string
    logo: string
  }
}

interface MatchCardProps {
  match: Match
  index: number
  betSlip: BetSlip
  onAddToBetSlip: (matchIndex: number, betType: '1' | 'X' | '2') => void
}

interface BetItemProps {
  bet: Bet
  match: Match
  stake: string
  onUpdateStake: (value: string) => void
  onRemoveBet: () => void
}

interface BetSlipProps {
  betSlip: BetSlip
  stakes: { [key: string]: string }
  onUpdateStake: (matchIndex: number, stake: string) => void
  onRemoveBet: (matchIndex: number) => void
  onPlaceBets: () => void
  isWalletConnected: boolean
}

interface MatchListProps {
  matches: Match[]
  betSlip: BetSlip
  onAddToBetSlip: (matchIndex: number, betType: '1' | 'X' | '2') => void
}