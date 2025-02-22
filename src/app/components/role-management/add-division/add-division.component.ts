import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DivisionService } from 'src/app/services/division.service';

@Component({
  selector: 'app-add-division',
  templateUrl: './add-division.component.html',
  styleUrls: ['./add-division.component.scss'],
})
export class AddDivisionComponent  implements OnInit {
  pageTitle: string = 'Division'; 
  addDivisionForm: FormGroup = new FormGroup({});
    id: number = 0;
    names = [
      { value: 'keyfalcon5', label: 'keyfalcon5' },
      { value: 'keyfalcon2', label: 'keyfalcon2' }
    ];

    organizations = [
      { value: 'keyfalcon6', label: 'keyfalcon6' },
      { value: 'keyfalcon3', label: 'keyfalcon3' }
    ];

    constructor(private formBuilder:FormBuilder,private router:Router, private divisionService: DivisionService, private route: ActivatedRoute) { }
  
    ngOnInit() {
      this.handleRoute();
      this.initForm();
    }
  
    initForm() {
      this.addDivisionForm = this.formBuilder.group({
        // created_at: [new Date().toISOString()],
        division_name: ['', [Validators.required, Validators.minLength(3)]],
        circle_name: [''],
        organization: [['']]
      });
    }
  
    onSubmit() {
      if (this.id) {
        this.divisionService.updateDivision(this.id, this.addDivisionForm.value);
      } else {
        this.divisionService.addDivision(this.addDivisionForm.value);
      }
      
      this.router.navigate(['/role-management/list-division/']);
    }
  
    handleRoute() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.id = +id; 
          this.pageTitle = 'Edit Circle';
          this.loadDivisionData(this.id);
        } else {
          this.pageTitle = 'Add Circle';
          this.addDivisionForm.reset();
        }
      });
    }

    loadDivisionData(divisionId: number) {
      const divisions = this.divisionService.getDivisions();
      const selectedDivision = divisions.find(division => division.id === divisionId);
    
      if (selectedDivision) {
        setTimeout(() => {
          this.addDivisionForm.patchValue({
            division_name: selectedDivision.division_name,
            circle_name: selectedDivision.circle_name,
            organization: selectedDivision.organization
          });
        });
      }
    }

    cancel() {
      this.router.navigate(['/role-management/list-division/']);
    }
}
