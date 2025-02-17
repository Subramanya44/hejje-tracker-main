/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { SupabaseClient } from '@supabase/supabase-js'
import { Observable, from, map, switchMap } from 'rxjs'
import { environment } from '../../environments/environment'
import { ApiResponse, TrackerData } from '../models/radio-collar-tracker'
import { SupabaseService } from './supabase.service'
import { RadioCollar } from '../models/radio-collars'


//@ts-nocheck
@Injectable({
  providedIn: 'root',
})
export class CollarsService {
  private supabase: SupabaseClient
  private apiUrl = environment.collarsUrl;
  

  constructor(private supabaseService: SupabaseService, private http: HttpClient) {
    this.supabase = this.supabaseService.getSupabaseClient()


  }

  async fetchCollar(collarId: number): Promise<any> {
    try {
      const {data: collar, error} = await this.supabase
        .from('tbl_radio_collars')
        .select('*')
        .eq('id', collarId)
        .single();

      if (error) {
        throw error;
      }

      return collar;
    } catch (error) {
      throw error;
    }
  }

  async insertCollar(data: any, dataId?: number): Promise<any> {
    try {

      if (dataId != null && dataId > 0) {
        const {data: updatedData, error} = await this.supabase
          .from('tbl_radio_collars')
          .update(data)
          .eq('id', dataId)
          .single();

        if (error) {
          throw error;
        }
        return updatedData;
      } else {
        const {data: insertedData, error} = await this.supabase
          .from('tbl_radio_collars')
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

  async deleteCollar(collarId: number): Promise<any> {
    try {
      const {data: deletedData, error} = await this.supabase
        .from('tbl_radio_collars')
        .delete()
        .eq('id', collarId)
        .single();

      if (error) {
        throw error;
      }
      return deletedData;
    } catch (error) {
      throw error;
    }
  }

  
  async changeStatus(collarId: number, status: boolean): Promise<any> {
    try {
      const {data: updatedData, error} = await this.supabase
        .from('tbl_radio_collars')
        .update({status: status})
        .eq('id', collarId)
        .single();

      if (error) {
        throw error;
      }

      return updatedData;
    } catch (error) {
      throw error;
    }
  }

  
  // fetch all collars
  async fetchCollars(): Promise<any> {
    try {
      const {data: collars, error} = await this.supabase
        .from('tbl_radio_collars')
        .select('*')
        .order("created_at", {ascending: false}) // Order by created_at in descending order;
      if (error) {
        throw error;
      }

      return collars;
    } catch (error) {
      throw error;
    }
  }

  // fetch all active collars
  async fetchActiveCollars(): Promise<RadioCollar[]> {
    try {
      const {data: collars, error} = await this.supabase
        .from('tbl_radio_collars')
        .select('*')
        .eq('status', true)
        .order("created_at", {ascending: false}) // Order by created_at in descending order;
      if (error) {
        throw error;
      }

      return collars;
    } catch (error) {
      throw error;
    }
  }

  getTrackerData(startDate: number, endDate: number): Observable<TrackerData[]> {
    const requestPayload = {
      startDate: startDate,
      endDate: endDate
    };

    return from(this.fetchActiveCollars()).pipe(
      switchMap((collars) => {
        return this.http.post<ApiResponse>(this.apiUrl, requestPayload).pipe(
          map((response: ApiResponse) => {
            const trackerData = response.responseData as TrackerData[];
            const activeCollarsImei = collars.map(collar => collar.imei);

            // Filter tracker data by active collars IMEI
            const activeCollarsData = trackerData.filter(data =>
              activeCollarsImei.includes(data.imei)
            );

            return activeCollarsData;
          })
        );
      })
    );
  }

  async updateCollar(data: any, dataId: number): Promise<any> {
    try {
      const {data: updatedData, error} = await this.supabase
        .from('tbl_radio_collars')
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
