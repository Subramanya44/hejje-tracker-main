import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import * as L from 'leaflet';
import {Control, Map} from 'leaflet';
import 'leaflet-routing-machine';
import {TrackService} from "../../../services/track.service";
import {AlertController} from '@ionic/angular';
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from 'rxjs';
import { CollarsService } from 'src/app/services/collars.service';
import { TrackerData } from 'src/app/models/radio-collar-tracker';
import { LandmarksService } from 'src/app/services/landmarks.service';
import { UserRole } from 'src/app/models/profile';
import { TracknerdService } from 'src/app/services/tracknerd.service';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.scss'],
})
export class MapScreenComponent implements  AfterViewInit, OnDestroy {

  public displayMap?: Map;
  private baseMaps: any;

  language: string = "kn";
  profileRole: UserRole = UserRole.NO_USER;

  latitude: number = 0;
  longitude: number = 0;
  private userMarker: L.Marker | undefined;
  private karnatakaLayer: L.GeoJSON | undefined;
  private readonly karnatakaBounds: L.LatLngBoundsExpression = [
    [11.5, 74],   // Southwest corner of Karnataka
    [18.5, 78.5]  // Northeast corner of Karnataka
  ];
  private elephants: any[] = [];

  private languageChangeSubscription: Subscription;



  constructor(private trackService: TrackService, private alertController: AlertController, private translateService: TranslateService, private collarsService: CollarsService, private landmarkService: LandmarksService, private tracknerdService: TracknerdService) {
    // Subscribe to language changes
    this.languageChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      // Update marker popup content when language changes
      // this.initiateData();
      if (this.userMarker) {
        this.userMarker.setPopupContent(this.translateService.instant('YOUR_LOCATION'));

      }

      if (this.elephants) {
        this.reloadElephants();
      }
    });
  }

  ngAfterViewInit(): void {
    this.profileRole = UserRole[localStorage.getItem('profile_role') as keyof typeof UserRole] || UserRole.NO_USER;
    this.initMap();
    this.showDisclaimer();  
  }

  ngOnDestroy(): void {
    // Unsubscribe from language changes to avoid memory leaks
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }

  async showDisclaimer() {
    try {
      const alert = await this.alertController.create({
        header: this.translateService.instant('DISCLAIMER'),
        message: this.translateService.instant('DISCLAIMER_TEXT'),
        buttons: [
          {
            text: this.translateService.instant('DISAGREE'),
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => this.zoomOutToKar()
          },
          {
            text: this.translateService.instant('AGREE'),
            cssClass: 'alert-button-confirm',
            handler: () => {
              this.locateUser();
              this.initiateData();
             
            }
          }
        ]
      });
      await alert.present();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  initiateData(): void {
    if (this.displayMap) {
      this.displayMap.on('locationfound', (e: L.LocationEvent) => {
        const {lat, lng} = e.latlng;
        this.latitude = lat;
        this.longitude = lng;
        // this.loadElephants();
        this.getCollarData();
        this.loadElephants();
        this.tracknerdData();
        this.plotLandmarks();
        
        
      });
    }
  }
 
  async tracknerdData(): Promise<void> {
    const whitelistedIds = [10932,10933,10934,10935,10936,10937]
    this.tracknerdService.getLiveData().subscribe(data => {
      for (let i = 0; i < data["metadata"]["locationData"].length; i++) {
        const locationData = data["metadata"]["locationData"][i];
        if(whitelistedIds.includes(locationData.id)){
          const marker = L.marker([locationData["location"]["latitude"], locationData["location"]["longitude"]], {icon: L.icon({iconUrl: 'assets/png/car-placeholder.png', iconSize: [32, 32], iconAnchor: [16, 16]})})
          .addTo(this.displayMap!)
          .bindPopup(`ID: ${locationData["id"]}, <br> ${locationData["location"]["status"]}`);
        }
      }
    }, error => {
      console.error('Failed to fetch live data', error);
    });
  }

  async loadElephants(): Promise<void> {
    this.elephants = await this.trackService.getAllElephantsForMap({
      latitude: this.latitude,
      longitude: this.longitude
    });
    this.reloadElephants();
  }

  reloadElephants(): void {
    if (this.displayMap) {
      // this.displayMap.eachLayer((layer: L.Layer) => {
      //   if (layer instanceof L.Marker) {
      //     layer.remove();
      //   }
      // });
      this.elephants.forEach(async (elephant: any) => {
      const status = elephant.stationary ? this.translateService.instant('MOVING') : this.translateService.instant('NOT_MOVING');
      const heard_size_status = elephant.herd_size ? this.translateService.instant('HEARD_SIZE') +" :"+ elephant.herd_size : this.translateService.instant('HEARD_SIZE') +" :"+ this.translateService.instant('NOT_AVAILABLE');
      const marker = L.marker([elephant.latitude, elephant.longitude], {icon: this.getElephantIcon(elephant.herd_size,elephant.stationary)})
        .addTo(this.displayMap!)
        .bindPopup(`${this.convertToIST(elephant.sighting_time)}<br>${elephant.location}<br>${status}<br>${heard_size_status}`);
    });
    }

  }

  private initMap(): void {
    
    this.displayMap = L.map('map', {
      center: [12.9716, 77.5946],
      zoom: 10,
      minZoom: 3,
      zoomControl: false,
      bounceAtZoomLimits: true,
      attributionControl: false
    });

    const streetLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      noWrap: true,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    this.baseMaps = {
      "Map View": streetLayer,
      "Satellite View": satelliteLayer
    };

    this.loadKarnatakaGeoJSON();
    this.displayMap.addLayer(satelliteLayer);
    L.control.layers(this.baseMaps).addTo(this.displayMap);
   
    this.displayMap.addControl(new Control.Zoom({position: 'bottomright'}));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 1000);
    this.displayMap.setView([12.9716, 77.5946], 8);

    // if user role is admin, show landmarks
    // if (this.authService.isAdmin()) {
    //   this.plotLandmarks();
    // }

  }


  public locateOptions: Control.LocateOptions = {
    flyTo: true,
    locateOptions: {
      enableHighAccuracy: true,
    },
    icon: 'icon-image',
    iconElementTag: 'span',
    clickBehavior: {
      inView: 'stop',
      outOfView: 'setView',
      inViewNotFollowing: 'setView'
    },
    position: 'bottomright',
    strings: {
      title: 'Locate Me',
      popup: 'You are here'
    },
    initialZoomLevel: 16,

  }

  private locateUser(): void {
    if (this.displayMap) {
      this.displayMap.locate({setView: true, maxZoom: 16});
      this.displayMap.on('locationfound', (e: L.LocationEvent) => {
        const {lat, lng} = e.latlng;
        this.latitude = lat;
        this.longitude = lng;
        if (!this.userMarker) {
          this.userMarker = L.marker([lat, lng], {icon: this.getUserIcon()}).bindPopup(this.translateService.instant('YOUR_LOCATION')).addTo(this.displayMap!);
        } else {
          this.userMarker.setLatLng([lat, lng]);
        }
      });
    }
  }

  private getElephantIcon(heard_size: number, stationary: boolean): L.DivIcon {
    let icon = 'assets/png/elephant_black.png';
    if(stationary){
      icon = 'assets/png/elephant_red.png';
    }
    return L.divIcon({
      html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <img src=${icon} style="width: 32px; height: 32px;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: white; text-shadow: 1px 1px 2px black;">
          ${heard_size}
        </div>
      </div>
    `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: ''
    });
  }

  private displayLocalDate(timestamp: string): string {
    const parsedTimestamp: Date = new Date(timestamp);
    return parsedTimestamp.toISOString().slice(0, 19).replace('T', ' ');
  }

  private convertToIST(dateTimeString: string): string {
    // Create a new Date object with the input date string
    const dateTime = new Date(dateTimeString);

    // Get the local time offset in minutes
    const offset = dateTime.getTimezoneOffset();

    // Adjust the time to the local time zone (IST: UTC+5:30)
    dateTime.setMinutes(dateTime.getMinutes() + offset + 330);

    // Format the date and time
    const formattedDate = `${dateTime.getFullYear()}-${this.padZero(dateTime.getMonth() + 1)}-${this.padZero(dateTime.getDate())}`;
    const formattedTime = `${this.padZero(dateTime.getHours())}:${this.padZero(dateTime.getMinutes())}:${this.padZero(dateTime.getSeconds())}`;

    return `${formattedDate} ${formattedTime}`;
  }

// Function to pad single-digit numbers with leading zero
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  private getUserIcon(): L.Icon {
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  }

  private loadKarnatakaGeoJSON(): void {
    this.karnatakaLayer = L.geoJSON(undefined, {
      style: {
        fill: false,
        color: '#cb2626',
        weight: 2
      }
    });
    this.displayMap?.addLayer(this.karnatakaLayer!);
    fetch('assets/geojson/kar.geojson')
      .then(response => response.json())
      .then(data => {
        this.karnatakaLayer?.addData(data);
        this.zoomOutToKar();
      });
  }

  private zoomOutToKar(): void {
    if (this.displayMap) {
      this.displayMap.setView([12.9716, 77.5946], 5);
      this.displayMap.fitBounds(this.karnatakaBounds);
    }
  }

  getCollarData(): void {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
    const currentTimestamp = now.getTime();
    this.collarsService.getTrackerData(todayStart, currentTimestamp).subscribe(data => {
      this.plotTrackerData(data);
    });
  }

  private plotTrackerData(trackerData:  TrackerData[]): void {
    if (trackerData) {
      const customMarkerIcon = L.icon({
        iconUrl: 'assets/png/elephant_orange.png',
        iconSize: [32, 32], // Set the size of the icon
        iconAnchor: [16, 32], // Set the anchor point of the icon
        popupAnchor: [0, -32] // Set the popup anchor relative to the icon
      });
      for (const data of trackerData) {
        const date = new Date(data.timestamp * 1000); // Convert Unix timestamp to milliseconds
        const formattedDate = date.toLocaleString(); // Convert date to local string
        L.marker([data.lat, data.lon], { icon: customMarkerIcon }).addTo(this.displayMap!).bindPopup(`${data.animalName}<br>${formattedDate}`);
      }
    }
  }


  plotLandmarks(): void {
    if(this.profileRole === UserRole.SUPER_ADMIN || this.profileRole === UserRole.DEPARTMENT_ADMIN){
      this.landmarkService.fetctActiveLandmarks().then((landmarks) => {
        landmarks.forEach((landmark: any) => {
          L.marker([landmark.latitude, landmark.longitude], { icon: this.getLandmarkIcon() })
            .addTo(this.displayMap!)
            .bindPopup(`<b>${landmark.name}</b><br>${landmark.description}<br>`);
        });
      });
    }
  }
  
  getLandmarkIcon(): L.Icon {
    return L.icon({
      iconUrl: 'assets/png/landmark.png',
      iconSize: [32, 32], // Set the size of the icon
      iconAnchor: [16, 32], // Set the anchor point of the icon
      popupAnchor: [0, -32] // Set the popup anchor relative to the icon
    });
  }
}
