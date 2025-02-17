import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    // Initialize the Supabase client with your project's URL and anon key
    this.supabase = this.supabaseService.getSupabaseClient();
  }

  async uploadFile(bucket: string, path: string, file: File): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).upload(path, file);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  async deleteFile(bucket: string, path: string): Promise<{ data: any, error: any }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).remove([path]);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    try {
        const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)
        return data.publicUrl;
    } catch (error) {
        return 'Error getting public URL';
    }
  }
}
