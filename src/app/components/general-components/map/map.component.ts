import { Component, OnInit } from '@angular/core';
import { GoogleMapsService } from '../../../services/google-maps.service';

@Component({
  selector: 'app-map',
  template: `<div id="map-container"><div id="map" style="width: 100%; height: 480px;"></div></div>`,
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  constructor(private googleMapsService: GoogleMapsService) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.googleMapsService
          .loadGoogleMaps('YOUR_API_KEY')
          .then(() => this.initMap())
          .catch((error) => console.error('Error loading Google Maps', error));
        observer.disconnect(); // Detener la observación después de cargar
      }
    });

    observer.observe(document.getElementById('map-container') as HTMLElement);
  }

  initMap(): void {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
}
