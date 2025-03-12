import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Announcement, AnnouncementService } from 'src/app/services/announcement.service';
import { ToastService } from 'src/app/services/shared/toast.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-list-announcement',
  templateUrl: './list-announcement.component.html',
  styleUrls: ['./list-announcement.component.scss'],
})
export class ListAnnouncementComponent  implements OnInit {

    announcements: Announcement[] = [];  
     
         //landmarks: Landmark[] = [];  
         currentPage: number = 1; // Current page
         itemsPerPage: number = 10; // Number of items per page
       
         constructor(
           private announcementService: AnnouncementService,
           private toastService: ToastService,
           private alertController: AlertController
         ) { }
       
         ngOnInit() {
           this.fetchAnnouncements();
         }
       
         // fetchDivisions() {
           
         //   // Fetch landmarks
         //   this.landmarkService.fetchLandmarks().then((landmarks) => {
         //     this.divisions = landmarks;
         //   });
         // }
         fetchAnnouncements() {
          this.announcements = this.announcementService.getAnnoucement();
        }        
       
         editLandmark(landmarkId: number) {
           // Navigate to edit page
           // this.router.navigate(['/collars/edit', landmarkId]);
         }
       
         deleteAnnouncement(announcementId: number) {
       
           this.alertController.create({
             header: 'Delete Announcement',
             message: 'Are you sure you want to delete this Announcement?',
             buttons: [
               {
                 text: 'Cancel',
                 role: 'cancel',
               },
               {
                 text: 'Delete',
                 handler: () => {
                   this.announcementService.deleteAnnoucement(announcementId);
                   this.fetchAnnouncements();
                   this.toastService.presentToast('Announcement deleted successfully');
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
           return Math.ceil(this.announcements.length / this.itemsPerPage);
         }
       
         nextPage() {
           if (this.currentPage < this.totalPages) {
             this.currentPage++;
           }
         }

        get visibleAnnouncements(): Announcement[] {
          const startIndex = (this.currentPage - 1) * this.itemsPerPage;
          const endIndex = Math.min(startIndex + this.itemsPerPage, this.announcements.length);
          return this.announcements.slice(startIndex, endIndex);
        } 
       
         updateStatus(id: number, status: boolean) {
           this.toastService.presentToast('Announcement status updated successfully');
         }

         downloadPDF() {
          const doc = new jsPDF();
          const pageWidth = doc.internal.pageSize.getWidth();
        
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text('E.T.F CONTROL ROOM HASSAN', pageWidth / 2, 10, { align: 'center' });
          doc.text('MORNING AND EVENING ANNOUNCEMENT DETAILS', pageWidth / 2, 20, { align: 'center' });
        
          const headers = [['SL NO', 'DATE', 'RANGE', 'SECTION', 'VILLAGE NAME', 'MORNING TIME', 'EVENING TIME']];
          
          const data = this.announcements.map((announcement, index) => [
            index + 1,
            announcement.announcement_date,
            announcement.range_name,
            announcement.section_name,
            announcement.village_name,
            announcement.timeFieldsArray[0] || '',
            announcement.timeFieldsArray[1] || ''
          ]);
        
          autoTable(doc, {
            head: headers,
            body: data,
            startY: 30,
            theme: 'striped',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] },
          });
        
          doc.save('Announcement_Details.pdf');
        }

}
