import { useState, useEffect } from 'react'
import { useWalletStore } from '../stores/walletStore'
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

export function Wallet() {
  const { balance, transactions, loading, loadWallet, loadTransactions, deposit, withdraw } = useWalletStore()
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadWallet()
    loadTransactions()
  }, [loadWallet, loadTransactions])

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    setError('')
    setProcessing(true)

    try {
      const value = parseFloat(amount)
      if (isNaN(value) || value <= 0) {
        throw new Error('Please enter a valid amount')
      }

      if (type === 'deposit') {
        await deposit(value)
      } else {
        await withdraw(value)
      }

      setAmount('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="bg-indigo-100 p-3 rounded-full">
                <WalletIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
                <p className="text-3xl font-bold text-indigo-600">${balance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleTransaction('deposit')}
                  disabled={processing}
                  className="flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  <span>Deposit</span>
                </button>

                <button
                  onClick={() => handleTransaction('withdraw')}
                  disabled={processing}
                  className="flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-6">Transaction History</h2>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {transaction.type === 'deposit' ? (
                      <ArrowUpCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}

              {transactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}