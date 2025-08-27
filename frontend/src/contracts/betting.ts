import { Transaction } from '@mysten/sui/transactions'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import { SuiClient } from '@mysten/sui/client'
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

// Place a single bet on the contract (Normal transaction)
export const createPlaceBetTransaction = (
  matchId: number,
  betType: '1' | 'X' | '2',
  stakeAmount: number
): Transaction => {
  const transaction = new Transaction()
  
  // Convert stake from SUI to MIST
  const amountInMist = BigInt(stakeAmount * Number(MIST_PER_SUI))
  
  // Split coins for the bet amount (normal transaction)
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
        coin, // entered_amount
      ],
    })
  })

  return transaction
}

// Send funds from contract to a specific address (Enoki sponsored)
export const createSendFundsTransaction = (recipientAddress: string, amount: number): Transaction => {
  const transaction = new Transaction()

  // Convert amount from SUI to MIST
  const amountInMist = BigInt(amount * Number(MIST_PER_SUI))

  // For Enoki sponsored reward transactions
  transaction.moveCall({
    target: `${networks.testnet.variables.packageId}::siuuu::send_funds`,
    arguments: [
      transaction.object(networks.testnet.variables.contractObjectId),
      transaction.pure.address(recipientAddress),
      transaction.pure.u64(amountInMist),
    ],
  })

  return transaction
}

// Helper function to prepare transaction for Enoki sponsorship
export const prepareEnokiSponsoredTransaction = async (
  transaction: Transaction,
  client: SuiClient
): Promise<Uint8Array> => {
  // Build transaction bytes for sponsorship
  const transactionBlockKindBytes = await transaction.build({ 
    client, 
    onlyTransactionKind: true 
  })
  
  return transactionBlockKindBytes
}

// Execute sponsored transaction with Enoki (frontend only)
export const executeEnokiSponsoredTransaction = async (
  transaction: Transaction,
  client: SuiClient,
  walletSignFunction: (txBytes: Uint8Array) => Promise<any>
) => {
  try {
    // Build transaction bytes for Enoki sponsorship
    const txBytes = await transaction.build({ client, onlyTransactionKind: true })
    
    // Sign the transaction
    const signedTx = await walletSignFunction(txBytes)
    
    // Execute the transaction
    const result = await client.executeTransactionBlock({
      transactionBlock: signedTx.transactionBlockBytes,
      signature: signedTx.signature,
      options: {
        showEffects: true,
        showEvents: true,
      },
    })
    
    return result
  } catch (error) {
    console.error('Enoki sponsored transaction failed:', error)
    throw error
  }
}

