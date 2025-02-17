import {Component, OnInit} from '@angular/core';
import {TrackService} from "../../../services/track.service";
import {AlertController, ModalController} from '@ionic/angular';
import {ImageSliderComponent} from '../image-slider/image-slider.component';
import {MapViewComponent} from '../map-view/map-view.component';
import {TranslateService} from "@ngx-translate/core";
import { ElephantService } from 'src/app/services/elephant.service';
import { ELEPHANT } from 'src/app/models/elephant';
import { AuthService } from 'src/app/services/auth.service';
import { ExportService } from 'src/app/services/export.service';

@Component({
  selector: 'app-track-list-screen',
  templateUrl: './track-list-screen.component.html',
  styleUrls: ['./track-list-screen.component.css'],
})
export class TrackListScreenComponent implements OnInit {

  startDate: string = ''; // Start date for filtering
  endDate: string = ''; // End date for filtering
  date = new Date();
  public tracks: any = [];
  currentPage: number = 1; // Current page
  itemsPerPage: number = 10; // Number of items per page
  masterElephants: ELEPHANT[] = [];
  masterUsers: any = [];

  constructor(private trackService: TrackService, 
    private modalController: ModalController, 
    private alertController: AlertController, 
    private translateService: TranslateService,
    private elephantService: ElephantService,
    private authService: AuthService,
    private exportService: ExportService
  ) {
  }

  ngOnInit() {
    this.loadTracks();
    this.loadElephants();
    this.loadUsers();
  }

  // Filter tracks by date range
  filterTracksByDate() {
    // Convert start and end dates to proper format (if needed)
    // Then, make a service call to fetch filtered tracks based on dates
    // For demonstration, let's assume you have a service method for this purpose
    this.trackService.fetchAllTracks(this.startDate, this.endDate).then((filteredTracks: any) => {
      this.tracks = filteredTracks;
    });
  }

  // conver media into { src: string, alt: string }
  convertMediaToImages(media: any[]): { src: string, alt: string }[] {
    return media.map((mediaItem: any) => {
      return {src: mediaItem, alt: ''};
    })
  }

  async openModal(track: any) {

    const modal = await this.modalController.create({
      component: ImageSliderComponent,
      componentProps: {
        // You can pass data to the modal component if needed
        images: this.convertMediaToImages(track?.media)
      }
    });
    return await modal.present();
  }

  // open Map
  async openMap(latitude: number, longitude: number) {

    const modal = await this.modalController.create({
      component: MapViewComponent,
      componentProps: {
        latitude: latitude,
        longitude: longitude
      }
    });
    return await modal.present();
  }


  loadTracks() {
    this.trackService.fetchAllTracks().then((tracks: any) => {

      this.tracks = tracks;
    });
  }

  // update track
  updateTrack(trackId: number, newStatus: string) {
    this.trackService.updateTrackStatus(trackId, newStatus).then(() => {
      this.loadTracks(); // Reload tracks after update
    })
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages(): number {
    // Calculate total pages based on data length and items per page
    return Math.ceil(this.tracks.length / this.itemsPerPage);
  }

  get visibleTracks(): any[] {
    // Calculate the range of items to display for the current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.tracks.length);
    return this.tracks.slice(startIndex, endIndex);
  }

  onPageSizeChange(event: any) {
    this.itemsPerPage = event.target.value;
    this.currentPage = 1;
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

  async deleteTrack(trackId: number) {


    try {
      const alert = await this.alertController.create({
        header: this.translateService.instant('DELETE'),
        message: this.translateService.instant('ARE_YOU_SURE_DELETE_TRACK'),
        buttons: [
          {
            text: this.translateService.instant('NO'),
            role: 'cancel',
            cssClass: 'alert-button-cancel',

          },
          {
            text: this.translateService.instant('YES'),
            cssClass: 'alert-button-confirm',
            handler: () => {
              this.trackService.deleteTrack(trackId).then(() => {
                this.loadTracks(); // Reload tracks after delete
              });
            }
          }
        ]
      });
      await alert.present();
    } catch (error) {
      console.error('Error:', error);
    }
  }


  loadElephants() {
    this.elephantService.fetchAllElephants().then((elephants: ELEPHANT[]) => {
      this.masterElephants = elephants;
    });
  }
  // get elephant from IDs list 
  getElephantsFromIds(ids: number[]): string {
    if (!ids || ids.length == 0) {
      return "";
    }
    let elephantNames = [];
    for (let id of ids) {
      let elephant = this.masterElephants.find(elephant => elephant.id == id);
      if (elephant) {
        elephantNames.push(elephant.name);
      }
    }
    return elephantNames.join(", ");
  }


  loadUsers() {
    this.authService.fetchAllUsers().then((users: any) => {
      this.masterUsers = users;
    })
  }
  getUserName(userId: string): string {
    if (!userId) {
      return "";
    }
    //@ts-ignore
    let user = this.masterUsers.find(user => user.id === userId);

    // Fetch user name based on user id
    // For demonstration, let's assume you have a service method for this purpose
    return user?.email || userId;
  }

  exportAsExcel() {
    this.exportService.exportAsExcelFile(this.tracks, 'track_list');
  }

  

}
