import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Announcement } from '../models/announcement';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AnnouncementService {

  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getSupabaseClient();
  }

  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await this.supabase
        .from('tbl_announcement')
        .select(`
          announcement_id,
          created_at,
          complaint_id,
          complaint_name,
          announcement_date,
          announcement_time_am,
          announcement_time_pm,
          circle_name,
          division_name,
          range_name,
          section_name,
          village_name
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return (data || []).map((announcement: any) => ({
        announcement_id: announcement.announcement_id,
        complaint_id: announcement.complaint_id,
        complaint_name: announcement.complaint_name,
        created_at: announcement.created_at,
        announcement_date: announcement.announcement_date,
        announcement_time_am: announcement.announcement_time_am,
        announcement_time_pm: announcement.announcement_time_pm,
        circle_name: announcement.circle_name,
        division_name: announcement.division_name,
        range_name: announcement.range_name,
        section_name: announcement.section_name,
        village_name: announcement.village_name,
      }));
    } catch (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
  }

  async addAnnouncement(announcement: Announcement): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('tbl_announcement')
        .insert({
          announcement_date: announcement.announcement_date,
          announcement_time_am: announcement.announcement_time_am,
          announcement_time_pm: announcement.announcement_time_pm,
          circle_name: announcement.circle_name,
          division_name: announcement.division_name,
          range_name: announcement.range_name,
          section_name: announcement.section_name,
          village_name: announcement.village_name,
          latitude: announcement.latitude,
          longitude: announcement.longitude,
          location: announcement.location,
          complaint_id: announcement.complaint_id,
          complaint_name: announcement.complaint_name
        })
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding announcement:', error);
      return null;
    }
  }

  async updateAnnouncement(id: number, updatedAnnouncement: Announcement): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('tbl_announcement')
        .update({
          announcement_date: updatedAnnouncement.announcement_date,
          announcement_time_am: updatedAnnouncement.announcement_time_am,
          announcement_time_pm: updatedAnnouncement.announcement_time_pm,
          circle_name: updatedAnnouncement.circle_name,
          division_name: updatedAnnouncement.division_name,
          range_name: updatedAnnouncement.range_name,
          section_name: updatedAnnouncement.section_name,
          village_name: updatedAnnouncement.village_name,
          latitude: updatedAnnouncement.latitude,
          longitude: updatedAnnouncement.longitude,
          location: updatedAnnouncement.location,
          complaint_id: updatedAnnouncement.complaint_id,
          complaint_name: updatedAnnouncement.complaint_name
        })
        .eq('announcement_id', id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      return null;
    }
  }

  async deleteAnnouncement(id: number): Promise<any> {
    try {
      const { error } = await this.supabase
        .from('tbl_announcement')
        .delete()
        .eq('announcement_id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
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

  async getAnnouncementById(id: number): Promise<Announcement | null> {
    try {
      const { data, error } = await this.supabase
        .from('tbl_announcement')
        .select('*')
        .eq('announcement_id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching announcement:', error);
      return null;
    }
  }

  async getComplaintsidname() {
    try {
      const { data, error } = await this.supabase
        .from('tbl_complaints')
        .select('id, name') // Fetch ID & Name
        .eq('status', 'APPROVED');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return [];
    }
  }

}
