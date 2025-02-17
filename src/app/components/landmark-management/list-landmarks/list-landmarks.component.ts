import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Landmark } from 'src/app/models/landmark.model';
import { LandmarksService } from 'src/app/services/landmarks.service';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-list-landmarks',
  templateUrl: './list-landmarks.component.html',
  styleUrls: ['./list-landmarks.component.scss'],
})
export class ListLandmarksComponent  implements OnInit {

  landmarks: Landmark[] = [];  
  currentPage: number = 1; // Current page
  itemsPerPage: number = 10; // Number of items per page

  constructor(
    private landmarkService: LandmarksService,
    private toastService: ToastService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.fetchLandmarks();
  }

  fetchLandmarks() {
    
    // Fetch landmarks
    this.landmarkService.fetchLandmarks().then((landmarks) => {
      this.landmarks = landmarks;
    });
  }

  editLandmark(landmarkId: number) {
    // Navigate to edit page
    // this.router.navigate(['/collars/edit', landmarkId]);
  }

  deleteLandmark(landmarkId: number) {

    this.alertController.create({
      header: 'Delete Landmark',
      message: 'Are you sure you want to delete this landmark?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            this.landmarkService.deleteLandmark(landmarkId).then(() => {
      this.fetchLandmarks();
    });
          },
        },
      ],
    }).then((alert) => {
      alert.present();
    });

    // Delete landmark
   
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

  get totalPages(): number {
    // Calculate total pages based on data length and items per page
    return Math.ceil(this.landmarks.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  updateStatus(id: number, status: boolean) {
    // Update collar status
    this.landmarkService.changeStatus(id, status).then(() => {
      this.fetchLandmarks();
      this.toastService.presentToast('Landmark status updated successfully');
    });
  }

}
