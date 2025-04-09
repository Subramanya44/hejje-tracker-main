import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabaseClient();
  }

  async getOrganizations(): Promise<{ org_id: number; organization_name: string }[]> {
    try {
        const { data, error } = await this.supabase
            .from('tbl_organizations')
            .select('org_id, organization_name')
            .order('organization_name', { ascending: true });

        if (error) {
            console.error('Error fetching organizations:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getOrganizations:', error);
        return [];
    }
  }

  async getCircles(): Promise<{ circle_id: number; circle_name: string }[]> {
    try {
        const { data, error } = await this.supabase
            .from('tbl_circle')
            .select('circle_id, circle_name')
            .order('circle_name', { ascending: true });

        if (error) {
            console.error('Error fetching circle:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getCircleserror:', error);
        return [];
    }
  }

  async getDivisions(): Promise<{ div_id: number; division_name: string }[]> {
    try {
        const { data, error } = await this.supabase
            .from('tbl_division')
            .select('div_id, division_name')
            .order('division_name', { ascending: true });

        if (error) {
            console.error('Error fetching division:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getDivisionerror:', error);
        return [];
    }
  }

  async getRanges(): Promise<{ range_id: number; range_name: string }[]> {
    try {
        const { data, error } = await this.supabase
            .from('tbl_range')
            .select('range_id, range_name')
            .order('range_name', { ascending: true });

        if (error) {
            console.error('Error fetching ranges:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getRanges:', error);
        return [];
    }
  }

  async getSections(): Promise<{ section_id: number; section_name: string }[]> {
    try {
        const { data, error } = await this.supabase
            .from('tbl_section')
            .select('section_id, section_name')
            .order('section_name', { ascending: true });

        if (error) {
            console.error('Error fetching sections:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getSections:', error);
        return [];
    }
  }

  async getVillages(): Promise<{ village_id: number; village_name: string }[]> {
    try {
        const { data, error } = await this.supabase
            .from('tbl_village')
            .select('village_id, village_name')
            .order('village_name', { ascending: true });

        if (error) {
            console.error('Error fetching villages:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error in getVillages:', error);
        return [];
    }
  }
}
