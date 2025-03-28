import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Circle } from '../models/circle';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class CirclesService {
  
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabaseClient();
  }

  async getCircles(): Promise<Circle[]> {
    try {
      const { data, error } = await this.supabase
        .from('tbl_circle')
        .select(`
          circle_id, 
          circle_name, 
          tbl_organizations (organization_name)
        `)
        .order('created_at', { ascending: false });
    
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
  
      // Manually map the data to match the Circle interface
      const circles: Circle[] = (data || []).map((circle: any) => ({
        id: circle.circle_id, // Map circle_id to id
        circle_name: circle.circle_name,
        tbl_organizations: circle.tbl_organizations || { organization_name: '' }, // Default to an empty object
      }));
  
      return circles;
    } catch (error) {
      console.error('Error fetching circles:', error);
      return [];
    }
  }

  async addCircle(circle: Circle): Promise<any> {
    try {
        // Fetch org_id based on organization_name
        const { data: orgData, error: orgError } = await this.supabase
            .from('tbl_organizations')
            .select('org_id')
            .eq('organization_name', circle.tbl_organizations.organization_name)
            .single();

        if (orgError || !orgData) {
            throw new Error('Organization not found');
        }

        // Insert the circle with the correct org_id
        const { data, error } = await this.supabase
            .from('tbl_circle')
            .insert({
                circle_name: circle.circle_name,
                org_id: orgData.org_id, // Correctly assign the foreign key
                role_name: 'CIRCLE_USER', 
            })
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding circle:', error);
        return null;
    }
  }

  
  async updateCircle(id: number, updatedCircle: Circle): Promise<any> {
    try {
        // Fetch org_id based on organization_name
        const { data: orgData, error: orgError } = await this.supabase
            .from('tbl_organizations')
            .select('org_id')
            .eq('organization_name', updatedCircle.tbl_organizations.organization_name)
            .single();

        if (orgError || !orgData) {
            throw new Error('Organization not found');
        }

        // Update tbl_circle with new circle_name and org_id
        const { data, error } = await this.supabase
            .from('tbl_circle')
            .update({
                circle_name: updatedCircle.circle_name,
                org_id: orgData.org_id, // Correctly update org_id
            })
            .eq('circle_id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating circle:', error);
        return null;
    }
  }


  async deleteCircle(id: number): Promise<any> {
    try {
      const { error } = await this.supabase
        .from('tbl_circle')
        .delete()
        .eq('circle_id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting circle:', error);
    }
  }

}
