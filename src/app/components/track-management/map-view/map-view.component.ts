import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Control, Map} from "leaflet";
import * as L from "leaflet";

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss'],
})
export class MapViewComponent implements OnInit {

  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  showModal: boolean = false;
  public displayMap?: Map;
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

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
    this.initMap();
  }

  cancel() {
    return this.modalCtrl.dismiss();
  }

  confirm() {
    return this.modalCtrl.dismiss();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  private initMap(): void {
    this.displayMap = L.map('map', {
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
    // this.loadKarnatakaGeoJSON();
    L.marker([this.latitude, this.longitude], {
      icon: this.getElephantIcon()
    }).addTo(this.displayMap);

    
    // zoom controls position
    this.displayMap.addControl(new Control.Zoom({position: 'bottomright'}));


    this.displayMap.addControl(L.control.locate(this.locateOptions));

    setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1000);
    this.displayMap.setView([this.latitude, this.longitude], 8);
  }

  getElephantIcon(): any {
    // Define and return a custom elephant icon
    return L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4081/4081947.png', // Provide the path to your custom elephant icon
      iconSize: [32, 32], // Set the size of the icon
      iconAnchor: [16, 16], // Set the anchor point of the icon
    });
  }

}
