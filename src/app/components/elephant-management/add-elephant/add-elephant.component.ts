import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput } from '@ionic/angular';
import { UserRole } from 'src/app/models/profile';
import { ElephantService } from 'src/app/services/elephant.service';
import { ModalController } from '@ionic/angular';
import { ImageSliderComponent } from '../../image-slider/image-slider.component';

@Component({
  selector: 'app-add-elephant',
  templateUrl: './add-elephant.component.html',
  styleUrls: ['./add-elephant.component.scss'],
})
export class AddElephantComponent  implements OnInit {
  addElephantForm: FormGroup = new FormGroup({});
  previewImagesMedia: { url: string, file?: File }[] = [];
  previewImagesProfile: { [key: string]: { url: string, file?: File }[] } = {
    frontView: [],
    rearView: [],
    rightView: [],
    leftView: []
  };
  id?: number = 0;
  uploadedImageUrls: string[] = [];
  division_name = [
    { value: 'division name 1', label: 'division name 1' },
    { value: 'division name 2', label: 'division name 2' }
  ];

  circle_name = [
    { value: 'circle name 1', label: 'circle name 1' },
    { value: 'circle name 2', label: 'circle name 2' }
  ];

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private elephantService: ElephantService,
    private route: ActivatedRoute,
    private router:Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
  }

  async removeImageMedia(index: number, fileInputPromise: Promise<HTMLInputElement>) {
    // Get the native <input> element
    const nativeInput = await fileInputPromise;
  
    // Remove the image from the previewImagesMedia array
    this.previewImagesMedia.splice(index, 1);
  
    // Update the file input field's value
    if (nativeInput && nativeInput.files) {
      const files = Array.from(nativeInput.files); // Convert FileList to an array
      files.splice(index, 1); // Remove the file at the specified index
  
      // Create a new FileList and assign it to the file input
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      nativeInput.files = dataTransfer.files;
    }
  }

  async removeImageProfile(view: string, index: number, fileInputPromise: Promise<HTMLInputElement>) {
    // Get the native <input> element
    const nativeInput = await fileInputPromise;
  
    // Remove the image from the previewImagesProfile array
    this.previewImagesProfile[view].splice(index, 1);
  
    // Update the file input field's value
    if (nativeInput && nativeInput.files) {
      const files = Array.from(nativeInput.files); // Convert FileList to an array
      files.splice(index, 1); // Remove the file at the specified index
  
      // Create a new FileList and assign it to the file input
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      nativeInput.files = dataTransfer.files;
    }
  }
 
  onFileChangeMedia(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImagesMedia.push({ url: e.target.result, file: files[i] });
        };
        reader.readAsDataURL(files[i]);
      }

      // Set the selected files to the form control
      // this.trackForm.get('media')?.setValue(files);
    }
  }

  onFileChangeProfile(event: any, view: string) {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImagesProfile[view].push({ url: e.target.result, file: files[i] });
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  initForm() {
    this.previewImagesMedia = [];
    this.previewImagesProfile = {
      frontView: [],
      rearView: [],
      rightView: [],
      leftView: []
    };
    this.addElephantForm = this.formBuilder.group({
      // created_at: [new Date().toISOString()],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      file: [['']],
      media_attachments: [[]],
      circle_name: [''],
      division_name: [''],
      frontViewComment: [''],
      rearViewComment: [''],
      rightViewComment: [''],
      leftViewComment: ['']
    });
  }

  async openImageSlider(view: string, index: number) {
    const images = this.previewImagesProfile[view]; // Get images from selected profile section
  
    const modal = await this.modalController.create({
      component: ImageSliderComponent,
      componentProps: {
        images: images,
        currentIndex: index
      },
      cssClass: 'full-screen-modal'
    });
  
    await modal.present();
  }

  handleRoute() {
    this.route.url.subscribe(urlSegments => {
      if (urlSegments.length && urlSegments[urlSegments.length - 1].path === 'add') {
        // If route ends with 'new', show an empty form
        this.addElephantForm.reset();
      } else {
        // If route ends with a number, fetch data based on that number
        const id = +urlSegments[urlSegments.length - 1].path;
        this.id = id;
        this.fetchElephantData(id);
      }
    });
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

  async onSubmit() {
    try {

      if (this.id !== null && this.id !== undefined && this.id !== 0) {
      
        // Update existing elephant
        const { file, ...formValueWithoutFile } = this.addElephantForm.value;
    
        const updatedData = await this.elephantService.insertElephant(formValueWithoutFile, this.id);

        // Upload images after successful update
        //@ts-ignore
        await this.uploadImage(this.id); // Assuming `updatedData.id` contains the ID of the updated track

        const updatedData2 = await this.elephantService.insertElephant(formValueWithoutFile, this.id)


        this.showAlert('Success', 'Data updated successfully');

        this.fetchElephantData(this.id);

      } else {
        // Insert new elephant
        // const formData = this.trackForm.value;
        const { file, ...formValueWithoutFile } = this.addElephantForm.value;
        const insertedData = await this.elephantService.insertElephant(formValueWithoutFile, undefined);
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


  async uploadImage(id: string) {
    try {
      if (this.previewImagesMedia.length === 0) {
        // No images to upload
        this.uploadedImageUrls = [];
        await this.elephantService.updateElephantMedia(Number(id), this.uploadedImageUrls);
        return;
      }
      // Upload media images

      // Loop through each image in the previewImages array and upload them

      for (const { file, url } of this.previewImagesMedia) {
        if (file != null && file != undefined) {
          const uploadedImageUrl = await this.elephantService.uploadImage(id, file);
          this.uploadedImageUrls.push(uploadedImageUrl);
        } else {
          this.uploadedImageUrls.push(url);
        }
      }
  
      // Upload profile images
      for (const view of Object.keys(this.previewImagesProfile)) {
        for (const { file, url } of this.previewImagesProfile[view]) {
          if (file != null && file != undefined) {
            const uploadedImageUrl = await this.elephantService.uploadImage(id, file);
            this.uploadedImageUrls.push(uploadedImageUrl);
          } else {
            this.uploadedImageUrls.push(url);
          }
        }
      }
  
      // Update form control with uploaded image URLs
      this.addElephantForm.get('media_attachments')?.setValue(this.uploadedImageUrls);
  
      // Clear preview images after upload
      this.previewImagesMedia = [];
      this.previewImagesProfile = {
        frontView: [],
        rearView: [],
        rightView: [],
        leftView: []
      };
  
      // Update elephant media in the database
        await this.elephantService.updateElephantMedia(Number(id), this.uploadedImageUrls);
  
    } catch (error) {
      console.error('Error uploading images:', error);
      // await loader.dismiss(); // Ensure loader is dismissed in case of an error
    }
  }

  resetForm() {
    this.addElephantForm.reset();
    this.previewImagesMedia = [];
    this.previewImagesProfile = {
      frontView: [],
      rearView: [],
      rightView: [],
      leftView: []
    };
    this.uploadedImageUrls = [];
  }

  async fetchElephantData(elephantId: number) {
    try {
      const elephantData = await this.elephantService.getElephantById(elephantId);
      // preview images
      if (elephantData.media_attachments) {
        elephantData.media_attachments.forEach((mediaUrl: string) => {
          // Assuming mediaUrl contains the view information, e.g., 'frontView_url1', 'rearView_url2', etc.
          const view = mediaUrl.split('_')[0];
          if (view in this.previewImagesProfile) {
            this.previewImagesProfile[view].push({ url: mediaUrl });
          } else {
            this.previewImagesMedia.push({ url: mediaUrl });
          }
        });
      }
      this.addElephantForm.patchValue(elephantData);
    } catch (error) {
      console.error('Error fetching elephant data:', error);
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

  cancel() {
    this.router.navigate(['/elephant-management']);
  }

}
