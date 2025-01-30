import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface BettingState {
  matches: any[]
  bets: any[]
  loading: boolean
  loadMatches: () => Promise<void>
  loadBets: () => Promise<void>
  placeBet: (matchId: string, oddsId: string, amount: number) => Promise<void>
}

export const useBettingStore = create<BettingState>((set, get) => ({
  matches: [],
  bets: [],
  loading: true,
  
  loadMatches: async () => {
    const { data: matches } = await supabase
      .from('matches')
      .select(`
        *,
        odds (*)
      `)
      .order('start_time', { ascending: true })
    
    set({ matches: matches ?? [], loading: false })
  },
  
  loadBets: async () => {
    const { data: bets } = await supabase
      .from('bets')
      .select(`
        *,
        match:matches (*),
        odds (*)
      `)
      .order('created_at', { ascending: false })
    
    set({ bets: bets ?? [] })
  },
  
  placeBet: async (matchId: string, oddsId: string, amount: number) => {
    const { data: odds } = await supabase
      .from('odds')
      .select('odds')
      .eq('id', oddsId)
      .single()
    
    if (!odds) throw new Error('Odds not found')
    
    const potentialWin = amount * odds.odds
    
    const { data: bet } = await supabase
      .from('bets')
      .insert({
        match_id: matchId,
        odds_id: oddsId,
        amount,
        potential_win: potentialWin
      })
      .select()
      .single()
    
    if (bet) {
      await get().loadBets()
    }
  }
}))