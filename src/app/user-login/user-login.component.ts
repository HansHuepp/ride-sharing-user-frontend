import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {

  ngOnInit() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiaGFuc2h1ZXBwIiwiYSI6ImNsaGx6YWhodjE2bTAzam54MXUyeDVoMnoifQ.t0d6PapiyCFDLYX3uAyYiw';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: [9.107820, 48.744808], // Starting position [lng, lat]
      zoom: 15
    });

    // Add geolocation control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );

    const pickupElement = document.getElementById('pickup');
    const dropoffElement = document.getElementById('dropoff');

    const pickupGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: 'Enter pickup location'

    });
    if (pickupElement) {
      pickupElement.appendChild(pickupGeocoder.onAdd(map));
    }

    const dropoffGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
      placeholder: 'Enter dropoff location'
    });
    if (dropoffElement) {
      dropoffElement.appendChild(dropoffGeocoder.onAdd(map));
    }
  }
}
