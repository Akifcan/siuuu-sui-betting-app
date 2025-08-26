interface TransactionHistoryProps {
  transactionIds: string[]
}

const TransactionHistory = ({ transactionIds }: TransactionHistoryProps) => {
  const formatTxId = (txId: string): string => {
    if (!txId) return 'Unknown'
    return `${txId.slice(0, 10)}...${txId.slice(-8)}`
  }

  const openInExplorer = (txId: string) => {
    const url = `https://suiscan.xyz/testnet/tx/${txId}`
    window.open(url, '_blank')
  }

  if (transactionIds.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <p className="text-gray-500 text-center py-8">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Transaction History ({transactionIds.length} transactions)</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactionIds.map((txId, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-mono text-sm font-medium">{formatTxId(txId)}</p>
                <p className="text-xs text-gray-500">Transaction #{index + 1}</p>
              </div>
              <button
                onClick={() => openInExplorer(txId)}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                View on SuiScan
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionHistory