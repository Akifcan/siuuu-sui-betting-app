import { useState, useEffect } from 'react'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import fixture from '../lov/fixture'
import Header from './components/Header'
import MatchList from './components/MatchList'
import BetSlip from './components/BetSlip'
import Dialog from './components/Dialog'
import WalletConnection from './components/WalletConnection'
import MyBets from './components/MyBets'
import MatchSimulation from './components/MatchSimulation'
import { createBatchBetsTransaction } from './contracts/betting'

function App() {
  const currentAccount = useCurrentAccount()
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction()
  
  const [betSlip, setBetSlip] = useState<BetSlip>({
    bets: [],
    totalStake: 0,
    potentialWin: 0
  })
  const [stakes, setStakes] = useState<{ [key: string]: string }>({})
  const [myBets, setMyBets] = useState<string[]>([])
  const [dialog, setDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'info'
    link?: { url: string; text: string }
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulatingMatch, setSimulatingMatch] = useState<number | null>(null)
  const [userBet, setUserBet] = useState<{ matchIndex: number; betType: '1' | 'X' | '2'; odds: number; stake: number } | null>(null)

  const odds = {
    '1': 2.5,
    'X': 3.2,
    '2': 2.8
  }

  const addToBetSlip = (matchIndex: number, betType: '1' | 'X' | '2') => {
    setBetSlip(prev => ({
      ...prev,
      bets: [{
        matchIndex,
        betType,
        odds: odds[betType],
        stake: 0
      }],
      totalStake: 0,
      potentialWin: 0
    }))
    setStakes({})
  }

  const removeBet = (matchIndex: number) => {
    setBetSlip(prev => ({
      ...prev,
      bets: prev.bets.filter(bet => bet.matchIndex !== matchIndex)
    }))
    const stakeKey = `${matchIndex}`
    const newStakes = { ...stakes }
    delete newStakes[stakeKey]
    setStakes(newStakes)
  }

  const updateStake = (matchIndex: number, stake: string) => {
    const stakeKey = `${matchIndex}`
    setStakes(prev => ({
      ...prev,
      [stakeKey]: stake
    }))

    const numericStake = parseFloat(stake) || 0
    setBetSlip(prev => ({
      ...prev,
      bets: prev.bets.map(bet => 
        bet.matchIndex === matchIndex 
          ? { ...bet, stake: numericStake }
          : bet
      ),
      totalStake: prev.bets.reduce((total, bet) => 
        total + (bet.matchIndex === matchIndex ? numericStake : bet.stake), 0
      ),
      potentialWin: prev.bets.reduce((total, bet) => {
        const currentStake = bet.matchIndex === matchIndex ? numericStake : bet.stake
        return total + (currentStake * bet.odds)
      }, 0)
    }))
  }

  const showDialog = (
    title: string, 
    message: string, 
    type: 'success' | 'error' | 'info' = 'info',
    link?: { url: string; text: string }
  ) => {
    setDialog({
      isOpen: true,
      title,
      message,
      type,
      link
    })
  }

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }))
  }

  // Load MY_BETS from localStorage on component mount
  useEffect(() => {
    const savedBets = localStorage.getItem('MY_BETS')
    if (savedBets) {
      setMyBets(JSON.parse(savedBets))
    }
  }, [])

  // Save bet digest to localStorage
  const saveBetToLocalStorage = (digest: string) => {
    const updatedBets = [...myBets, digest]
    setMyBets(updatedBets)
    localStorage.setItem('MY_BETS', JSON.stringify(updatedBets))
  }



  const placeBets = async () => {
    if (betSlip.bets.length === 0 || betSlip.totalStake === 0) {
      showDialog('Error', 'Please add at least one bet and enter an amount', 'error')
      return
    }

    if (!currentAccount) {
      showDialog('Wallet Required', 'Please connect your Sui wallet before placing bets. Click the "Connect Wallet" button above to get started.', 'error')
      return
    }

    try {
      // Create batch transaction for all bets
      const transaction = createBatchBetsTransaction(betSlip.bets)

      // Execute the transaction (normal, not sponsored)
      signAndExecuteTransaction(
        {
          transaction,
          chain: 'sui:testnet',
        },
        {
          onSuccess: (result) => {
            const txDigest = result.digest
            
            // Save transaction digest to localStorage
            saveBetToLocalStorage(txDigest)
            
            const suiscanLink = `https://suiscan.xyz/testnet/tx/${txDigest}`
            showDialog(
              'Success!', 
              `${betSlip.bets.length} bet(s) placed successfully!\nTotal: ${betSlip.totalStake.toFixed(2)} SUI\nPotential Win: ${betSlip.potentialWin.toFixed(2)} SUI\n\nMatch simulation will start now...`,
              'success',
              { url: suiscanLink, text: 'View on SuiScan' }
            )
            
            // Auto-close dialog after 3 seconds to show simulation
            setTimeout(() => {
              setDialog(prev => ({ ...prev, isOpen: false }))
            }, 3000)
            
            // Start simulation for the first bet after dialog closes
            if (betSlip.bets.length > 0) {
              const firstBet = betSlip.bets[0]
              setUserBet(firstBet)
              setTimeout(() => {
                setSimulatingMatch(firstBet.matchIndex)
                setIsSimulating(true)
              }, 3500)
            }
            
            setBetSlip({ bets: [], totalStake: 0, potentialWin: 0 })
            setStakes({})
          },
          onError: (error) => {
            console.error('Error placing bets:', error)
            showDialog('Error', `Failed to place bets: ${error.message}`, 'error')
          },
        }
      )
    } catch (error) {
      console.error('Error creating transaction:', error)
      showDialog('Error', 'Failed to create betting transaction. Please try again.', 'error')
    }
  }

  const handleSimulationComplete = (winner: '1' | 'X' | '2') => {
    console.log('Match simulation completed. Winner:', winner)
    setIsSimulating(false)
    setSimulatingMatch(null)
  }

  const closeSimulation = () => {
    setIsSimulating(false)
    setSimulatingMatch(null)
    setUserBet(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Header title={fixture.title} />
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MyBets bets={myBets} />
            <MatchList 
              matches={fixture.matches}
              betSlip={betSlip}
              onAddToBetSlip={addToBetSlip}
            />
          </div>
          
          <div className="space-y-6">
            <WalletConnection />
            <BetSlip
              betSlip={betSlip}
              stakes={stakes}
              onUpdateStake={updateStake}
              onRemoveBet={removeBet}
              onPlaceBets={placeBets}
              isWalletConnected={!!currentAccount}
            />
          </div>
        </div>
      </div>
      
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        link={dialog.link}
      />
      
      {isSimulating && simulatingMatch !== null && userBet && (
        <MatchSimulation
          match={fixture.matches[simulatingMatch]}
          userBet={userBet}
          onSimulationComplete={handleSimulationComplete}
          onClose={closeSimulation}
          onShowDialog={showDialog}
        />
      )}
    </div>
  )
}

export default App
