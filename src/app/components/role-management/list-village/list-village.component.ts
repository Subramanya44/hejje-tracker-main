import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Village, VillageService } from 'src/app/services/village.service';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-list-village',
  templateUrl: './list-village.component.html',
  styleUrls: ['./list-village.component.scss'],
})
export class ListVillageComponent  implements OnInit {

        villages: Village[] = [];  
     
         //landmarks: Landmark[] = [];  
         currentPage: number = 1; // Current page
         itemsPerPage: number = 10; // Number of items per page
       
         constructor(
           private villageService: VillageService,
           private toastService: ToastService,
           private alertController: AlertController
         ) { }
       
         ngOnInit() {
           this.fetchVillages();
         }
       
         // fetchDivisions() {
           
         //   // Fetch landmarks
         //   this.landmarkService.fetchLandmarks().then((landmarks) => {
         //     this.divisions = landmarks;
         //   });
         // }
         fetchVillages() {
           this.villages = this.villageService.getVillages();
         }
       
         editLandmark(landmarkId: number) {
           // Navigate to edit page
           // this.router.navigate(['/collars/edit', landmarkId]);
         }
       
         deleteVillage(villageId: number) {
       
           this.alertController.create({
             header: 'Delete Village',
             message: 'Are you sure you want to delete this village?',
             buttons: [
               {
                 text: 'Cancel',
                 role: 'cancel',
               },
               {
                 text: 'Delete',
                 handler: () => {
                   this.villageService.deleteVillages(villageId);
                   this.fetchVillages();
                   this.toastService.presentToast('village deleted successfully');
                 },
               },
             ],
           }).then((alert) => {
             alert.present();
           });
       
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
           return Math.ceil(this.villages.length / this.itemsPerPage);
         }
       
         nextPage() {
           if (this.currentPage < this.totalPages) {
             this.currentPage++;
           }
         }

         get visibleVillages(): Village[] {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = Math.min(startIndex + this.itemsPerPage, this.villages.length);
          return this.villages.slice(startIndex, endIndex);
        } 
       
         updateStatus(id: number, status: boolean) {
           this.toastService.presentToast('Village status updated successfully');
         }

}
