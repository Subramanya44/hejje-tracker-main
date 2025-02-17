import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UserRole } from 'src/app/models/profile';
import { ComplaintsService } from 'src/app/services/complaints.service';
import { TrackService } from 'src/app/services/track.service';

@Component({
  selector: 'app-add-complaints',
  templateUrl: './add-complaints.component.html',
  styleUrls: ['./add-complaints.component.scss'],
})
export class AddComplaintsComponent  implements OnInit {

  addComplaintsForm: FormGroup=  new FormGroup({});
  previewImages: { url: string, file?: File }[] = [];

  suggestions: string[] = [];
  filteredSuggestions: string[] = [];
  searchQuery: string = '';
  showSuggestions: boolean = false;

  constructor(private trackService:TrackService, private formbuilder:FormBuilder,
              private complaintsService:ComplaintsService,
              private alertcont:AlertController,
              private translateService:TranslateService) { }

  ngOnInit() {
    this.initForm();
  }

  onSuccess() {
    const title = this.translateService.instant('SUCCESS');
    const message = this.translateService.instant('COMPLAINTS_MANAGEMENT.COMPLAINT_ADDED_SUCCESSFULLY');
    this.addComplaintsForm.reset();
    this.alertcont.create({
      header: 'Success',
      message: 'Complaint added successfully',
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  initForm() {
    this.previewImages = [];
    this.addComplaintsForm = this.formbuilder.group({
      // created_at: [new Date().toISOString()],
      latitude: [0.0, [
        Validators.required,
        Validators.maxLength(32),
        // Validators.min(11.5), // Minimum latitude for Karnataka
        // Validators.max(18.3), // Maximum latitude for Karnataka
        Validators.pattern(/\-?\d*\.?\d{1,2}/)
      ],],
      longitude: [0.0, [
        Validators.maxLength(32),
        // Validators.min(74.05), // Minimum longitude for Karnataka
        // Validators.max(78.62), // Maximum longitude for Karnataka
        Validators.pattern(/\-?\d*\.?\d{1,2}/)
      ]],
      complaint_type: ['', ],
 
      
      location: ['', [Validators.required, Validators.minLength(5)]],
      // file: [['']],
      media: [['']],
      status: [''],

      district: [''],
      taluk: [''],
      village: [''],
      name: ['', Validators.required],
      contact_number: ['', Validators.required,Validators.maxLength(10)],
      description: ['', Validators.required],
    });
  }


  onSubmit() {
    console.log(this.addComplaintsForm.value);
    this.complaintsService.insterComplaint(this.addComplaintsForm.value).then((data)=>{
      this.onSuccess();
    }).catch((error)=>{
      console.log(error);
    });
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push({ url: e.target.result, file: files[i] });
        };
        reader.readAsDataURL(files[i]);
      }

      // Set the selected files to the form control
      // this.trackForm.get('media')?.setValue(files);
    }
  }

  isMediaVisible(): boolean {
    // const profile_role = localStorage.getItem('profile_role');

    // // if UserRole.DEPARTMENT_ADMIN || UserRole.SUPER_ADMIN then return true else flasee
    // if (profile_role == UserRole.DEPARTMENT_ADMIN || profile_role == UserRole.SUPER_ADMIN) {
    //   return true;
    // } else {
    //   return false;
    // }
    return false;
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.addComplaintsForm.patchValue({ latitude, longitude });

          this.trackService.getAddressFromCoordinates(latitude, longitude)
            .then((data: any) => {
              // const { district, taluk, village } = data.address;
              const district = data.address.state_district;
              const taluk = data.address.taluk;
              const village = data.address.village;
              this.addComplaintsForm.get("district")?.setValue(district);
              this.addComplaintsForm.get("taluk")?.setValue(taluk);
              this.addComplaintsForm.get("village")?.setValue(village);
            })
            .catch((error: any) => {
              console.error('Error getting address from coordinates', error);
            });
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  onInputChange(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value)
    );
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  selectSuggestion(suggestion: string): void {
    this.addComplaintsForm.get('location')?.setValue(suggestion);
    this.showSuggestions = false;
  }

  onInputBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200); // Delay is added to allow click events on suggestions before hiding
  }

  onInputFocus(): void {
    this.showSuggestions = true;
  }

  

}

export function indianMobileNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^[6789]\d{9}$/.test(control.value);
    return valid ? null : { invalidMobileNumber: { value: control.value } };
  };
}