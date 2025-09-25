import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          auth_uid: string
          full_name: string
          role: 'guest' | 'host'
          city: string
          bio: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_uid: string
          full_name: string
          role: 'guest' | 'host'
          city: string
          bio?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_uid?: string
          full_name?: string
          role?: 'guest' | 'host'
          city?: string
          bio?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          host_id: string
          title: string
          description: string
          city: string
          price: string
          contact_method: 'whatsapp' | 'email'
          published: boolean
          image_url: string | null
          image_alt_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          description: string
          city: string
          price: string
          contact_method: 'whatsapp' | 'email'
          published?: boolean
          image_url?: string | null
          image_alt_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          description?: string
          city?: string
          price?: string
          contact_method?: 'whatsapp' | 'email'
          published?: boolean
          image_url?: string | null
          image_alt_text?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          experience_id: string
          guest_id: string
          status: 'pending' | 'confirmed' | 'cancelled'
          guest_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          guest_id: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          guest_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          guest_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          guest_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          booking_id: string
          sender_profile_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          sender_profile_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          sender_profile_id?: string
          body?: string
          created_at?: string
        }
      }
    }
  }
}

