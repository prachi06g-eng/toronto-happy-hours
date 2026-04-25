import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type HappyHour = {
  id: number
  name: string
  address: string
  neighbourhood: string | null
  days: string[]
  start_time: string
  end_time: string
  deals: string
  drink_specials: string | null
  food_specials: string | null
  website: string | null
  google_maps_url: string | null
}
