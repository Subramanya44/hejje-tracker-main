import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DivisionService } from 'src/app/services/division.service';
import { ToastService } from 'src/app/services/shared/toast.service';

interface Division {
  id: number;
  division_name: string;
  circle_name: string;
  organization: string;
}

@Component({
  selector: 'app-list-division',
  templateUrl: './list-division.component.html',
  styleUrls: ['./list-division.component.scss'],
})
export class ListDivisionComponent  implements OnInit {
    
    divisions: Division[] = [];  

    //landmarks: Landmark[] = [];  
    currentPage: number = 1; // Current page
    itemsPerPage: number = 10; // Number of items per page
  
    constructor(
      private divisionService: DivisionService,
      private toastService: ToastService,
      private alertController: AlertController
    ) { }
  
    ngOnInit() {
      this.fetchDivisions();
    }
  
    // fetchDivisions() {
      
    //   // Fetch landmarks
    //   this.landmarkService.fetchLandmarks().then((landmarks) => {
    //     this.divisions = landmarks;
    //   });
    // }
    fetchDivisions() {
      this.divisions = this.divisionService.getDivisions();
    }
  
    editLandmark(landmarkId: number) {
      // Navigate to edit page
      // this.router.navigate(['/collars/edit', landmarkId]);
    }
  
    deleteDivision(divisionId: number) {
  
      this.alertController.create({
        header: 'Delete Landmark',
        message: 'Are you sure you want to delete this division?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'Delete',
            handler: () => {
              this.divisionService.deleteDivision(divisionId);
              this.fetchDivisions();
              this.toastService.presentToast('Division deleted successfully');
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
      return Math.ceil(this.divisions.length / this.itemsPerPage);
    }
  
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  
    updateStatus(id: number, status: boolean) {
      this.toastService.presentToast('Division status updated successfully');
    }
  
 

}
