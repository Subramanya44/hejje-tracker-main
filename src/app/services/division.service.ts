import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Division {
  id: number;
  division_name: string;
  circle_name: string;
  organization: string;
}

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
 
  private divisions: Division[] = [
    { id: 1, division_name:'keyfalcon4',circle_name: 'keyfalcon5', organization: 'keyfalcon6' },
    { id: 2, division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' }
  ];

  private divisionsSubject = new BehaviorSubject<Division[]>(this.divisions);
  divisions$ = this.divisionsSubject.asObservable();

  getDivisions() {
    return this.divisions;
  }

  addDivision(division: Division) {
    division.id = this.divisions.length ? Math.max(...this.divisions.map(c => c.id)) + 1 : 1;
    this.divisions.push(division);
    this.divisionsSubject.next([...this.divisions]);
  }

  updateDivision(id: number, updatedDivision: Division) {
    const index = this.divisions.findIndex(c => c.id === id);
    if (index !== -1) {
      this.divisions[index] = { ...updatedDivision, id };
      this.divisionsSubject.next([...this.divisions]);
    }
  }

  deleteDivision(id: number) {
    this.divisions = this.divisions.filter(c => c.id !== id);
    this.divisionsSubject.next([...this.divisions]);
  }
}
