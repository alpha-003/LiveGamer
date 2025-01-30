import { useEffect } from 'react'
import { useBettingStore } from '../stores/bettingStore'
import { useWalletStore } from '../stores/walletStore'

export function Matches() {
  const { matches, loading, loadMatches, placeBet } = useBettingStore()
  const { balance, loadWallet } = useWalletStore()

  useEffect(() => {
    loadMatches()
    loadWallet()
  }, [loadMatches, loadWallet])

  const handlePlaceBet = async (matchId: string, oddsId: string) => {
    try {
      await placeBet(matchId, oddsId, 10) // Example fixed amount
      await loadWallet()
    } catch (error) {
      console.error('Failed to place bet:', error)
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
          <div className="text-gray-600">
            Balance: ${balance?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="space-y-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{match.team_home} vs {match.team_away}</h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {match.sport}
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  {new Date(match.start_time).toLocaleString()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {match.odds.map((odd: any) => (
                    <button
                      key={odd.id}
                      onClick={() => handlePlaceBet(match.id, odd.id)}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <span className="font-medium">
                        {odd.type === 'win' ? (
                          odd.value === 1 ? match.team_home : match.team_away
                        ) : odd.type === 'draw' ? (
                          'Draw'
                        ) : (
                          `${odd.type} ${odd.value}`
                        )}
                      </span>
                      <span className="text-indigo-600 font-semibold">
                        {odd.odds.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}