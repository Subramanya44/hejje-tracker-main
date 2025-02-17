/* eslint-disable @typescript-eslint/naming-convention */
import {Injectable} from '@angular/core'
import {SupabaseClient} from '@supabase/supabase-js'
import { SupabaseService } from './supabase.service'

//@ts-nocheck
@Injectable({
  providedIn: 'root',
})
export class ElephantService {
  private supabase: SupabaseClient


  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabaseClient()


  }

  async insertElephant(data: any, dataId?: number): Promise<any> {
    try {

      if (dataId != null && dataId > 0) {
        const {data: updatedData, error} = await this.supabase
          .from('tbl_elephants')
          .update(data)
          .eq('id', dataId)
          .single();

        if (error) {
          throw error;
        }
        return updatedData;
      } else {
        const {data: insertedData, error} = await this.supabase
          .from('tbl_elephants')
          .insert(data)
          .select();

        if (error) {
          throw error;
        }
        return insertedData;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateElephantMedia(elephantId: number, newMedia: string[]): Promise<any> {
    try {
      const {data: updatedData, error} = await this.supabase
        .from('tbl_elephants')
        .update({media_attachments: [...newMedia]})
        .eq('id', elephantId)
        .single();

      if (error) {
        console.error('Error updating elephant media:', error);
        throw error;
      }

      return updatedData;
    } catch (error) {
      console.error('Error updating elephant media:', error);
      throw error;
    }
  }

  

  async getElephantById(elephantId: number): Promise<any> {
    try {
      const {data: elephantData, error} = await this.supabase
        .from('tbl_elephants')
        .select('*')
        .eq('id', elephantId)
        .single();

      if (error) {
        throw error;
      } else {
        return elephantData;
      }

    } catch (error) {
      throw error;
    }
  }


  async fetchAllElephants(): Promise<any> {
    try {
      let query = this.supabase
        .from('tbl_elephants')
        .select('*')
        .order('created_at', {ascending: false});

      // Add date filtering if start and/or end dates are provided
  

      // Execute the query
      const {data, error} = await query;

      // Check for errors
      if (error) {
        throw error;
      }

      // Return fetched data
      return data;
    } catch (error: any) {
      console.error('Error fetching elephants master:', error.message);
      throw error;
    }
  }


  generateFileName(id: string, name: string): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    const fileName = `${year}_${month}_${day}/${id}_${name}`

    return fileName;
  }

  downLoadImage(path: string) {
    return this.supabase.storage.from('aaneelli').download(path)
  }

  uploadImage(filePath: string, file: File) {

    const name = this.generateFileName(filePath, file.name);
    this.supabase.storage.from('aaneelli').upload(name, file, {
      cacheControl: '3600',
      upsert: false
    });

    // return image url
    return this.supabase.storage.from('aaneelli').getPublicUrl(name).data.publicUrl;
  }

  deleteElephant(elephantId: number) {
    return this.supabase
      .from('tbl_elephants')
      .delete()
      .eq('id', elephantId);

  }
}
