import { Component, Input, OnInit } from '@angular/core';
import { Control, Map } from 'leaflet';
import { ExportService } from 'src/app/services/export.service';
import { TrackService } from 'src/app/services/track.service';
import * as L from "leaflet";
import { TrackerData } from 'src/app/models/radio-collar-tracker';
import { TranslateService } from '@ngx-translate/core';
import { ElephantService } from 'src/app/services/elephant.service';
import { ELEPHANT } from 'src/app/models/elephant';

@Component({
  selector: 'app-manage-reports',
  templateUrl: './manage-reports.component.html',
  styleUrls: ['./manage-reports.component.scss'],
})
export class ManageReportsComponent  implements OnInit {
  
  startDate: string = ''; // Start date for filtering
  endDate: string = ''; // End date for filtering
  public tracks: any = [];
  public displayMap?: Map;
  @Input() latitude: number = 12.9716;
  @Input() longitude: number = 77.5946;
  suggestedElephants: ELEPHANT[] = [];

  private karnatakaLayer: L.GeoJSON | undefined;
  private readonly karnatakaBounds: L.LatLngBoundsExpression = [
    [11.5, 74],   // Southwest corner of Karnataka
    [18.5, 78.5]  // Northeast corner of Karnataka
  ];

  locateOptions: Control.LocateOptions = {
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

  constructor(private trackService: TrackService,
              private exportService: ExportService,
              private translateService: TranslateService,
              private elephentService: ElephantService
  ) { }

  ngOnInit() {
    
    this.initMap();
    this.loadElephants();

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    this.startDate = start.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    
    // Set the end date to the current time
    const end = new Date();
    this.endDate = end.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  }

  filterTracksByDate() {
    // Convert start and end dates to proper format (if needed)
    // Then, make a service call to fetch filtered tracks based on dates
    // For demonstration, let's assume you have a service method for this purpose
    this.trackService.fetchAllTracks(this.startDate, this.endDate).then((filteredTracks: any) => {
      this.tracks = filteredTracks;
      this.plotTrackOnMap(this.tracks);
    });
  }

  plotTrackOnMap(trackerData: any[]) {
    // Get the track details by ID
    if (trackerData) {
    

      trackerData.forEach(async (elephant: any) => {
        const status = elephant.stationary ? this.translateService.instant('MOVING') : this.translateService.instant('NOT_MOVING');
        const heard_size_status = elephant.herd_size ? this.translateService.instant('HEARD_SIZE') +" :"+ elephant.herd_size : this.translateService.instant('HEARD_SIZE') +" :"+ this.translateService.instant('NOT_AVAILABLE');
        const marker = L.marker([elephant.latitude, elephant.longitude], {icon: this.getElephantIcon(elephant.herd_size,elephant.stationary)})
          .addTo(this.displayMap!)
          .bindPopup(`${this.convertToIST(elephant.sighting_time)}<br>${elephant.location}<br>${status}<br>${heard_size_status}`);
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

  updateStartDate(event: any) {
    const selectedDate = new Date(event.target.value);
    selectedDate.setHours(0, 0, 0, 0);
    this.startDate = selectedDate.toISOString().split('T')[0];
  }

  updateEndDate(event: any) {
    const selectedDate = new Date(event.target.value);
    selectedDate.setHours(23, 59, 59, 999);
    this.endDate = selectedDate.toISOString().split('T')[0];
  }

  exportAsExcel() {
    this.exportService.exportAsExcelFile(this.tracks, 'track_list');
  }

  private initMap(): void {
    this.displayMap = L.map('map2', {
      center: [this.latitude, this.longitude], // Use provided latitude and longitude
      zoom: 10,
      minZoom: 3,
      zoomControl: false,
      bounceAtZoomLimits: true,
      attributionControl: false
    });

    let googleLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      noWrap: true, // uncomment this if you don't want all countries in line when zoom out the map as the locations are not visible to other repeated maps
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    })


    this.displayMap.addLayer(googleLayer);
    this.loadKarnatakaGeoJSON();
    // // zoom controls position
    this.displayMap.addControl(new Control.Zoom({position: 'bottomright'}));

    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
    // this.displayMap.setView([this.latitude, this.longitude], 8);
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
      this.zoomOutToKar();
  }

  private zoomOutToKar(): void {
    if (this.displayMap) {
      this.displayMap.setView([12.9716, 77.5946], 5);
      this.displayMap.fitBounds(this.karnatakaBounds);
    }
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

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  loadElephants(): void {
    this.elephentService.fetchAllElephants().then((elephants: any[]) => {
      this.suggestedElephants = elephants;
    });
  }


}
