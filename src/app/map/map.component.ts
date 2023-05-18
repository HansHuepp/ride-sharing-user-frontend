import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: mapboxgl.Map |any;
  style = 'mapbox://styles/mapbox/navigation-day-v1';
  lat = 48.744808;
  lng = 9.107820;
  pickupLocation: string | any  ;
  dropoffLocation: string | any ; //lat and long of San Francisco
  rideDistance: number | any;
  rideDuration: number | any;
  rideDistanceAndDurcationString: string | any;

  constructor() { }

  ngOnInit() {
    // Set mapbox access token
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiaGFuc2h1ZXBwIiwiYSI6ImNsaGx6YWhodjE2bTAzam54MXUyeDVoMnoifQ.t0d6PapiyCFDLYX3uAyYiw';

    this.initializeMap();
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  async displayRoute() {
    // Clear previous route
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    // Split pickup and dropoff locations into lat, lng arrays
    const pickup = await this.getCoordinates(this.pickupLocation);
    const dropoff = await this.getCoordinates(this.dropoffLocation);

    // Fetch route from Mapbox Directions API
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        const route = data.routes[0].geometry;
        this.rideDistance = data.routes[0].distance / 1000; // Convert from meters to kilometers
        this.rideDistance = Math.round(this.rideDistance * 10) / 10;

        this.rideDuration = data.routes[0].duration / 60; // Convert from seconds to minutes
        this.rideDuration = Math.round(this.rideDuration);

        this.rideDistanceAndDurcationString = `Durration: ${this.rideDuration} min / ${this.rideDistance} km`;

        // Add a new source and layer to the map for the route
        this.map.addSource('route', {
          'type': 'geojson',
          'data': route
        });

        this.map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#1db7dd',
            'line-width': 8
          }
        });

        // Fit map to route bounds
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(pickup);
        bounds.extend(dropoff);
        this.map.fitBounds(bounds, { padding: 50 }); // 50 pixel padding around the bounds
      })
      .catch(error => console.error('Error:', error));
  }



  async getCoordinates(address: string): Promise<[number, number]> {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`);
    const data = await response.json();
    return data.features[0].center;
  }
}
