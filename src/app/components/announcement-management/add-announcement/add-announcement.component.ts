import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Announcement } from 'src/app/models/announcement';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrls: ['./add-announcement.component.scss'],
})
export class AddAnnouncementComponent implements OnInit {

  pageTitle: string = 'Announcement';
  submitButtonText: string = 'Add_DIVISION.DIVISION_ADD';
  addAnnouncementForm: FormGroup = new FormGroup({});
  id: number = 0;

  suggestions: string[] = [];
  filteredSuggestions: string[] = [];
  searchQuery: string = '';
  showSuggestions: boolean = false;
  complaintsList: any[] = []; // Store complaints data

  // division_name = [
  //   { value: 'division name 1', label: 'division name 1' },
  //   { value: 'division name 2', label: 'division name 2' }
  // ];

  // circle_name = [
  //   { value: 'circle name 1', label: 'circle name 1' },
  //   { value: 'circle name 2', label: 'circle name 2' }
  // ];

  circle_name: { value: string; label: string }[] = [];
  division_name: { value: string; label: string }[] = [];
  range_name: { value: string; label: string }[] = [];
  section_name: { value: string; label: string }[] = [];
  village_name: { value: string; label: string }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
    this.getComplaintsidname(); // Fetch complaints data
    this.loadDropdownData();
  }

  // Add this new method to load dropdown data
  loadDropdownData() {
    // Load circles
    this.commonService.getCircles().then(circles => {
      this.circle_name = circles.map(circle => ({
        value: circle.circle_name,
        label: circle.circle_name
      }));
    }).catch(error => {
      console.error('Error loading circles:', error);
    });

    // Load divisions
    this.commonService.getDivisions().then(divisions => {
      this.division_name = divisions.map(division => ({
        value: division.division_name,
        label: division.division_name
      }));
    }).catch(error => {
      console.error('Error loading divisions:', error);
    });

    // Load ranges
    this.commonService.getRanges().then(ranges => {
      this.range_name = ranges.map(range => ({
        value: range.range_name,
        label: range.range_name
      }));
    }).catch(error => {
      console.error('Error loading ranges:', error);
    });

    // Load sections
    this.commonService.getSections().then(sections => {
      this.section_name = sections.map(section => ({
        value: section.section_name,
        label: section.section_name
      }));
    }).catch(error => {
      console.error('Error loading sections:', error);
    });

    // Load villages
    this.commonService.getVillages().then(villages => {
      this.village_name = villages.map(village => ({
        value: village.village_name,
        label: village.village_name
      }));
    }).catch(error => {
      console.error('Error loading villages:', error);
    });
  }

  initForm() {
    this.addAnnouncementForm = this.formBuilder.group({
      announcement_date: ['', Validators.required],
      timeFieldsArray: this.formBuilder.array([]),
      complaint_id: [[]],
      complaint_name: [[]],
      circle_name: [''],
      division_name: [''],
      range_name: [''],
      section_name: [''],
      village_name: [''],
      latitude: [0.0, [ ],],
      longitude: [0.0, [ ]],
      location: ['', []],
    });
  }

  // Fetch Complaint IDs & Names
  getComplaintsidname() {
    this.announcementService.getComplaintsidname().then((data: any) => {
      this.complaintsList = data; // Assign fetched data
    }).catch(error => {
      console.error("Error fetching complaints:", error);
    });
  }

  onInputChange(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value)
    );
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  selectSuggestion(suggestion: string): void {
    this.addAnnouncementForm.get('location')?.setValue(suggestion);
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

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.addAnnouncementForm.patchValue({ latitude, longitude });

          this.announcementService.getAddressFromCoordinates(latitude, longitude)
            .then((data: any) => {
              // const { district, taluk, village } = data.address;
              const district = data.address.state_district;
              const taluk = data.address.taluk;
              const village = data.address.village;
              this.addAnnouncementForm.get("district")?.setValue(district);
              this.addAnnouncementForm.get("taluk")?.setValue(taluk);
              this.addAnnouncementForm.get("village")?.setValue(village);
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

  createTimeField(): FormControl {
    return this.formBuilder.control('', Validators.required); // Default empty time field
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

  // Add this helper method to check if a value is selected
  isSelected(controlName: string, value: string): boolean {
    const control = this.addAnnouncementForm.get(controlName);
    if (!control || !control.value) return false;
    return control.value.includes(value);
  }

  // Form submission
  // Form submission
  onSubmit() {
    console.log('Form Valid:', this.addAnnouncementForm.valid);
    console.log('Form Values:', this.addAnnouncementForm.value);

    if (this.addAnnouncementForm.invalid) {
      return;
    }

    // Get the form values
    const formValues = this.addAnnouncementForm.value;

    // Prepare the announcement data
    const announcementData: Announcement = {
      announcement_date: formValues.announcement_date,
      announcement_time_am: formValues.timeFieldsArray?.[0] || null, // First time as AM
      announcement_time_pm: formValues.timeFieldsArray?.[1] || null, // Second time as PM
      circle_name: formValues.circle_name,
      division_name: formValues.division_name,
      range_name: formValues.range_name,
      section_name: formValues.section_name,
      village_name: formValues.village_name,
      latitude: formValues.latitude,
      longitude: formValues.longitude,
      location: formValues.location,
      complaint_id: formValues.complaint_id,
      complaint_name: formValues.complaint_name
    };

    if (this.id) {
      this.announcementService.updateAnnouncement(this.id, announcementData)
        .then(() => {
          this.router.navigate(['/announcement-management/list-announcement/']);
        })
        .catch(error => {
          console.error('Error updating announcement:', error);
        });
    } else {
      this.announcementService.addAnnouncement(announcementData)
        .then(() => {
          this.router.navigate(['/announcement-management/list-announcement/']);
        })
        .catch(error => {
          console.error('Error adding announcement:', error);
        });
    }
  }

  // Handle route parameters
  handleRoute() {
    this.route.paramMap.subscribe(params => {
      // console.log(params);
      const idParam = params.get('id');
      this.id = idParam ? parseInt(idParam, 10) : 0;

      if (this.id) {
        this.pageTitle = 'Edit Announcement';
        this.submitButtonText = 'Add_DIVISION.DIVISION_UPDATE';
        this.loadAnnouncementData(this.id);
      } else {
        this.pageTitle = 'Add Announcement';
        this.submitButtonText = 'Add_DIVISION.DIVISION_ADD';
        this.initForm();
      }
    });
  }

  loadAnnouncementData(announcementId: number) {
    this.announcementService.getAnnouncementById(announcementId)
      .then((announcement: any) => {
        if (announcement) {
          // Clear existing time fields
          while (this.timeFieldsArray.length) {
            this.timeFieldsArray.removeAt(0);
          }

          // Add time fields based on existing data
          if (announcement.announcement_time_am) {
            this.timeFieldsArray.push(this.formBuilder.control(announcement.announcement_time_am));
          }
          if (announcement.announcement_time_pm) {
            this.timeFieldsArray.push(this.formBuilder.control(announcement.announcement_time_pm));
          }

          // Patch other form values
          this.addAnnouncementForm.patchValue({
            announcement_date: announcement.announcement_date,
            circle_name: announcement.circle_name,
            division_name: announcement.division_name,
            range_name: announcement.range_name,
            section_name: announcement.section_name,
            village_name: announcement.village_name,
            latitude: announcement.latitude,
            longitude: announcement.longitude,
            location: announcement.location,
            complaint_id: announcement.complaint_id,
            complaint_name: announcement.complaint_name
          });
        }
      })
      .catch(error => {
        console.error('Error loading announcement data:', error);
      });
  }

  // Cancel and navigate back
  cancel() {
    this.router.navigate(['/announcement-management/list-announcement/']);
  }

  goBack() {
    this.router.navigate(['/announcement-management/list-announcement/']);
  }
}
