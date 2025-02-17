import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { KML } from 'src/app/models/kml';
import { KmLService } from 'src/app/services/kml.service';

@Component({
  selector: 'app-list-kml',
  templateUrl: './list-kml.component.html',
  styleUrls: ['./list-kml.component.scss'],
})
export class ListKmlComponent  implements OnInit {
  kmls: KML[] = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 10; // Number of items per page

  constructor(private modalController: ModalController, private kmlService:KmLService) { }

  ngOnInit() {
    this.fetchKMLs();
  }

  fetchKMLs() {
    this.kmlService.fetchAllKmls().then((kmls) => {
      this.kmls = kmls;
    } );
  }

  deleteKML(kmlId: number) {
    this.kmlService.deleteKml(kmlId).then(() => {
      this.fetchKMLs();
    });
  }

  isMediaVisible(media: string): boolean {
    return media !== "";
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    // Calculate total pages based on data length and items per page
    return Math.ceil(this.kmls.length / this.itemsPerPage);
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


}
