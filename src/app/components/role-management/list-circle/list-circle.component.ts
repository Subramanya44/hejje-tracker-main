import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Landmark } from 'src/app/models/landmark.model';
import { ToastService } from 'src/app/services/shared/toast.service';
import { CirclesService } from 'src/app/services/circle.service';

interface Circle {
  id: number;
  circle_name: string;
  organization: string;
}

@Component({
  selector: 'app-list-circle',
  templateUrl: './list-circle.component.html',
  styleUrls: ['./list-circle.component.scss'],
})
export class ListCircleComponent  implements OnInit {
 
   circles: Circle[] = [];  
   currentPage: number = 1; // Current page
   itemsPerPage: number = 10; // Number of items per page
 
   constructor( 
     private circlesService: CirclesService,
     private toastService: ToastService,
     private alertController: AlertController
   ) { }
 
   ngOnInit() {
    //  this.fetchLandmarks();
      this.fetchCircles();
   }
 
  //  fetchLandmarks() {
     
  //    // Fetch landmarks
  //    this.landmarkService.fetchLandmarks().then((landmarks) => {
  //      this.landmarks = landmarks;
  //    });
  //  }
  fetchCircles() {
    this.circles = this.circlesService.getCircles();
  }
 
   editCircle(landmarkId: number) {
     // Navigate to edit page
     // this.router.navigate(['/collars/edit', landmarkId]);
   }
 
   deleteCircle(circleId: number) {
 
     this.alertController.create({
       header: 'Delete Circle',
       message: 'Are you sure you want to delete this circle?',
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
         },
         {
           text: 'Delete',
           handler: () => {
            // this.landmarkService.deleteLandmark(circleId).then(() => {
            //   this.fetchCircles();
            // });
            this.circlesService.deleteCircle(circleId);
            this.fetchCircles();
            this.toastService.presentToast('Circle deleted successfully');
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
     return Math.ceil(this.circles.length / this.itemsPerPage);
   }
 
   nextPage() {
     if (this.currentPage < this.totalPages) {
       this.currentPage++;
     }
   }
 
   updateStatus(id: number, status: boolean) {
      this.toastService.presentToast('Circle status updated successfully');

    // Update collar status
    //  this.landmarkService.changeStatus(id, status).then(() => {
    //    this.fetchCircles();
    //    this.toastService.presentToast('Circle status updated successfully');
    //  });
   }
 
 
}
