/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { SupabaseClient } from '@supabase/supabase-js'
import { Landmark } from '../models/landmark.model'
import { SupabaseService } from './supabase.service'


//@ts-nocheck
@Injectable({
  providedIn: 'root',
})
export class LandmarksService {
  private supabase: SupabaseClient


  constructor(private supabaseService: SupabaseService, private http: HttpClient) {
    this.supabase = this.supabaseService.getSupabaseClient()


  }

  async insertLandmark(data: any, dataId?: number): Promise<any> {
    try {

      if (dataId != null && dataId > 0) {
        const {data: updatedData, error} = await this.supabase
          .from('tbl_landmarks')
          .update(data)
          .eq('id', dataId)
          .single();

        if (error) {
          throw error;
        }
        return updatedData;
      } else {
        const {data: insertedData, error} = await this.supabase
          .from('tbl_landmarks')
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

  


  async deleteLandmark(landmarkId: number): Promise<any> {
    try {
      const {data: deletedData, error} = await this.supabase
        .from('tbl_landmarks')
        .delete()
        .eq('id', landmarkId)
        .single();

      if (error) {
        throw error;
      }
      return deletedData;
    } catch (error) {
      throw error;
    }
  }

  
  async changeStatus(landmarkId: number, status: boolean): Promise<any> {
    try {
      const {data: updatedData, error} = await this.supabase
        .from('tbl_landmarks')
        .update({status: status})
        .eq('id', landmarkId)
        .single();

      if (error) {
        throw error;
      }

      return updatedData;
    } catch (error) {
      throw error;
    }
  }

  
  
  async fetchLandmarks(): Promise<Landmark[]> {
    try {
      const {data: landmarks, error} = await this.supabase
        .from('tbl_landmarks')
        .select('*')
        .order("created_at", {ascending: false}) // Order by created_at in descending order;
      if (error) {
        throw error;
      }

      return landmarks;
    } catch (error) {
      throw error;
    }
  }

  async fetctActiveLandmarks(): Promise<Landmark[]> {
    try {
      const {data: landmarks, error} = await this.supabase
        .from('tbl_landmarks')
        .select('*')
        .eq('status', true)
        .order("created_at", {ascending: false}) // Order by created_at in descending order;
      if (error) {
        throw error;
      }

      return landmarks;
    } catch (error) {
      throw error;
    }
  }

  async fetchLandmark(landmarkId: number): Promise<Landmark> {
    try {
      const {data: landmark, error} = await this.supabase
        .from('tbl_landmarks')
        .select('*')
        .eq('id', landmarkId)
        .single();

      if (error) {
        throw error;
      }

      return landmark;
    } catch (error) {
      throw error;
    }
  }

  async updateLandmark(data: any, dataId: number): Promise<any> {
    try {
      const {data: updatedData, error} = await this.supabase
        .from('tbl_landmarks')
        .update(data)
        .eq('id', dataId)
        .single();

      if (error) {
        throw error;
      }

      return updatedData;
    } catch (error) {
      throw error;
    }
  }
}
