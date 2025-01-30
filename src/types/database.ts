export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          status: string
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          status?: string
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          status?: string
          created_at?: string
          metadata?: Json
        }
      }
      matches: {
        Row: {
          id: string
          sport: string
          team_home: string
          team_away: string
          start_time: string
          status: string
          result: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sport: string
          team_home: string
          team_away: string
          start_time: string
          status?: string
          result?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sport?: string
          team_home?: string
          team_away?: string
          start_time?: string
          status?: string
          result?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      odds: {
        Row: {
          id: string
          match_id: string
          type: string
          value: number
          odds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          type: string
          value: number
          odds: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          type?: string
          value?: number
          odds?: number
          created_at?: string
          updated_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          user_id: string
          match_id: string
          odds_id: string
          amount: number
          potential_win: number
          status: string
          created_at: string
          settled_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          match_id: string
          odds_id: string
          amount: number
          potential_win: number
          status?: string
          created_at?: string
          settled_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          match_id?: string
          odds_id?: string
          amount?: number
          potential_win?: number
          status?: string
          created_at?: string
          settled_at?: string | null
        }
      }
    }
  }
}