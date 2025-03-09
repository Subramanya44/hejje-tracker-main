import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VillageService } from 'src/app/services/village.service';

@Component({
  selector: 'app-add-village',
  templateUrl: './add-village.component.html',
  styleUrls: ['./add-village.component.scss'],
})
export class AddVillageComponent  implements OnInit {

     pageTitle: string = 'Village'; 
     addVillageForm: FormGroup = new FormGroup({});
     id: number = 0;
 
     range_name = [
        { value: 'BELURU', label: 'BELURU' },
        { value: 'YESLURU', label: 'YESLURU' },
        { value: 'ALURU', label: 'ALURU' },
        { value: 'SAKALESHAPURA', label: 'SAKALESHAPURA' }
      ];
    
      section_name = [
        { value: 'BIKKODU', label: 'BIKKODU' },
        { value: 'HETHURU', label: 'HETHURU' },
        { value: 'K. HOSAKOTE', label: 'K. HOSAKOTE' },
        { value: 'BELAGODU', label: 'BELAGODU' }
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
   
     constructor(private formBuilder:FormBuilder,private router:Router, private villageService: VillageService, private route: ActivatedRoute) { }
   
     ngOnInit() {
       this.handleRoute();
       this.initForm();
     }
   
     initForm() {
       this.addVillageForm = this.formBuilder.group({
         // created_at: [new Date().toISOString()],
         village_name: ['', [Validators.required, Validators.minLength(3)]],
         section_name: [''],
         range_name: [''],
         division_name: [''],
         circle_name: [''],
         organization: [['']]
       });
     }
   
     onSubmit() {
       if (this.id) {
         this.villageService.updateVillages(this.id, this.addVillageForm.value);
       } else {
         this.villageService.addVillages(this.addVillageForm.value);
       }
       
       this.router.navigate(['/role-management/list-village/']);
     }
   
     handleRoute() {
       this.route.paramMap.subscribe(params => {
         const id = params.get('id');
         if (id) {
           this.id = +id; 
           this.pageTitle = 'Edit Village';
           this.loadVillageData(this.id);
         } else {
           this.pageTitle = 'Add Village';
           this.addVillageForm.reset();
         }
       });
     }
   
     loadVillageData(villageId: number) {
       const villages = this.villageService.getVillages();
       const selectedVillage = villages.find(village => village.id === villageId);
       if (selectedVillage) {
         setTimeout(() => {
           this.addVillageForm.patchValue({
             village_name: selectedVillage.village_name,
             section_name: selectedVillage.section_name,
             range_name: selectedVillage.range_name,
             division_name: selectedVillage.division_name,
             circle_name: selectedVillage.circle_name,
             organization: selectedVillage.organization
           });
         });
       }
     }
   
     cancel() {
       this.router.navigate(['/role-management/list-village/']);
     }
 
     goBack() {
      this.router.navigate(['/role-management/list-village/']);
    }
}
