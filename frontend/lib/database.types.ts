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
      data_source: {
        Row: {
          config: string | null
          created_at: string | null
          id: number
          last_indexed_at: string | null
          organization_id: number | null
          type_id: number | null
        }
        Insert: {
          config?: string | null
          created_at?: string | null
          id?: number
          last_indexed_at?: string | null
          organization_id?: number | null
          type_id?: number | null
        }
        Update: {
          config?: string | null
          created_at?: string | null
          id?: number
          last_indexed_at?: string | null
          organization_id?: number | null
          type_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "data_source_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_source_type_id_fkey"
            columns: ["type_id"]
            referencedRelation: "data_source_type"
            referencedColumns: ["id"]
          }
        ]
      }
      data_source_type: {
        Row: {
          config_fields: string
          display_name: string
          id: number
          name: string
        }
        Insert: {
          config_fields: string
          display_name: string
          id?: number
          name: string
        }
        Update: {
          config_fields?: string
          display_name?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      document: {
        Row: {
          author: string | null
          author_image_url: string | null
          data_source_id: number | null
          file_type: string | null
          id: number
          id_in_data_source: string
          indexed_at: string | null
          is_active: boolean | null
          location: string | null
          parent_id: number | null
          status: string | null
          timestamp: string | null
          title: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          author?: string | null
          author_image_url?: string | null
          data_source_id?: number | null
          file_type?: string | null
          id?: number
          id_in_data_source: string
          indexed_at?: string | null
          is_active?: boolean | null
          location?: string | null
          parent_id?: number | null
          status?: string | null
          timestamp?: string | null
          title?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          author?: string | null
          author_image_url?: string | null
          data_source_id?: number | null
          file_type?: string | null
          id?: number
          id_in_data_source?: string
          indexed_at?: string | null
          is_active?: boolean | null
          location?: string | null
          parent_id?: number | null
          status?: string | null
          timestamp?: string | null
          title?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_data_source_id_fkey"
            columns: ["data_source_id"]
            referencedRelation: "data_source"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "document"
            referencedColumns: ["id"]
          }
        ]
      }
      organization: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean
          title: string
          type: Database["public"]["Enums"]["organization_type_enum"]
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          title: string
          type: Database["public"]["Enums"]["organization_type_enum"]
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          title?: string
          type?: Database["public"]["Enums"]["organization_type_enum"]
        }
        Relationships: []
      }
      paragraph: {
        Row: {
          content: string
          document_id: number | null
          id: number
        }
        Insert: {
          content: string
          document_id?: number | null
          id?: number
        }
        Update: {
          content?: string
          document_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "paragraph_document_id_fkey"
            columns: ["document_id"]
            referencedRelation: "document"
            referencedColumns: ["id"]
          }
        ]
      }
      user_organization: {
        Row: {
          created_at: string | null
          organization_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          organization_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          organization_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_organization_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organization_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_organization_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string | null
          instance_id: string | null
          invited_at: string | null
          is_sso_user: boolean | null
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string | null
          instance_id?: string | null
          invited_at?: string | null
          is_sso_user?: boolean | null
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_document_count_by_day: {
        Args: {
          target_organization_id: number
          start_date: string
          end_date: string
        }
        Returns: {
          date: string
          document_count: number
        }[]
      }
      get_document_stats: {
        Args: {
          target_organization_id: number
        }
        Returns: {
          total_documents: number
          documents_added_today: number
        }[]
      }
    }
    Enums: {
      organization_type_enum: "PERSONAL" | "TEAM"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
