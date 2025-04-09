import { Component, OnInit } from '@angular/core';
import { ComplaintsService } from 'src/app/services/complaints.service';

@Component({
  selector: 'app-list-complaints',
  templateUrl: './list-complaints.component.html',
  styleUrls: ['./list-complaints.component.scss'],
})
export class ListComplaintsComponent  implements OnInit {
  public complaints: any = [];
  visibleComplaints: any = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 10; // Number of items per page
  startDate: string = ''; // Start date for filtering
  endDate: string = ''; // End date for filtering

  constructor(private complaintsService:ComplaintsService) { }

  ngOnInit() {
    this.filterComplaintsByDate();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleComplaints();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVisibleComplaints();
    }
  }

  get totalPages(): number {
    // Calculate total pages based on data length and items per page
    return Math.ceil(this.complaints.length / this.itemsPerPage);
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
    this.updateVisibleComplaints();
  }

  updateVisibleComplaints() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleComplaints = this.complaints.slice(startIndex, endIndex);
  }

  // if media is empty then return false
  // media = ["", "" ... ]
  isMediaVisible(media: any[]): boolean {
    // Initialize a variable to track if any non-empty element is found
    let hasNonEmpty = false;

    if (media.length == 0 || media == null) {
      return false;
    }

    // Iterate through each element
    for (const item of media) {
      // If an element is not empty, set the flag and break the loop
      if (item !== "") {
        hasNonEmpty = true;
        break;
      }
    }

    // Return the flag value
    return hasNonEmpty;
  }

  deleteComplaint(complaintId: number) {
    // Delete the complaint
  }

  filterComplaintsByDate() {
    // Filter the complaints by date
    this.visibleComplaints = this.complaintsService.fetchAllComplaints(this.startDate, this.endDate).then((complaints) => {
      this.complaints = complaints;
      this.currentPage = 1;
      this.updateVisibleComplaints();
    });
  }

  updateCompaint(complaintId: number, status: string) {
    // Update the complaints
  }

  openMap(latitude: number, longitude: number) {
    // Open the map
  }

  openModal(complaintId: number) {
    // Open the modal
  }
  exportAsExcel() {
    // Export the complaints as excel
  }

}
