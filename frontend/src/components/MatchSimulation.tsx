import { useState, useEffect } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createSendFundsTransaction } from '../contracts/betting'

interface MatchSimulationProps {
  match: {
    home: { title: string; logo: string }
    away: { title: string; logo: string }
  }
  userBet: {
    matchIndex: number
    betType: '1' | 'X' | '2'
    odds: number
    stake: number
  }
  onSimulationComplete: (winner: '1' | 'X' | '2') => void
  onClose: () => void
  onShowDialog: (title: string, message: string, type: 'success' | 'error' | 'info', link?: { url: string; text: string }) => void
}

function MatchSimulation({ match, userBet, onSimulationComplete, onClose, onShowDialog }: MatchSimulationProps) {
  const currentAccount = useCurrentAccount()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  const [winner, setWinner] = useState<'1' | 'X' | '2' | null>(null)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime >= 90) {
          setIsRunning(false)
          
          // Determine winner based on current score
          let finalWinner: '1' | 'X' | '2'
          if (homeScore > awayScore) {
            finalWinner = '1'
          } else if (awayScore > homeScore) {
            finalWinner = '2'
          } else {
            finalWinner = 'X'
          }
          
          setWinner(finalWinner)
          
          // Dialog stays open, user manually closes it
          
          return 90
        }
        
        // Random scoring during the match (limited to max 4 goals per team)
        if (Math.random() < 0.02) { // 2% chance each update (reduced from 5%)
          if (Math.random() < 0.5 && homeScore < 4) {
            setHomeScore(prev => prev + 1)
          } else if (awayScore < 4) {
            setAwayScore(prev => prev + 1)
          }
        }
        
        return prevTime + 1
      })
    }, 100) // Faster simulation (100ms per minute)

    return () => clearInterval(interval)
  }, [isRunning, homeScore, awayScore, onSimulationComplete])

  const formatTime = (minutes: number) => {
    return `${Math.floor(minutes)}'`
  }

  const getWinnerText = () => {
    if (winner === '1') return `${match.home.title} Wins! 🎉`
    if (winner === '2') return `${match.away.title} Wins! 🎉`
    return 'Draw! ⚖️'
  }

  const getUserBetResult = () => {
    if (!winner) return null
    const isWin = winner === userBet.betType
    const winAmount = isWin ? (userBet.stake * userBet.odds) : 0
    
    return {
      isWin,
      winAmount,
      betType: userBet.betType,
      stake: userBet.stake
    }
  }

  const getBetTypeText = (betType: '1' | 'X' | '2') => {
    if (betType === '1') return match.home.title
    if (betType === '2') return match.away.title
    return 'Draw'
  }

  const handleReward = async () => {
    if (!currentAccount) {
      console.error('No wallet connected')
      return
    }

    const betResult = getUserBetResult()
    if (!betResult || !betResult.isWin) {
      console.error('No winning bet to claim')
      return
    }

    try {
      // Create transaction to send winnings to user's wallet
      const transaction = createSendFundsTransaction(
        currentAccount.address,
        betResult.winAmount
      )

      // Execute the transaction
      signAndExecuteTransaction(
        {
          transaction,
          chain: 'sui:testnet',
        },
        {
          onSuccess: (result) => {
            const txDigest = result.digest
            const suiscanLink = `https://suiscan.xyz/testnet/tx/${txDigest}`
            
            onShowDialog(
              'Reward Claimed! 🎉',
              `Your reward of ${betResult.winAmount.toFixed(2)} SUI has been sent to your wallet successfully!`,
              'success',
              { url: suiscanLink, text: 'View on SuiScan' }
            )
            
            // Close the simulation after successful reward claim
            onClose()
          },
          onError: (error) => {
            console.error('Error claiming reward:', error)
            onShowDialog(
              'Reward Claim Failed',
              `Failed to claim your reward: ${error.message}`,
              'error'
            )
          },
        }
      )
    } catch (error) {
      console.error('Error creating reward transaction:', error)
    }
  }

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl">⚽ Match Simulation</AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="space-y-6">
          
          {/* Teams and Score */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                  <img 
                    src={`/images/teams/${match.home.logo}`} 
                    alt={match.home.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="font-semibold text-lg text-foreground">{match.home.title}</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="text-5xl font-bold text-primary">
                  {homeScore} - {awayScore}
                </div>
                <div className="text-xl font-semibold text-muted-foreground bg-background px-3 py-1 rounded-full border">
                  {formatTime(time)}
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                  <img 
                    src={`/images/teams/${match.away.logo}`} 
                    alt={match.away.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <span className="font-semibold text-lg text-foreground">{match.away.title}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>0'</span>
              <span className="font-medium">Match Progress</span>
              <span>90'</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-4 border border-border">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-100 ease-out shadow-sm"
                style={{ width: `${(time / 90) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center space-y-4">
            {isRunning ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-lg text-blue-700 font-semibold flex items-center justify-center space-x-2">
                  <span>🏃‍♂️</span>
                  <span>Match in Progress...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    🏁 Full Time!
                  </div>
                  <div className="text-xl text-foreground">
                    {getWinnerText()}
                  </div>
                </div>
                
                {/* User Bet Result */}
                {(() => {
                  const betResult = getUserBetResult()
                  if (!betResult) return null
                  
                  return (
                    <div className={cn(
                      "p-6 rounded-lg border-2 space-y-3",
                      betResult.isWin 
                        ? "bg-green-50 border-green-300 text-green-800" 
                        : "bg-red-50 border-red-300 text-red-800"
                    )}>
                      <div className="font-bold text-xl">
                        {betResult.isWin ? '🎉 Congratulations! You Won!' : '😔 Sorry, You Lost'}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="font-medium text-muted-foreground">Your Bet</div>
                          <div className="font-semibold">{getBetTypeText(betResult.betType)}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium text-muted-foreground">Odds</div>
                          <div className="font-semibold">{userBet.odds}x</div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium text-muted-foreground">Stake</div>
                          <div className="font-semibold">{betResult.stake.toFixed(2)} SUI</div>
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium text-muted-foreground">
                            {betResult.isWin ? 'Winnings' : 'Lost'}
                          </div>
                          <div className={cn(
                            "font-bold text-lg",
                            betResult.isWin ? "text-green-600" : "text-red-600"
                          )}>
                            {betResult.isWin 
                              ? `+${betResult.winAmount.toFixed(2)} SUI` 
                              : `-${betResult.stake.toFixed(2)} SUI`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Football Field Animation */}
        <div className="bg-gradient-to-br from-green-100 via-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="text-center space-y-2">
            <div className="text-3xl">
              ⚽ 🏟️ ⚽
            </div>
            {isRunning && (
              <div className="text-sm text-green-700 font-medium animate-pulse">
                📡 Live Match Simulation
              </div>
            )}
          </div>
        </div>

        <AlertDialogFooter className="justify-center space-x-4">
          {!isRunning && (() => {
            const betResult = getUserBetResult()
            return betResult?.isWin ? (
              <>
                <Button 
                  onClick={handleReward}
                  size="lg" 
                  className="px-8 bg-green-600 hover:bg-green-700"
                >
                  Get Reward
                </Button>
                <Button 
                  onClick={onClose} 
                  size="lg" 
                  variant="outline"
                  className="px-8"
                >
                  Close
                </Button>
              </>
            ) : (
              <Button 
                onClick={onClose} 
                size="lg" 
                className="px-8"
              >
                Close Simulation
              </Button>
            )
          })()}
          
          {isRunning && (
            <Button 
              size="lg" 
              className="px-8"
              disabled={true}
            >
              Match in Progress...
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default MatchSimulation