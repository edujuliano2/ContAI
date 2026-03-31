import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export type Database = {
  public: {
    Tables: {
      lancamentos: {
        Row: {
          id: number
          created_at: string
          valor: number
          despesa: string
          categoria: string
          zap: string | null
          user_id: string
        }
        Insert: {
          valor: number
          despesa: string
          categoria: string
          zap?: string | null
        }
        Update: {
          valor?: number
          despesa?: string
          categoria?: string
          zap?: string | null
        }
      }
    }
  }
}

export type Lancamento = Database['public']['Tables']['lancamentos']['Row']
