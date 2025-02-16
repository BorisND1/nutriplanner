export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      currency_by_region: {
        Row: {
          created_at: string
          currency_code: string
          currency_symbol: string
          exchange_rate_to_euro: number
          id: string
          region: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: string
          currency_symbol: string
          exchange_rate_to_euro: number
          id?: string
          region: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          currency_symbol?: string
          exchange_rate_to_euro?: number
          id?: string
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      food_by_region: {
        Row: {
          allergens: string[] | null
          calories_per_100g: number
          carbs_per_100g: number
          category: string
          created_at: string
          fat_per_100g: number
          id: string
          local_price_per_kg: number | null
          name: string
          price_per_kg: number
          protein_per_100g: number
          region: string
          seasonal_availability: string[] | null
        }
        Insert: {
          allergens?: string[] | null
          calories_per_100g: number
          carbs_per_100g: number
          category: string
          created_at?: string
          fat_per_100g: number
          id?: string
          local_price_per_kg?: number | null
          name: string
          price_per_kg: number
          protein_per_100g: number
          region: string
          seasonal_availability?: string[] | null
        }
        Update: {
          allergens?: string[] | null
          calories_per_100g?: number
          carbs_per_100g?: number
          category?: string
          created_at?: string
          fat_per_100g?: number
          id?: string
          local_price_per_kg?: number | null
          name?: string
          price_per_kg?: number
          protein_per_100g?: number
          region?: string
          seasonal_availability?: string[] | null
        }
        Relationships: []
      }
      meal_notifications: {
        Row: {
          created_at: string
          id: string
          meal_name: string
          notification_sent: boolean | null
          scheduled_time: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          meal_name: string
          notification_sent?: boolean | null
          scheduled_time: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          meal_name?: string
          notification_sent?: boolean | null
          scheduled_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_schedules: {
        Row: {
          created_at: string | null
          custom_meal_name: string | null
          custom_time: string | null
          date: string
          id: string
          is_alternative: boolean | null
          meal_type: string
          original_meal_name: string
          scheduled_time: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_meal_name?: string | null
          custom_time?: string | null
          date: string
          id?: string
          is_alternative?: boolean | null
          meal_type: string
          original_meal_name: string
          scheduled_time: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_meal_name?: string | null
          custom_time?: string | null
          date?: string
          id?: string
          is_alternative?: boolean | null
          meal_type?: string
          original_meal_name?: string
          scheduled_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_schedules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allergies: string[] | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          monthly_budget: number | null
          notification_advance_minutes: number | null
          notification_enabled: boolean | null
          region: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          monthly_budget?: number | null
          notification_advance_minutes?: number | null
          notification_enabled?: boolean | null
          region?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          monthly_budget?: number | null
          notification_advance_minutes?: number | null
          notification_enabled?: boolean | null
          region?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_budget_alternatives: {
        Args: {
          p_region: string
          p_budget: number
          p_category: string
        }
        Returns: {
          name: string
          category: string
          price_per_kg: number
          local_price_per_kg: number
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          region: string
        }[]
      }
      get_foods_by_region_and_budget: {
        Args: {
          p_region: string
          p_budget: number
        }
        Returns: {
          name: string
          category: string
          price_per_kg: number
          local_price_per_kg: number
          calories_per_100g: number
          protein_per_100g: number
          carbs_per_100g: number
          fat_per_100g: number
          region: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
