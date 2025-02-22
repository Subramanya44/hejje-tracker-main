import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CircleDashboardComponent } from './circle-dashboard.component';

describe('CircleDashboardComponent', () => {
   let component: CircleDashboardComponent;
    let fixture: ComponentFixture<CircleDashboardComponent>;
  
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ CircleDashboardComponent ],
        imports: [IonicModule.forRoot()]
      }).compileComponents();
  
      fixture = TestBed.createComponent(CircleDashboardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
