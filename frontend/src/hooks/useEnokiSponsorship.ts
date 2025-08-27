import { useSignTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'

export const useEnokiSponsorship = () => {
  const { mutateAsync: signTransaction } = useSignTransaction()
  const client = useSuiClient()
  const currentAccount = useCurrentAccount()

  const executeSponsoredTransaction = async (transaction: Transaction) => {
    if (!currentAccount) {
      throw new Error('No account connected')
    }

    try {
      // 1. Build transaction bytes
      const txBytes = await transaction.build({ 
        client, 
        onlyTransactionKind: true 
      })
      
      // 2. Request sponsorship from backend
      const sponsorResponse = await fetch(`${import.meta.env.VITE_API_URL}/app/siuuu-betting-app/enoki/sponsor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network: 'testnet',
          transactionKindBytes: Array.from(txBytes),
          sender: currentAccount.address,
        }),
      })

      if (!sponsorResponse.ok) {
        throw new Error(`Sponsorship failed: ${sponsorResponse.statusText}`)
      }

      const sponsorData = await sponsorResponse.json()
      const { bytes, digest } = sponsorData
      
      // 3. Sign the sponsored transaction bytes
      const { signature } = await signTransaction({ 
        transaction: bytes 
      })

      if (!signature) {
        throw new Error('Transaction signing failed')
      }
      
      // 4. Execute sponsored transaction
      const executeResponse = await fetch(`${import.meta.env.VITE_API_URL}/app/siuuu-betting-app/enoki/finalize/${digest}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature,
        }),
      })
      
      if (!executeResponse.ok) {
        throw new Error(`Execution failed: ${executeResponse.statusText}`)
      }
      
      const result = await executeResponse.json()
      return result
      
    } catch (error) {
      console.error('Enoki sponsored transaction failed:', error)
      throw error
    }
  }

  return {
    executeSponsoredTransaction,
  }
}