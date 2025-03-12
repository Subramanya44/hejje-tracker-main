import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TrackService } from "../../../services/track.service";
import { AlertController } from '@ionic/angular';
import { UserRole } from 'src/app/models/profile';
import { ActivatedRoute , Router } from '@angular/router';
import { MapService } from 'src/app/services/map/map.service';
import { LandmarksService } from 'src/app/services/landmarks.service';
import { ElephantService } from 'src/app/services/elephant.service';
import { ELEPHANT } from 'src/app/models/elephant';


@Component({
  selector: 'app-add-track',
  templateUrl: './add-track.component.html',
  styleUrls: ['./add-track.component.css'],
})
export class AddTrackComponent implements OnInit {

  range_name = [
    { value: 'BELURU', label: 'BELURU' },
    { value: 'YESLURU', label: 'YESLURU' },
    { value: 'ALURU', label: 'ALURU' },
    { value: 'SAKALESHAPURA', label: 'SAKALESHAPURA' }
  ];

  division_name = [
    { value: 'division name 1', label: 'division name 1' },
    { value: 'division name 2', label: 'division name 2' }
  ];

  circle_name = [
    { value: 'circle name 1', label: 'circle name 1' },
    { value: 'circle name 2', label: 'circle name 2' }
  ];

  trackForm: FormGroup = new FormGroup({});
  previewImages: { url: string, file?: File }[] = [];
  uploadedImageUrls: string[] = [];
  id?: number = 0;
  startDate: string = '';
  suggestedElephants: ELEPHANT[] = [];


