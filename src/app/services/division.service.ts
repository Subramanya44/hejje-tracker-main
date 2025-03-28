import { Injectable } from '@angular/core';
import { Division } from '../models/division';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabaseClient();
  }

  // Fetch all divisions with their related circle details
  async getDivisions(): Promise<Division[]> {
    try {
      const { data, error } = await this.supabase
        .from('tbl_division')
        .select(`
          div_id,
          division_name,
          tbl_circle!inner(
            circle_id,
            circle_name,
            tbl_organizations!inner(
              org_id,
              organization_name
            )
          )
        `)
        .order('div_id', { ascending: true });
  
      console.log('API Response:', data);
  
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
  
      return (data || []).map((division: any) => ({
        div_id: division.div_id,
        division_name: division.division_name,
        tbl_circle: {
          circle_id: division.tbl_circle?.circle_id || 0,
          circle_name: division.tbl_circle?.circle_name || '',
          tbl_organizations: {
            org_id: division.tbl_circle?.tbl_organizations?.org_id || 0,
            organization_name: division.tbl_circle?.tbl_organizations?.organization_name || '',
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching divisions:', error);
      return [];
    }
  }
  
  

  // Add a new division (includes role_name)
  async addDivision(division: Division): Promise<any> {
    try {
      // Ensure that the circle exists before inserting
      const { data: circleData, error: circleError } = await this.supabase
        .from('tbl_circle')
        .select('circle_id')
        .eq('circle_id', division.tbl_circle.circle_id)
        .single();

      if (circleError || !circleData) {
        throw new Error('Circle not found');
      }

      const { data, error } = await this.supabase
        .from('tbl_division')
        .insert({
          division_name: division.division_name,
          circle_id: circleData.circle_id, // Correctly reference the foreign key
          role_name: 'DIVISION_USER', // Include role_name only when adding
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding division:', error);
      return null;
    }
  }

  // Update an existing division (does NOT include role_name)
  async updateDivision(div_id: number, updatedDivision: Division): Promise<any> {
    try {
      // Ensure that the circle exists before updating
      const { data: circleData, error: circleError } = await this.supabase
        .from('tbl_circle')
        .select('circle_id')
        .eq('circle_id', updatedDivision.tbl_circle.circle_id)
        .single();

      if (circleError || !circleData) {
        throw new Error('Circle not found');
      }

      const { data, error } = await this.supabase
        .from('tbl_division')
        .update({
          division_name: updatedDivision.division_name,
          circle_id: circleData.circle_id, // Ensure valid foreign key update
        })
        .eq('div_id', div_id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating division:', error);
      return null;
    }
  }

  // Delete a division
  async deleteDivision(div_id: number): Promise<any> {
    try {
      const { error } = await this.supabase
        .from('tbl_division')
        .delete()
        .eq('div_id', div_id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting division:', error);
    }
  }
}
