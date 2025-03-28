import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { ToastService } from 'src/app/services/shared/toast.service';
import { CirclesService } from 'src/app/services/circle.service';
import { Circle } from 'src/app/models/circle';

@Component({
  selector: 'app-list-circle',
  templateUrl: './list-circle.component.html',
  styleUrls: ['./list-circle.component.scss'],
})
export class ListCircleComponent implements OnInit, ViewWillEnter {
 
   circles: Circle[] = [];  
   currentPage: number = 1; // Current page
   itemsPerPage: number = 10; // Number of items per page
 
   constructor( 
     private circlesService: CirclesService,
     private toastService: ToastService,
     private alertController: AlertController,
   ) { }
 
   ngOnInit() {
      this.fetchCircles();
   } 

   ionViewWillEnter() {
    this.fetchCircles();
   }
  
  async fetchCircles() {
    // this.circles = await this.circlesService.getCircles();
    this.currentPage = 1;
    this.circlesService.getCircles().then((circles) => {
      this.circles = circles;
    });
  }
  
  // Getter to return only paginated items
  get paginatedCircles(): Circle[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.circles.slice(startIndex, endIndex);
  }
  
   editCircle(landmarkId: number) {
     // Navigate to edit page
     // this.router.navigate(['/collars/edit', landmarkId]);
   }
  async deleteCircle(circleId: number) {
    const alert = await this.alertController.create({
      header: 'Delete Circle',
      message: 'Are you sure you want to delete this circle?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.circlesService.deleteCircle(circleId);
            await this.fetchCircles();
            this.toastService.presentToast('Circle deleted successfully');
           },
         },
       ],
     });
 
    await alert.present();
   }
 
   onPageSizeChange(event: any) {
    this.itemsPerPage = parseInt(event.detail.value, 10);
    this.currentPage = 1; // Reset to first page when changing page size
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
