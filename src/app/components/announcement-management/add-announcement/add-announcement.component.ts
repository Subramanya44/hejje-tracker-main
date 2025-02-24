import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from 'src/app/services/announcement.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss'],
})
export class AddAnnouncementComponent implements OnInit {

  pageTitle: string = 'Announcement';
  addAnnouncementForm: FormGroup = new FormGroup({});
  id: number = 0;

  range_name = [
    { value: 'keyfalcon4', label: 'keyfalcon4' },
    { value: 'keyfalcon1', label: 'keyfalcon1' }
  ];

  section_name = [
    { value: 'keyfalcon4', label: 'keyfalcon4' },
    { value: 'keyfalcon1', label: 'keyfalcon1' }
  ];

  village_name = [
    { value: 'keyfalcon5', label: 'keyfalcon5' },
    { value: 'keyfalcon2', label: 'keyfalcon2' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private announcementService: AnnouncementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
  }

  initForm() {
    this.addAnnouncementForm = this.formBuilder.group({
      announcement_date: ['', Validators.required],
      timeFieldsArray: this.formBuilder.array([]),  // Correctly defined FormArray
      range_name: ['', Validators.required],
      section_name: ['', Validators.required],
      village_name: ['', Validators.required]
    });
  }

  // Getter for time fields array
  get timeFieldsArray(): FormArray {
    return this.addAnnouncementForm.get('timeFieldsArray') as FormArray;
  }

  // Add new time field
  addTimeField() {
    if (this.timeFieldsArray.length < 2) {
      this.timeFieldsArray.push(this.formBuilder.control('', Validators.required));
    }
  }

  // Remove time field
  removeTimeField(index: number) {
    this.timeFieldsArray.removeAt(index);
  }

  // Form submission
  onSubmit() {
    console.log('Form Valid:', this.addAnnouncementForm.valid);
    console.log('Form Values:', this.addAnnouncementForm.value);
  
    if (this.addAnnouncementForm.invalid) {
      return;
    }
  
    if (this.id) {
      this.announcementService.updateAnnoucement(this.id, this.addAnnouncementForm.value);
    } else {
      this.announcementService.addAnnoucement(this.addAnnouncementForm.value);
    }
  
    this.router.navigate(['/announcement-management/list-announcement/']);
  }  

  // Handle route parameters
  handleRoute() {
    this.route.paramMap.subscribe(params => {
      console.log(params);
      const idParam = params.get('id');
      this.id = idParam ? parseInt(idParam, 10) : 0;
  
      if (this.id) {
        this.pageTitle = 'Edit Announcement';
        this.loadAnnouncemnentData(this.id);
      } else {
        this.pageTitle = 'Add Announcement';
        this.initForm();
      }
    });
  }  

  loadAnnouncemnentData(announcementId: number) {
    const announcements = this.announcementService.getAnnoucement();
    const selectedAnnouncement = announcements.find(announcement => announcement.id === announcementId);
  
    if (selectedAnnouncement) {
      console.log(selectedAnnouncement);
  
      // Ensure the form is initialized before patching values
      if (!this.addAnnouncementForm) {
        this.initForm();
      }
  
      // Patch basic form values (excluding timeFieldsArray)
      this.addAnnouncementForm.patchValue({
        announcement_date: selectedAnnouncement.announcement_date,
        range_name: selectedAnnouncement.range_name,
        section_name: selectedAnnouncement.section_name,
        village_name: selectedAnnouncement.village_name
      });
  
      // Clear existing time fields to avoid duplicates
      this.timeFieldsArray.clear();
  
      // Patch time fields properly into the FormArray
      if (selectedAnnouncement.timeFieldsArray && Array.isArray(selectedAnnouncement.timeFieldsArray)) {
        selectedAnnouncement.timeFieldsArray.forEach(time => {
          this.timeFieldsArray.push(this.formBuilder.control(time, Validators.required));
        });
      }
    }
  }
  
  // Cancel and navigate back
  cancel() {
    this.router.navigate(['/announcement-management/list-announcement/']);
  }
}
