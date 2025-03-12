import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SectionService } from 'src/app/services/section.service';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss'],
})
export class AddSectionComponent  implements OnInit {

    pageTitle: string = 'Section'; 
    submitButtonText: string = 'Add_DIVISION.DIVISION_ADD';
    addSectionForm: FormGroup = new FormGroup({});
    id: number = 0;

    range_name = [
      { value: 'BELURU', label: 'BELURU' },
      { value: 'YESLURU', label: 'YESLURU' },
      { value: 'ALURU', label: 'ALURU' },
      { value: 'SAKALESHAPURA', label: 'SAKALESHAPURA' }
    ];

    division_name = [
      { value: 'keyfalcon4', label: 'keyfalcon4' },
      { value: 'keyfalcon1', label: 'keyfalcon1' }
    ];
  
    circle_name = [
      { value: 'keyfalcon5', label: 'keyfalcon5' },
      { value: 'keyfalcon2', label: 'keyfalcon2' }
    ];
  
    organizations = [
      { value: 'keyfalcon6', label: 'keyfalcon6' },
      { value: 'keyfalcon3', label: 'keyfalcon3' }
    ];
  
    constructor(private formBuilder:FormBuilder,private router:Router, private sectionService: SectionService, private route: ActivatedRoute) { }
  
    ngOnInit() {
      this.handleRoute();
      this.initForm();
    }
  
    initForm() {
      this.addSectionForm = this.formBuilder.group({
        // created_at: [new Date().toISOString()],
        section_name: ['', [Validators.required, Validators.minLength(3)]],
        range_name: [''],
        division_name: [''],
        circle_name: [''],
        organization: [['']]
      });
    }
  
    onSubmit() {
      if (this.id) {
        this.sectionService.updateSections(this.id, this.addSectionForm.value);
      } else {
        this.sectionService.addSections(this.addSectionForm.value);
      }
      
      this.router.navigate(['/role-management/list-section/']);
    }
  
    handleRoute() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.id = +id; 
          this.pageTitle = 'Edit Section';
          this.submitButtonText = 'Add_DIVISION.DIVISION_UPDATE';
          this.loadSectionData(this.id);
        } else {
          this.pageTitle = 'Add Section';
          this.submitButtonText = 'Add_DIVISION.DIVISION_ADD';
          this.addSectionForm.reset();
        }
      });
    }
  
    loadSectionData(sectionId: number) {
      const sections = this.sectionService.getSections();
      const selectedSection = sections.find(section => section.id === sectionId);
    console.log(selectedSection);
      if (selectedSection) {
        setTimeout(() => {
          this.addSectionForm.patchValue({
            section_name: selectedSection.section_name,
            range_name: selectedSection.range_name,
            division_name: selectedSection.division_name,
            circle_name: selectedSection.circle_name,
            organization: selectedSection.organization
          });
        });
      }
    }
  
    cancel() {
      this.router.navigate(['/role-management/list-section/']);
    }

    goBack() {
      this.router.navigate(['/role-management/list-section/']);
    }
}
