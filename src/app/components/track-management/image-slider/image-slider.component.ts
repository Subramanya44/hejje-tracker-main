import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
})
export class ImageSliderComponent implements OnInit {
  @Input() images: { src: string, alt: string }[] = [];

  ngOnInit() {


    // filter out all the data which is not an image
    this.images = this.images.filter(image => image.src.includes('http'));
  }


  showModal: boolean = false;
  selectedImage: { src: string, alt: string } = { src: '', alt: '' };

  constructor(private modalCtrl: ModalController) {

   }

  cancel() {
    return this.modalCtrl.dismiss();
  }

  confirm() {
    return this.modalCtrl.dismiss();
  }

  openModal(image: { src: string, alt: string }) {
    this.showModal = true;
    this.selectedImage = image;
  }

  closeModal() {
    this.showModal = false;
  }
}
