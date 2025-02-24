import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Announcement {
  id: number;
  announcement_date: string;
  range_name: string;  
  section_name: string;
  village_name: string;
  timeFieldsArray: string[];
}

@Injectable({
  providedIn: 'root',
})

export class AnnouncementService {
  private announcements: Announcement[] = [
    { id: 1,announcement_date:"2025-02-19", range_name:"keyfalcon4",section_name:'keyfalcon4',village_name: 'keyfalcon5', timeFieldsArray: ["18:20", "21:25"]},
    { id: 2,announcement_date:"2025-02-19", range_name:"keyfalcon1",section_name:'keyfalcon1',village_name: 'keyfalcon2', timeFieldsArray: ["18:20", "21:25"]}
  ]; 

  private announcementSubject = new BehaviorSubject<Announcement[]>(this.announcements);
  announcements$ = this.announcementSubject.asObservable();

  getAnnoucement() {
    return this.announcements;
  }

  addAnnoucement(announcement: Announcement) {
    announcement.id = this.announcements.length ? Math.max(...this.announcements.map(c => c.id)) + 1 : 1;
    this.announcements.push(announcement);
    this.announcementSubject.next([...this.announcements]);
  }

  updateAnnoucement(id: number, updateAnnoucement: Announcement) {
    const index = this.announcements.findIndex(c => c.id === id);
    if (index !== -1) {
      this.announcements[index] = { ...updateAnnoucement, id };
      this.announcementSubject.next([...this.announcements]);
    }
  }

  deleteAnnoucement(id: number) {
    this.announcements = this.announcements.filter(c => c.id !== id);
    this.announcementSubject.next([...this.announcements]);
  }

}
