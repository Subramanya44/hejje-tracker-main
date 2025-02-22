import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddCircleComponent } from './add-circle.component';

describe('AddCircleComponent', () => {
   let component: AddCircleComponent;
    let fixture: ComponentFixture<AddCircleComponent>;
  
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ AddCircleComponent ],
        imports: [IonicModule.forRoot()]
      }).compileComponents();
  
      fixture = TestBed.createComponent(AddCircleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
});
