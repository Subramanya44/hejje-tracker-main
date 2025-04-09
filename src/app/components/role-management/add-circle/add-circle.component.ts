import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CirclesService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/models/circle';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-circle',
  templateUrl: './add-circle.component.html',
  styleUrls: ['./add-circle.component.scss'],
})
export class AddCircleComponent  implements OnInit {
  pageTitle: string = 'Circle'; 
  submitButtonText: string = 'Add_DIVISION.DIVISION_ADD';
  addCircleForm: FormGroup = new FormGroup({});
    id: number = 0;
    organizations: { org_id: number; organization_name: string }[] = []; // Store organizations

    // organizations = [
    //   { value: 'Karnataka Forest Department', label: 'Karnataka Forest Department' }
    // ];
  
  
    constructor(private formBuilder:FormBuilder,private router:Router, private circlesService: CirclesService, private route: ActivatedRoute, private commonService: CommonService) { }
  
    ngOnInit() {
      this.initForm();
      this.handleRoute();
      this.loadOrganizations();
    }

    async loadOrganizations() {
      this.organizations = await this.commonService.getOrganizations();
    }
  
    initForm() {
      this.addCircleForm = this.formBuilder.group({
        circle_name: ['', [Validators.required, Validators.minLength(3)]],
        organization: ['', Validators.required],
      });    
    }
  
    async onSubmit() {
      if (this.addCircleForm.invalid) return;
  
      const formData: Circle = {
          id: this.id,
          circle_name: this.addCircleForm.value.circle_name,
          // tbl_organizations: {
          //     organization_name: this.addCircleForm.value.organization // Send as an object
          // }
          tbl_organizations: {
            organization_name: this.organizations.find(org => org.org_id === this.addCircleForm.value.organization)
              ?.organization_name || '',
          },
      };
  
      if (this.id) {
          await this.circlesService.updateCircle(this.id, formData);
      } else {
          await this.circlesService.addCircle(formData);
      }
  
      this.router.navigate(['/role-management/list-circle/']);
    }  

    handleRoute() {
      this.route.paramMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.id = +id; 
          this.pageTitle = 'Edit Circle';
          this.submitButtonText = 'Add_DIVISION.DIVISION_UPDATE';
          this.loadCircleData(this.id);
        } else {
          this.pageTitle = 'Add Circle';
          this.submitButtonText = 'Add_DIVISION.DIVISION_ADD';
          this.addCircleForm.reset();
        }
      });
    }

    async loadCircleData(circleId: number) {
      // Ensure organizations are loaded first
      if (this.organizations.length === 0) {
        this.organizations = await this.commonService.getOrganizations(); // Fetch organizations if not loaded
      }
    
      const circles = await this.circlesService.getCircles();
      const selectedCircle = circles.find((circle: Circle) => circle.id === circleId);
    
      if (selectedCircle) {
        const selectedOrg = this.organizations.find(org => 
          org.organization_name.trim().toLowerCase() === selectedCircle.tbl_organizations?.organization_name.trim().toLowerCase()
        );
        
        this.addCircleForm.patchValue({
          circle_name: selectedCircle.circle_name,
          organization: selectedOrg?.org_id || null, // Use org_id if found, otherwise null
        });
      }
    }    
    
    cancel() {
      this.router.navigate(['/role-management/list-circle/']);
    }

    goBack() {
      this.router.navigate(['/role-management/list-circle/']);
    }
}
