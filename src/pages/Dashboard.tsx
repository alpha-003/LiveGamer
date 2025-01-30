import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useWalletStore } from '../stores/walletStore'
import { useBettingStore } from '../stores/bettingStore'
import { Wallet, Trophy, Calendar, User } from 'lucide-react'

export function Dashboard() {
  const { profile } = useAuthStore()
  const { balance, loadWallet } = useWalletStore()
  const { bets, loadBets } = useBettingStore()

  useEffect(() => {
    loadWallet()
    loadBets()
  }, [loadWallet, loadBets])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {profile?.username || profile?.email}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/wallet"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Wallet className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-xl font-semibold">${balance?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/matches"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Active Bets</p>
                <p className="text-xl font-semibold">
                  {bets.filter(bet => bet.status === 'pending').length}
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/matches"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-500">Won Bets</p>
                <p className="text-xl font-semibold">
                  {bets.filter(bet => bet.status === 'won').length}
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <User className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Profile</p>
                <p className="text-xl font-semibold">Settings</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Bets</h2>
          {bets.length > 0 ? (
            <div className="space-y-4">
              {bets.slice(0, 5).map((bet) => (
                <div key={bet.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{bet.match.team_home} vs {bet.match.team_away}</p>
                    <p className="text-sm text-gray-500">Amount: ${bet.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Potential Win: ${bet.potential_win}</p>
                    <p className={`text-sm ${
                      bet.status === 'won' ? 'text-green-600' :
                      bet.status === 'lost' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bets placed yet</p>
          )}
        </div>
      </div>
    </div>
  )
}