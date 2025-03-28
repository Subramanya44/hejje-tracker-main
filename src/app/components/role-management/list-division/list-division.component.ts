import { Component, OnInit } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { ToastService } from 'src/app/services/shared/toast.service';
import { DivisionService } from 'src/app/services/division.service';
import { Division } from 'src/app/models/division';

@Component({
  selector: 'app-list-division',
  templateUrl: './list-division.component.html',
  styleUrls: ['./list-division.component.scss'],
})
export class ListDivisionComponent implements OnInit, ViewWillEnter {
  
  divisions: Division[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private divisionService: DivisionService,
    private toastService: ToastService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.fetchDivisions();
  }

  ionViewWillEnter() {
    this.fetchDivisions();
  }

  async fetchDivisions() {
    this.currentPage = 1;
    this.divisionService.getDivisions().then((divisions) => {
      this.divisions = divisions;
    });
  }

  get paginatedDivisions(): Division[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.divisions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  async deleteDivision(divisionId: number) {
    const alert = await this.alertController.create({
      header: 'Delete Division',
      message: 'Are you sure you want to delete this division?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: async () => {
            try {
              await this.divisionService.deleteDivision(divisionId);
              await this.fetchDivisions();
              this.toastService.presentToast('Division deleted successfully');
            } catch (error) {
              console.error('Error deleting division:', error);
              this.toastService.presentToast('Failed to delete division');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = parseInt(event.detail.value, 10);
    this.currentPage = 1;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
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
