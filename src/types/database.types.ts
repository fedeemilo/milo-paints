export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      paintings: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number | null;
          width: number | null;
          height: number | null;
          depth: number | null;
          year: number | null;
          category: string | null;
          image_url: string;
          cloudinary_public_id: string;
          thumbnail_url: string | null;
          qr_code_url: string | null;
          sold: boolean;
          sold_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price?: number | null;
          width?: number | null;
          height?: number | null;
          depth?: number | null;
          year?: number | null;
          category?: string | null;
          image_url: string;
          cloudinary_public_id: string;
          thumbnail_url?: string | null;
          qr_code_url?: string | null;
          sold?: boolean;
          sold_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number | null;
          width?: number | null;
          height?: number | null;
          depth?: number | null;
          year?: number | null;
          category?: string | null;
          image_url?: string;
          cloudinary_public_id?: string;
          thumbnail_url?: string | null;
          qr_code_url?: string | null;
          sold?: boolean;
          sold_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Tipo helper para las pinturas
export type Painting = Database["public"]["Tables"]["paintings"]["Row"];
export type PaintingInsert = Database["public"]["Tables"]["paintings"]["Insert"];
export type PaintingUpdate = Database["public"]["Tables"]["paintings"]["Update"];
