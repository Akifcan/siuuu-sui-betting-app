import { Transaction } from '@mysten/sui/transactions'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import networks from '../networks'

// Bet type conversion helper
export const getBetType = (betType: '1' | 'X' | '2'): number => {
  switch (betType) {
    case '1': // Home
      return 1
    case '2': // Away
      return 2
    case 'X': // Draw
      return 3
    default:
      return 1
  }
}

// Place a single bet on the contract
export const createPlaceBetTransaction = (
  matchId: number,
  betType: '1' | 'X' | '2',
  stakeAmount: number
): Transaction => {
  const transaction = new Transaction()
  
  // Convert stake from SUI to MIST
  const amountInMist = BigInt(stakeAmount * Number(MIST_PER_SUI))
  
  // Split coins for the bet amount
  const [coin] = transaction.splitCoins(transaction.gas, [amountInMist])
  
  // Call place_bet function: place_bet(contract, id, bet_type, entered_amount, ctx)
  transaction.moveCall({
    target: `${networks.testnet.variables.packageId}::siuuu::place_bet`,
    arguments: [
      transaction.object(networks.testnet.variables.contractObjectId),
      transaction.pure.u64(matchId), // id (match ID)
      transaction.pure.u8(getBetType(betType)), // bet_type
      coin, // entered_amount
    ],
  })

  return transaction
}


// Batch multiple bets into a single transaction
export const createBatchBetsTransaction = (
  bets: Array<{
    matchIndex: number
    betType: '1' | 'X' | '2'
    stake: number
  }>
): Transaction => {
  const transaction = new Transaction()
  
  // Add each bet to the transaction
  bets.forEach((bet) => {
    const amountInMist = BigInt(bet.stake * Number(MIST_PER_SUI))
    const [coin] = transaction.splitCoins(transaction.gas, [amountInMist])
    
    transaction.moveCall({
      target: `${networks.testnet.variables.packageId}::siuuu::place_bet`,
      arguments: [
        transaction.object(networks.testnet.variables.contractObjectId),
        transaction.pure.u64(bet.matchIndex),
        transaction.pure.u8(getBetType(bet.betType)),
        coin,
      ],
    })
  })

  return transaction
}

// Send funds from contract to a specific address with gas sponsorship
export const createSendFundsTransaction = (recipientAddress: string, amount: number, sponsorAddress?: string): Transaction => {
  const transaction = new Transaction()

  // Convert amount from SUI to MIST
  const amountInMist = BigInt(amount * Number(MIST_PER_SUI))

  transaction.moveCall({
    target: `${networks.testnet.variables.packageId}::siuuu::send_funds`,
    arguments: [
      transaction.object(networks.testnet.variables.contractObjectId),
      transaction.pure.address(recipientAddress),
      transaction.pure.u64(amountInMist),
    ],
  })

  // Set gas sponsorship if provided
  if (sponsorAddress) {
    transaction.setSender(recipientAddress)   
    transaction.setGasOwner(sponsorAddress)   
    transaction.setGasBudget(10000000)        
  }

  return transaction
}

