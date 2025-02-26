import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Range, RangeService } from 'src/app/services/range.service';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-list-range',
  templateUrl: './list-range.component.html',
  styleUrls: ['./list-range.component.scss'],
})
export class ListRangeComponent  implements OnInit {

      ranges: Range[] = [];  
  
      //landmarks: Landmark[] = [];  
      currentPage: number = 1; // Current page
      itemsPerPage: number = 10; // Number of items per page
    
      constructor(
        private rangeService: RangeService,
        private toastService: ToastService,
        private alertController: AlertController
      ) { }
    
      ngOnInit() {
        this.fetchRanges();
      }
    
      // fetchDivisions() {
        
      //   // Fetch landmarks
      //   this.landmarkService.fetchLandmarks().then((landmarks) => {
      //     this.divisions = landmarks;
      //   });
      // }
      fetchRanges() {
        this.ranges = this.rangeService.getRanges();
      }
    
      editLandmark(landmarkId: number) {
        // Navigate to edit page
        // this.router.navigate(['/collars/edit', landmarkId]);
      }
    
      deleteRange(rangeId: number) {
    
        this.alertController.create({
          header: 'Delete Range',
          message: 'Are you sure you want to delete this range?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'Delete',
              handler: () => {
                this.rangeService.deleteRanges(rangeId);
                this.fetchRanges();
                this.toastService.presentToast('Range deleted successfully');
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
        return Math.ceil(this.ranges.length / this.itemsPerPage);
      }
    
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      }
    
      updateStatus(id: number, status: boolean) {
        this.toastService.presentToast('Range status updated successfully');
      }
}
