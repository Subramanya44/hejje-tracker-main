import { Component, OnInit } from '@angular/core';
import { ELEPHANT } from 'src/app/models/elephant';
import { ElephantService } from 'src/app/services/elephant.service';
import { ImageSliderComponent } from '../../track-management/image-slider/image-slider.component';
import {AlertController, ModalController} from '@ionic/angular';

@Component({
  selector: 'app-list-elephant',
  templateUrl: './list-elephant.component.html',
  styleUrls: ['./list-elephant.component.scss'],
})
export class ListElephantComponent  implements OnInit {

  elephants: ELEPHANT[] = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 10; // Number of items per page

  constructor(private elephantService: ElephantService, private modalController: ModalController, private alertController:AlertController) { }

  ngOnInit() {
    this.fetchElephants();
    
  }

  fetchElephants() {
    this.elephantService.fetchAllElephants().then((elephants) => {
      this.elephants = elephants;
      this.currentPage = 1;
    } );
  }

  deleteElephant(elephantId: number) {
    this.alertController.create({
      header: 'Delete Elephant',
      message: 'Are you sure you want to delete this elephant?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.elephantService.deleteElephant(elephantId).then(() => {
              this.fetchElephants();
            });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
   
    
  }

  isMediaVisible(media: string[]): boolean {
    // Initialize a variable to track if any non-empty element is found
    let hasNonEmpty = false;

    if (media.length == 0 || media == null) {
      return false;
    }

    // Iterate through each element
    for (const item of media) {
      // If an element is not empty, set the flag and break the loop
      if (item !== "") {
        hasNonEmpty = true;
        break;
      }
    }
    // Return the flag value
    return hasNonEmpty;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    // Calculate total pages based on data length and items per page
    return Math.ceil(this.elephants.length / this.itemsPerPage);
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get visibleElephants(): ELEPHANT[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.elephants.length);
    return this.elephants.slice(startIndex, endIndex);
  }  

  updateElephant(elephantId: number) {
    // Update the status of the elephant
  }

  async openModal(elephant: any) {

    const modal = await this.modalController.create({
      component: ImageSliderComponent,
      componentProps: {
        // You can pass data to the modal component if needed
        images: this.convertMediaToImages(elephant?.media_attachments)
      }
    });
    return await modal.present();
  }

  convertMediaToImages(media: any[]): { src: string, alt: string }[] {
    return media.map((mediaItem: any) => {
      return {src: mediaItem, alt: ''};
    })
  }

}
