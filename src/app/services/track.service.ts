/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../../environments/environment'
import { AuthService } from "./auth.service"
import { SupabaseService } from './supabase.service'

//@ts-nocheck
@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private supabase: SupabaseClient


  constructor(private authService: AuthService, private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabaseClient()

  }

  async insertTrack(data: any, dataId?: number): Promise<any> {
    try {

      if (dataId != null && dataId > 0) {
        const {data: updatedData, error} = await this.supabase
          .from('tbl_tracks')
          .update(data)
          .eq('id', dataId)
          .single();

        if (error) {
          throw error;
        }
        return updatedData;
      } else {
        data.user_id = this.authService.getCurrentUserId();
        data.status = "PENDING"
        const {data: insertedData, error} = await this.supabase
          .from('tbl_tracks')
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

  async updateTrackMedia(trackId: number, newMedia: string[]): Promise<any> {
    try {
      const {data: updatedData, error} = await this.supabase
        .from('tbl_tracks')
        .update({media: newMedia})
        .eq('id', trackId)
        .single();

      if (error) {
        console.error('Error updating track media:', error);
        throw error;
      }

      return updatedData;
    } catch (error) {
      console.error('Error updating track media:', error);
      throw error;
    }
  }

  async getAllElephantsForMap(userLocation: { latitude: number, longitude: number }): Promise<any> {
    try {
      // @ts-ignore
      const {data, error} = await this.supabase.rpc('get_elephants_for_map', {
        user_latitude: userLocation.latitude,
        user_longitude: userLocation.longitude
      });

      if (error) {
        console.error('Error fetching elephants:', error);
        return null; // or throw an error if needed
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error calling RPC:', error);
      return null; // or throw an error if needed
    }
  }

  async getTrackById(trackId: number): Promise<any> {
    try {
      const {data: trackData, error} = await this.supabase
        .from('tbl_tracks')
        .select('*')
        .eq('id', trackId)
        .single();

      if (error) {
        throw error;
      } else {
        return trackData;
      }

    } catch (error) {
      throw error;
    }
  }


  async fetchAllTracks(startDate?: string, endDate?: string): Promise<any> {

    if (!startDate) {
      const today = new Date();
      startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString().slice(0, 10) + ' 00:00:00';
    }

    if (!endDate) {
      endDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }


    try {
      let query = this.supabase
        .from('tbl_tracks')
        .select('*')
        .order('created_at', {ascending: false});

      // Add date filtering if start and/or end dates are provided
      if (startDate && endDate) {
        query = query
          .gte('created_at', startDate)
          .lte('created_at', endDate);
      } else if (startDate) {
        query = query.gte('created_at', startDate);
      } else if (endDate) {
        query = query.lte('created_at', endDate);
      }

      // Execute the query
      const {data, error} = await query;

      // Check for errors
      if (error) {
        throw error;
      }

      // Return fetched data
      return data;
    } catch (error: any) {
      console.error('Error fetching tracks:', error.message);
      throw error;
    }
  }


  async updateTrackStatus(trackId: number, newStatus: string): Promise<any> {
    try {
      const {data: updatedData, error} = await this.supabase
        .from('tbl_tracks')
        .update({status: newStatus})
        .eq('id', trackId)
        .single();

      if (error) {
        throw error;
      }

      return updatedData;
    } catch (error: any) {
      console.error('Error updating track status:', error.message);
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
    return this.supabase.storage.from('track-images').download(path)
  }

  uploadImage(filePath: string, file: File) {

    const name = this.generateFileName(filePath, file.name);
    this.supabase.storage.from('track-images').upload(name, file, {
      cacheControl: '3600',
      upsert: false
    });

    // return image url
    return this.supabase.storage.from('track-images').getPublicUrl(name).data.publicUrl;
  }

  deleteTrack(trackId: number) {
    return this.supabase
      .from('tbl_tracks')
      .delete()
      .eq('id', trackId);
  }

  async getAddressFromCoordinates(latitude: number, longitude: number): Promise<any> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2&accept-language=en`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting address from coordinates', error);
      throw error; // Re-throw the error to allow handling it where the function is called
    }
  }
}
