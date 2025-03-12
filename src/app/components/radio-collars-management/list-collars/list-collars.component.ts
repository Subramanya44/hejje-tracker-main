import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { RadioCollar } from 'src/app/models/radio-collars';
import { CollarsService } from 'src/app/services/collars.service';
import { ToastService } from 'src/app/services/shared/toast.service';

@Component({
  selector: 'app-list-collars',
  templateUrl: './list-collars.component.html',
  styleUrls: ['./list-collars.component.scss'],
})
export class ListCollarsComponent  implements OnInit {

  collars: RadioCollar[] = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 10; // Number of items per page

  constructor(private collarService :CollarsService,private toastService:ToastService, private alertController: AlertController) { }

  ngOnInit() {
    this.fetchCollars();
  }

  fetchCollars() {
    this.collarService.fetchCollars().then((collars) => {
      this.collars = collars;
    } 
  );
  }

  editCollar(collarId: number) {
    // Navigate to edit page
    // this.router.navigate(['/collars/edit', collarId]);
  }

  get paginatedCollars(): RadioCollar[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.collars.slice(startIndex, startIndex + this.itemsPerPage);
  }

  deleteCollar(collarId: number) {

    // Confirm delete
    this.alertController.create({
      header: 'Delete Collar',
      message: 'Are you sure you want to delete this collar?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.collarService.deleteCollar(collarId).then(() => {
              this.fetchCollars();
            });
          }
        }
      ]
    }).then(alert => {
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
    return Math.ceil(this.collars.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  updateStatus(id: number, status: boolean) {
    // Update collar status
    this.collarService.changeStatus(id, status).then(() => {
      this.fetchCollars();
      this.toastService.presentToast('Collar status updated successfully');
    });
  }

  
}
