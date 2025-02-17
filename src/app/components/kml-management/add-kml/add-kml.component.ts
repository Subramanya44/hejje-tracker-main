import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { KmLService } from 'src/app/services/kml.service';

@Component({
  selector: 'app-add-kml',
  templateUrl: './add-kml.component.html',
  styleUrls: ['./add-kml.component.scss'],
})
export class AddKmlComponent  implements OnInit {
  addKmlForm: FormGroup = new FormGroup({});
  id?: number = 0;
  selectedKMLfile: { url: string, file?: File } = { url: '', file: undefined };

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private kmlService: KmLService,
  ) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    
    this.addKmlForm = this.formBuilder.group({
      // created_at: [new Date().toISOString()],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      kmlfile: [['']],
      status: [true],
    });
  }

  async onSubmit() {
    if (this.id !== null && this.id !== undefined && this.id !== 0) {
      const { file, ...formValueWithoutFile } = this.addKmlForm.value;
      const updatedData = await this.kmlService.insertKML( formValueWithoutFile, this.id);
      await this.kmlService.updateKMLFile(this.id, file);
      this.alertController.create({
        header: 'Success',
        message: 'KML updated successfully',
        buttons: ['OK'],
      }).then(alert => alert.present());  
    }
    else{
      const { file, ...formValueWithoutFile } = this.addKmlForm.value;
      const insertedData = await this.kmlService.insertKML( formValueWithoutFile, this.id);
      await this.upload(insertedData[0].id);
      this.alertController.create({
        header: 'Success',
        message: 'KML added successfully',
        buttons: ['OK'],
      }).then(alert => alert.present());
      this.resetForm()

    }
  }

  resetForm() {
    this.addKmlForm.reset();
    this.id = 0;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedKMLfile = { url: e.target.result, file: files[0] };
        };
        reader.readAsDataURL(files[0]);
      }

      // Set the selected files to the form control
      // this.trackForm.get('media')?.setValue(files);
    }
  }


  async upload(id: string) {
    try {
     //check if any file is selected from addKmlForm
      if (this.addKmlForm.get('kmlfile')?.value == null) {
        return;
      }


      // upload the file  
      // @ts-ignore
      const url = await this.kmlService.uploadKmlFile(id, this.selectedKMLfile.file);
      


      // Once all images are uploaded, add their URLs to the media form control
      this.addKmlForm.get('kmlfile')?.setValue(url);

      // Clear the previewImages array after successful upload
      

      // await loader.dismiss(); // Hide loader after uploading

      // update the data
        //@ts-ignore
        await this.kmlService.updateKMLFile(id, this.uploadedImageUrls);

    } catch (error) {
      console.error('Error uploading kml file:', error);
      // await loader.dismiss(); // Ensure loader is dismissed in case of an error
    }
  }

}
