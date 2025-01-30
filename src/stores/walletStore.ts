import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface WalletState {
  balance: number | null
  loading: boolean
  transactions: any[]
  loadWallet: () => Promise<void>
  loadTransactions: () => Promise<void>
  deposit: (amount: number) => Promise<void>
  withdraw: (amount: number) => Promise<void>
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: null,
  loading: true,
  transactions: [],
  
  loadWallet: async () => {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .single()
    
    set({ balance: wallet?.balance ?? 0, loading: false })
  },
  
  loadTransactions: async () => {
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
    
    set({ transactions: transactions ?? [] })
  },
  
  deposit: async (amount: number) => {
    const { data: transaction } = await supabase
      .from('transactions')
      .insert({
        type: 'deposit',
        amount,
        status: 'completed'
      })
      .select()
      .single()
    
    if (transaction) {
      await get().loadWallet()
      await get().loadTransactions()
    }
  },
  
  withdraw: async (amount: number) => {
    const { balance } = get()
    if (!balance || balance < amount) {
      throw new Error('Insufficient funds')
    }
    
    const { data: transaction } = await supabase
      .from('transactions')
      .insert({
        type: 'withdrawal',
        amount: -amount,
        status: 'completed'
      })
      .select()
      .single()
    
    if (transaction) {
      await get().loadWallet()
      await get().loadTransactions()
    }
  }
}))