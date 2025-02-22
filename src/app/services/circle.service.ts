import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Circle {
  id: number;
  circle_name: string;
  organization: string;
}

@Injectable({
  providedIn: 'root',
})
export class CirclesService {
  private circles: Circle[] = [
    { id: 1, circle_name: 'keyfalcon', organization: 'keyfalcon' },
    { id: 2, circle_name: 'keyfalcon2', organization: 'keyfalcon2' }
  ];

  private circlesSubject = new BehaviorSubject<Circle[]>(this.circles);
  circles$ = this.circlesSubject.asObservable();

  getCircles() {
    return this.circles;
  }

  addCircle(circle: Circle) {
    circle.id = this.circles.length ? Math.max(...this.circles.map(c => c.id)) + 1 : 1;
    this.circles.push(circle);
    this.circlesSubject.next([...this.circles]);
  }

  updateCircle(id: number, updatedCircle: Circle) {
    const index = this.circles.findIndex(c => c.id === id);
    if (index !== -1) {
      this.circles[index] = { ...updatedCircle, id };
      this.circlesSubject.next([...this.circles]);
    }
  }

  deleteCircle(id: number) {
    this.circles = this.circles.filter(c => c.id !== id);
    this.circlesSubject.next([...this.circles]);
  }
}
