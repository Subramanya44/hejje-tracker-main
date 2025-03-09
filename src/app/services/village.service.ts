import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Village {
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
    { id: 1, village_name:"KANGUPPE",section_name:"BIKKODU", range_name:"BELURU",division_name:'keyfalcon4',circle_name: 'keyfalcon5', organization: 'keyfalcon6' },
    { id: 2, village_name:"HOSALLI",section_name:"HETHURU", range_name:"YESLURU",division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' },
    { id: 3, village_name:"NAVINAHALLI",section_name:"K. HOSAKOTE", range_name:"ALURU",division_name:'keyfalcon4',circle_name: 'keyfalcon5', organization: 'keyfalcon6' },
    { id: 4, village_name:"HOSKIREHALLIALLI",section_name:"BELAGODU", range_name:"SAKALESHAPURA",division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' }
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
