import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserRole } from 'src/app/models/profile';
import { ElephantService } from 'src/app/services/elephant.service';

@Component({
  selector: 'app-add-elephant',
  templateUrl: './add-elephant.component.html',
  styleUrls: ['./add-elephant.component.scss'],
})
export class AddElephantComponent  implements OnInit {
  addElephantForm: FormGroup = new FormGroup({});
  previewImages: { url: string, file?: File }[] = [];
  id?: number = 0;
  uploadedImageUrls: string[] = [];

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private elephantService: ElephantService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.handleRoute();
    this.initForm();
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

  initForm() {
    this.previewImages = [];
    this.addElephantForm = this.formBuilder.group({
      // created_at: [new Date().toISOString()],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      file: [['']],
      media_attachments: [[]],
    });
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
      
        // Update existing track
        const { file, ...formValueWithoutFile } = this.addElephantForm.value;
    
        const updatedData = await this.elephantService.insertElephant(formValueWithoutFile, this.id)

        // Upload images after successful update
        //@ts-ignore
        await this.uploadImage(this.id); // Assuming `updatedData.id` contains the ID of the updated track

        const updatedData2 = await this.elephantService.insertElephant(formValueWithoutFile, this.id)


        this.showAlert('Success', 'Data updated successfully');

        this.fetchElephantData(this.id);

      } else {
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
      if (this.previewImages.length === 0) {
        // No images to upload
        this.uploadedImageUrls = [];
        await this.elephantService.updateElephantMedia(Number(id), this.uploadedImageUrls);
        return;
      }


      // Loop through each image in the previewImages array and upload them
      for (const { file, url } of this.previewImages) {
        if(file != null && file != undefined){
          const uploadedImageUrl = await this.elephantService?.uploadImage(id, file!); // Assuming you have a method in `trackService` to upload an image
          this.uploadedImageUrls.push(uploadedImageUrl);
        } else {
          this.uploadedImageUrls.push(url);
        }
      }

      // Once all images are uploaded, add their URLs to the media form control
      this.addElephantForm.get('media_attachments')?.setValue(this.uploadedImageUrls);

      // Clear the previewImages array after successful upload
      this.previewImages = [];

      // await loader.dismiss(); // Hide loader after uploading

      // update the data
        //@ts-ignore
        await this.elephantService.updateElephantMedia(id, this.uploadedImageUrls);

    } catch (error) {
      console.error('Error uploading images:', error);
      // await loader.dismiss(); // Ensure loader is dismissed in case of an error
    }
  }

  resetForm() {
    this.addElephantForm.reset();
    this.previewImages = [];
    this.uploadedImageUrls = [];
  }

  async fetchElephantData(elephantId: number) {
    try {
      const elephantData = await this.elephantService.getElephantById(elephantId);
      // preview images
      if (elephantData.media_attachments) {
        elephantData.media_attachments.forEach((mediaUrl: string) => {
          this.previewImages.push({ url: mediaUrl});
        })
      }

      this.addElephantForm.patchValue(elephantData);
    } catch (error) {
      console.error('Error fetching track data:', error);
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


}
