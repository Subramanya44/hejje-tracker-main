import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Range {
  id: number;
  range_name: string;  
  division_name: string;
  circle_name: string;
  organization: string;
}

@Injectable({
  providedIn: 'root',
})
export class RangeService {
 
  private ranges: Range[] = [
    { id: 1, range_name:"keyfalcon",division_name:'keyfalcon4',circle_name: 'keyfalcon5', organization: 'keyfalcon6' },
    { id: 2, range_name:"keyfalcon",division_name:'keyfalcon1',circle_name: 'keyfalcon2', organization: 'keyfalcon3' }
  ];

  private rangesSubject = new BehaviorSubject<Range[]>(this.ranges);
  ranges$ = this.rangesSubject.asObservable();

  getRanges() {
    return this.ranges;
  }

  addRanges(range: Range) {
    range.id = this.ranges.length ? Math.max(...this.ranges.map(c => c.id)) + 1 : 1;
    this.ranges.push(range);
    this.rangesSubject.next([...this.ranges]);
  }

  updateRanges(id: number, updateRange: Range) {
    const index = this.ranges.findIndex(c => c.id === id);
    if (index !== -1) {
      this.ranges[index] = { ...updateRange, id };
      this.rangesSubject.next([...this.ranges]);
    }
  }

  deleteRanges(id: number) {
    this.ranges = this.ranges.filter(c => c.id !== id);
    this.rangesSubject.next([...this.ranges]);
  }
}
