import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CirclesService } from 'src/app/services/circle.service';

@Component({
  selector: 'app-add-circle',
  templateUrl: './add-circle.component.html',
  styleUrls: ['./add-circle.component.scss'],
})
export class AddCircleComponent  implements OnInit {
  pageTitle: string = 'Circle'; 
  addCircleForm: FormGroup = new FormGroup({});
    id: number = 0;
    organizations = [
      { value: 'keyfalcon', label: 'keyfalcon' },
      { value: 'keyfalcon2', label: 'keyfalcon2' }
    ];
  
  
    constructor(private formBuilder:FormBuilder,private router:Router, private circlesService: CirclesService, private route: ActivatedRoute) { }
  
    ngOnInit() {
      this.initForm();
      this.handleRoute();
    }
  
    initForm() {
      this.addCircleForm = this.formBuilder.group({
        circle_name: ['', [Validators.required, Validators.minLength(3)]],
        organization: [''],
      });    
    }
  
    onSubmit() {
      if (this.id) {
        this.circlesService.updateCircle(this.id, this.addCircleForm.value);
      } else {
        this.circlesService.addCircle(this.addCircleForm.value);
      }
      
      this.router.navigate(['/role-management/list-circle/']);
    }

    handleRoute() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.id = +id; 
          this.pageTitle = 'Edit Circle';
          this.loadCircleData(this.id);
        } else {
          this.pageTitle = 'Add Circle';
          this.addCircleForm.reset();
        }
      });
    }

    loadCircleData(circleId: number) {
      const circles = this.circlesService.getCircles();
      const selectedCircle = circles.find(circle => circle.id === circleId);
    
      if (selectedCircle) {
        this.addCircleForm.patchValue({
          circle_name: selectedCircle.circle_name,
          organization: selectedCircle.organization
        });
      }
    }
    
    

    cancel() {
      this.router.navigate(['/role-management/list-circle/']);
    }
}
