import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Section, SectionService } from 'src/app/services/section.service';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-list-section',
  templateUrl: './list-section.component.html',
  styleUrls: ['./list-section.component.scss'],
})
export class ListSectionComponent  implements OnInit {

       sections: Section[] = [];  
   
       //landmarks: Landmark[] = [];  
       currentPage: number = 1; // Current page
       itemsPerPage: number = 10; // Number of items per page
     
       constructor(
         private sectionService: SectionService,
         private toastService: ToastService,
         private alertController: AlertController
       ) { }
     
       ngOnInit() {
         this.fetchSections();
       }
     
       // fetchDivisions() {
         
       //   // Fetch landmarks
       //   this.landmarkService.fetchLandmarks().then((landmarks) => {
       //     this.divisions = landmarks;
       //   });
       // }
       fetchSections() {
         this.sections = this.sectionService.getSections();
       }
     
       editLandmark(landmarkId: number) {
         // Navigate to edit page
         // this.router.navigate(['/collars/edit', landmarkId]);
       }
     
       deleteSection(sectionId: number) {
     
         this.alertController.create({
           header: 'Delete Section',
           message: 'Are you sure you want to delete this section?',
           buttons: [
             {
               text: 'Cancel',
               role: 'cancel',
             },
             {
               text: 'Delete',
               handler: () => {
                 this.sectionService.deleteSections(sectionId);
                 this.fetchSections();
                 this.toastService.presentToast('Section deleted successfully');
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
         return Math.ceil(this.sections.length / this.itemsPerPage);
       }
     
       nextPage() {
         if (this.currentPage < this.totalPages) {
           this.currentPage++;
         }
       }

       get visibleSections(): Section[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.sections.length);
        return this.sections.slice(startIndex, endIndex);
      } 
     
       updateStatus(id: number, status: boolean) {
         this.toastService.presentToast('Section status updated successfully');
       }
}
