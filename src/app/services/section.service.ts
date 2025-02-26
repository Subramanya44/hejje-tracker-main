import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Section {
  id: number;
  section_name: string;
  range_name: string;  
  division_name: string;
  circle_name: string;
  organization: string;
}

@Injectable({
  providedIn: 'root',
})
export class SectionService {
 
  private sections: Section[] = [
    { id: 1,section_name:"keyfalcon", range_name:"BELURU",division_name:'keyfalcon4',circle_name: 'keyfalcon5', organization: 'keyfalcon6' },
    { id: 2,section_name:"keyfalcon", range_name:"YESLURU",division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' },
    { id: 2,section_name:"keyfalcon", range_name:"ALURU",division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' },
    { id: 2,section_name:"keyfalcon", range_name:"SAKALESHAPURA",division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' }
  ];

  private sectionsSubject = new BehaviorSubject<Section[]>(this.sections);
  sections$ = this.sectionsSubject.asObservable();

  getSections() {
    return this.sections;
  }

  addSections(section: Section) {
    section.id = this.sections.length ? Math.max(...this.sections.map(c => c.id)) + 1 : 1;
    this.sections.push(section);
    this.sectionsSubject.next([...this.sections]);
  }

  updateSections(id: number, updateSection: Section) {
    const index = this.sections.findIndex(c => c.id === id);
    if (index !== -1) {
      this.sections[index] = { ...updateSection, id };
      this.sectionsSubject.next([...this.sections]);
    }
  }

  deleteSections(id: number) {
    this.sections = this.sections.filter(c => c.id !== id);
    this.sectionsSubject.next([...this.sections]);
  }
}
