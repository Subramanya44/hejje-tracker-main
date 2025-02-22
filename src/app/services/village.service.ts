import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Village {
  id: number;
  village_name: string;
  section_name: string;
  range_name: string;  
  division_name: string;
  circle_name: string;
  organization: string;
}

@Injectable({
  providedIn: 'root',
})
export class VillageService {
 
  private villages: Village[] = [
    { id: 1, village_name:"keyfalcon",section_name:"keyfalcon", range_name:"keyfalcon",division_name:'keyfalcon4',circle_name: 'keyfalcon5', organization: 'keyfalcon6' },
    { id: 2, village_name:"keyfalcon",section_name:"keyfalcon", range_name:"keyfalcon",division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' }
  ];

  private villagesSubject = new BehaviorSubject<Village[]>(this.villages);
  villages$ = this.villagesSubject.asObservable();

  getVillages() {
    return this.villages;
  }

  addVillages(village: Village) {
    village.id = this.villages.length ? Math.max(...this.villages.map(c => c.id)) + 1 : 1;
    this.villages.push(village);
    this.villagesSubject.next([...this.villages]);
  }

  updateVillages(id: number, updateVillage: Village) {
    const index = this.villages.findIndex(c => c.id === id);
    if (index !== -1) {
      this.villages[index] = { ...updateVillage, id };
      this.villagesSubject.next([...this.villages]);
    }
  }

  deleteVillages(id: number) {
    this.villages = this.villages.filter(c => c.id !== id);
    this.villagesSubject.next([...this.villages]);
  }
}
