import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { ToastService } from 'src/app/services/shared/toast.service';
import { Announcement } from 'src/app/models/announcement';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-list-announcement',
  templateUrl: './list-announcement.component.html',
  styleUrls: ['./list-announcement.component.scss'],
})
export class ListAnnouncementComponent implements OnInit, ViewWillEnter {

  announcements: Announcement[] = [];


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

  ionViewWillEnter() {
    this.fetchAnnouncements();
  }

  async fetchAnnouncements() {
    try {
      this.currentPage = 1;
      this.announcements = await this.announcementService.getAnnouncements();
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  }


  // In list-announcement.component.ts
  async deleteAnnouncement(announcementId: number | undefined) {
    if (!announcementId) {
      console.error('Cannot delete - announcement ID is missing');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Delete Announcement',
      message: 'Are you sure you want to delete this announcement?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            await this.announcementService.deleteAnnouncement(announcementId);
            await this.fetchAnnouncements();
            this.toastService.presentToast('Announcement deleted successfully');
          },
        },
      ],
    });

    await alert.present();
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
    const doc = new jsPDF({ orientation: 'landscape' }); // Landscape mode for better width
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10; // Standard margin
    const tableWidth = 260; // Approximate total table width (adjust as needed)
  
    // Center alignment calculation
    const centerX = (pageWidth - tableWidth) / 2;
  
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('E.T.F CONTROL ROOM HASSAN', pageWidth / 2, margin, { align: 'center' });
    doc.text('MORNING AND EVENING ANNOUNCEMENT DETAILS', pageWidth / 2, margin + 10, { align: 'center' });
  
    // Define table headers with specific column widths
    const headers = [
      { title: 'SL NO', dataKey: 'sl_no', width: 15 },
      { title: 'DATE', dataKey: 'date', width: 30 },
      { title: 'RANGE', dataKey: 'range', width: 40 },
      { title: 'SECTION', dataKey: 'section', width: 40 },
      { title: 'VILLAGE NAME', dataKey: 'village', width: 50 },
      { title: 'MORNING TIME', dataKey: 'morning_time', width: 35 },
      { title: 'EVENING TIME', dataKey: 'evening_time', width: 35 },
    ];
  
    // Format announcement data for the table
    const data = this.announcements.map((announcement, index) => ({
      sl_no: index + 1,
      date: announcement.announcement_date,
      range: announcement.range_name,
      section: announcement.section_name,
      village: announcement.village_name,
      morning_time: announcement.announcement_time_am || '',
      evening_time: announcement.announcement_time_pm || ''
    }));
  
    // Use `columnStyles` to set specific column widths
    autoTable(doc, {
      columns: headers,
      body: data,
      startY: margin + 20,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        sl_no: { cellWidth: 15 },
        date: { cellWidth: 30 },
        range: { cellWidth: 40 },
        section: { cellWidth: 40 },
        village: { cellWidth: 50 },
        morning_time: { cellWidth: 35 },
        evening_time: { cellWidth: 35 },
      },
      margin: { left: centerX, right: centerX }, // Center the table
      tableWidth: 'auto',
    });
  
    doc.save('Announcement_Details.pdf');
  }
  
  
}