  suggestions: string[] = [];
  filteredSuggestions: string[] = [];
  searchQuery: string = '';
  showSuggestions: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private trackService: TrackService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private landmarksService: LandmarksService,
    private elephentService: ElephantService,
    private router: Router
  ) {
    
    this.filteredSuggestions = this.suggestions;
  }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
    this.subscribeToValueChanges();
    this.loadLandmarks();
    this.loadElephants();
  }

  handleRoute() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length && urlSegments[urlSegments.length - 1].path === 'new') {
        // If route ends with 'new', show an empty form
        this.resetForm();
      } else {
        // If route ends with a number, fetch data based on that number
        const trackId = +urlSegments[urlSegments.length - 1].path;
        if (!isNaN(trackId) && trackId > 0) {
          this.id = trackId;
          this.fetchTrackData(trackId);
        } else {
          // Invalid route
          console.error('Invalid route');
        }
      }
    });
  }

  initForm() {
    this.previewImages = [];
    this.trackForm = this.formBuilder.group({
      // created_at: [new Date().toISOString()],
      latitude: [0.0, [
        Validators.required,
        Validators.maxLength(32),
        Validators.min(11.5), // Minimum latitude for Karnataka
        Validators.max(18.3), // Maximum latitude for Karnataka
        Validators.pattern(/\-?\d*\.?\d{1,2}/)
      ],],
      longitude: [0.0, [
        Validators.maxLength(32),
        Validators.min(74.05), // Minimum longitude for Karnataka
        Validators.max(78.62), // Maximum longitude for Karnataka
        Validators.pattern(/\-?\d*\.?\d{1,2}/)
      ]],
      user_id: [''],
      animal_type: ['ELEPHANT', Validators.required],
      herd_size: [0, [Validators.required, Validators.min(1)]],
      male_count: [0, Validators.required],
      female_count: [0, Validators.required],
      calf_count: [0],
      stationary: [true],
      location: ['', [Validators.required, Validators.minLength(5)]],
      file: [['']],
      media: [['']],
      status: [''],
      sighting_time: [this.getCurrentDateTime(), Validators.required],
      district: [''],
      taluk: [''],
      village: [''],
      circle_name:[],
      division_name:[],
      range_name:[],
      elephants: [[]]
    });
  }

  async fetchTrackData(trackId: number) {
    try {
      const trackData = await this.trackService.getTrackById(trackId);

      // preview images
      if (trackData.media) {
        trackData.media.forEach((mediaUrl: string) => {
          this.previewImages.push({ url: mediaUrl});
        })
      }

      this.trackForm.patchValue(trackData);
    } catch (error) {
      console.error('Error fetching track data:', error);
    }
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

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
  }

  subscribeToValueChanges() {
    ['male_count', 'female_count', 'calf_count'].forEach(controlName => {
      this.trackForm.get(controlName)?.valueChanges.subscribe(() => {
        this.updateHerdSize();
      });
    });
  }

  async onSubmit() {
    try {

      if (this.id !== null && this.id !== undefined && this.id !== 0) {
        // Update existing track
        const { file, ...formValueWithoutFile } = this.trackForm.value;
        const updatedData = await this.trackService.insertTrack(formValueWithoutFile, this.id);
        // Upload images after successful update
        //@ts-ignore
        await this.uploadImage(this.id); // Assuming `updatedData.id` contains the ID of the updated track
        this.showAlert('Success', 'Data updated successfully');
        this.fetchTrackData(this.id);

      } else {
        // const formData = this.trackForm.value;
        const { file, ...formValueWithoutFile } = this.trackForm.value;
        const insertedData = await this.trackService.insertTrack(formValueWithoutFile, undefined);
        // Upload images after successful insertion
        //@ts-ignore
        await this.uploadImage(insertedData[0].id); // Assuming `insertedData.id` contains the ID of the inserted track
        this.resetForm();
        this.showAlert('Success', 'Data inserted successfully');
      }

    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }

  async showAlert(title: string, msg: string) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();

  }

  async uploadImage(id: string) {
    try {
      if (this.previewImages.length === 0) {
        // No images to upload
        return;
      }


      // Loop through each image in the previewImages array and upload them
      for (const { file, url } of this.previewImages) {
        if(file != null && file != undefined){
          const uploadedImageUrl = await this.trackService?.uploadImage(id, file!); // Assuming you have a method in `trackService` to upload an image
          this.uploadedImageUrls.push(uploadedImageUrl);
        } else {
          this.uploadedImageUrls.push(url);
        }
      }

      // Once all images are uploaded, add their URLs to the media form control
      this.trackForm.get('media')?.setValue(this.uploadedImageUrls);

      // Clear the previewImages array after successful upload
      this.previewImages = [];

      // await loader.dismiss(); // Hide loader after uploading

      // update the data
        //@ts-ignore
        await this.trackService.updateTrackMedia(id, this.uploadedImageUrls);

    } catch (error) {
      console.error('Error uploading images:', error);
      // await loader.dismiss(); // Ensure loader is dismissed in case of an error
    }
  }


  updateHerdSize() {
    const maleCount = this.trackForm.get('male_count')!.value;
    const femaleCount = this.trackForm.get('female_count')!.value;
    const calfCount = this.trackForm.get('calf_count')!.value;
    const herdSize = maleCount + femaleCount + calfCount;
    this.trackForm.get('herd_size')!.setValue(herdSize);
  }

  incrementDecrementCount(controlName: string, increment: boolean) {
    const count = this.trackForm.get(controlName);
    if (count) {
      const currentValue = count.value;
      const newValue = increment ? currentValue + 1 : Math.max(currentValue - 1, 0);
      count.setValue(newValue);
    }
}


  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.trackForm.patchValue({ latitude, longitude });

          this.trackService.getAddressFromCoordinates(latitude, longitude)
            .then((data: any) => {
              // const { district, taluk, village } = data.address;
              const district = data.address.state_district;
              const taluk = data.address.taluk;
              const village = data.address.village;
              this.trackForm.get("district")?.setValue(district);
              this.trackForm.get("taluk")?.setValue(taluk);
              this.trackForm.get("village")?.setValue(village);
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

  isMediaVisible(): boolean {
    const profile_role = localStorage.getItem('profile_role');

    // if UserRole.DEPARTMENT_ADMIN || UserRole.SUPER_ADMIN then return true else flasee
    if (profile_role == UserRole.DEPARTMENT_ADMIN || profile_role == UserRole.SUPER_ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  resetForm() {
    this.trackForm.reset();
    this.previewImages = [];
  }


  getCurrentDateTime(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = this.formatNumber(today.getMonth() + 1);
    const day = this.formatNumber(today.getDate());
    const hours = this.formatNumber(today.getHours());
    const minutes = this.formatNumber(today.getMinutes());
    const seconds = this.formatNumber(today.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private formatNumber(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  onInputChange(event: any): void {
    const value = event.target.value.toLowerCase();
    this.filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value)
    );
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  selectSuggestion(suggestion: string): void {
    this.trackForm.get('location')?.setValue(suggestion);
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

  isInputFocused(): boolean {
    const activeElement = document.activeElement;
    //@ts-ignore
    return activeElement === this.trackForm.get('location').nativeElement;
  }

  loadLandmarks(): void {
    this.landmarksService.fetchLandmarks().then((landmarks: any[]) => {
      this.suggestions = landmarks.map(landmark => landmark.name);
      this.filteredSuggestions = this.suggestions;
    });
  }

  loadElephants(): void {
    this.elephentService.fetchAllElephants().then((elephants: any[]) => {
      this.suggestedElephants = elephants;
    });
  }

  goBack() {
    this.router.navigate(['/track/my-tracks']);
  }
  
}
