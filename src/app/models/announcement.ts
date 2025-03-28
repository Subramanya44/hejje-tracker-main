export interface Announcement {
    announcement_id?: number;
    created_at?: string;
    announcement_date: string;
    announcement_time_am?: string;
    announcement_time_pm?: string;
    circle_name: string;
    division_name: string;
    range_name: string[];
    section_name: string[];
    village_name: string[];
    latitude?: number;
    longitude?: number;
    location?: string;
    complaint_id?: number[];
    complaint_name?: string[];
}