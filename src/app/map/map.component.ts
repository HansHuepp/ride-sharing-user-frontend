import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';

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
  rideDistanceAndDurcationString: string | any;
  routeFound: boolean = false;

  pickupLocationCoordinates: [number, number] | any;
  dropoffLocationCoordinates: [number, number] | any;
  rideCost: string | any;
  rideDistance: number | any;
  rideDuration: number | any;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    // Set mapbox access token
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoiaGFuc2h1ZXBwIiwiYSI6ImNsaGx6YWhodjE2bTAzam54MXUyeDVoMnoifQ.t0d6PapiyCFDLYX3uAyYiw';

    this.initializeMap();

    this.sharedService.getPickupLocationCoordinates().subscribe(value => {
      this.pickupLocationCoordinates = value;
    });
    this.sharedService.getDropoffLocationCoordinates().subscribe(value => {
      this.dropoffLocationCoordinates = value;
    });
    this.sharedService.getRideCost().subscribe(value => {
      this.rideCost = value;
    });
    this.sharedService.getRideDistance().subscribe(value => {
      this.rideDistance = value;
    });
    this.sharedService.getRideDuration().subscribe(value => {
      this.rideDuration = value;
    });
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 14,
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

    this.sharedService.updatePickupLocationCoordinates(pickup);
    this.sharedService.updateDropoffLocationCoordinates(dropoff);

    // Fetch route from Mapbox Directions API
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        const route = data.routes[0].geometry;
        let myRideDistance = data.routes[0].distance / 1000; // Convert from meters to kilometers
        myRideDistance = Math.round(myRideDistance * 10) / 10;
        this.sharedService.updateRideDistance(myRideDistance);

        let myRideDuration = data.routes[0].duration / 60; // Convert from seconds to minutes
        myRideDuration = Math.round(myRideDuration * 10) / 10;
        this.sharedService.updateRideDuration(myRideDuration);

        this.rideDistanceAndDurcationString = `Durration: ${this.rideDuration} min / ${this.rideDistance} km`;


        let myRideCost = this.rideDistance * 1.5;
        myRideCost = Math.round(myRideCost * 100) / 100;
        this.sharedService.updateRideCost(myRideCost.toString());
        this.rideCost = `Est. max. Cost: ${this.rideCost} €`;

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
        this.routeFoundSwitch();
      })
      .catch(error => console.error('Error:', error));
  }



  async getCoordinates(address: string): Promise<[number, number]> {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`);
    const data = await response.json();
    return data.features[0].center;
  }

  routeFoundSwitch() {
    this.routeFound = !this.routeFound;
  }

  async findRide(pickupLocation: string, dropoffLocation: string): Promise<any> {
    console.log("searching for ride");
    const response = await fetch('https://matching-service.azurewebsites.net/findRide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pickupLocation, dropoffLocation })
    });

    console.log("Response: ", response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Response: ", response);
    return await response.json();
  }

  async startBooking() {
    // Implement your login functionality here
    console.log('Login button clicked');
    this.router.navigate(['/booking']);

    await this.findRide('Location 1', 'Location 2')
    .then(
     data => console.log(data)
    )
    .catch(error => console.error(error));
  }
}
