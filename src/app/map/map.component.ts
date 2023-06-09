import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from "rxjs";
import { catchError, tap } from 'rxjs/operators';

interface MapboxDirectionsResponse {
  routes: Route[];
}

interface Route {
  geometry: any;
  distance: number;
  duration: number;
}


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/navigation-day-v1';
  lat = 48.7725055;
  lng = 9.1661194;
  pickupLocation = '';
  dropoffLocation = '';
  rideDistanceAndDurcationString = '';
  routeFound = false;

  pickupLocationCoordinates!: [number, number];
  dropoffLocationCoordinates!: [number, number];
  rideCost = '';
  rideDistance: any;
  rideDuration: number | null = 0;
  auctionPrice = '';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private sharedService: SharedService, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    (mapboxgl as typeof mapboxgl).accessToken = 'pk.eyJ1IjoiaGFuc2h1ZXBwIiwiYSI6ImNsaGx6YWhodjE2bTAzam54MXUyeDVoMnoifQ.t0d6PapiyCFDLYX3uAyYiw';
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
    this.sharedService.getAuctionResult().subscribe(value => {
      this.auctionPrice = value;
    });
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 14,
      center: [this.lng, this.lat]
    });

    this.map.addControl(new mapboxgl.NavigationControl());
  }

  async getPickupLocation(pickupLocation: string) {
    if(pickupLocation !== "Current Location") return this.getCoordinates(pickupLocation);
    console.log("Current location: ", this.lat, this.lng);
    return this.getCurrentLocation();
  }

  async getCoordinates(address: string): Promise<[number, number]> {
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${(mapboxgl as typeof mapboxgl).accessToken}`);
    const data = await response.json();
    return data.features[0].center;
  }

  async displayRoute() {
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    const pickup = await this.getPickupLocation(this.pickupLocation);
    const dropoff = await this.getCoordinates(this.dropoffLocation);

    console.log("Pickup: ", pickup);
    console.log("Dropoff: ", dropoff);

    this.sharedService.updatePickupLocationCoordinates(pickup);
    this.sharedService.updateDropoffLocationCoordinates(dropoff);

    this.http.get<MapboxDirectionsResponse>(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickup[0]},${pickup[1]};${dropoff[0]},${dropoff[1]}?geometries=geojson&access_token=${(mapboxgl as typeof mapboxgl).accessToken}`)
    .subscribe(data => {
        const route = data.routes[0].geometry;

        const myRideDistance = this.calculateDistance(data.routes[0].distance);
        this.sharedService.updateRideDistance(myRideDistance);

        const myRideDuration = this.calculateDuration(data.routes[0].duration);
        this.sharedService.updateRideDuration(myRideDuration);

        this.rideDistanceAndDurcationString = `Duration: ${this.rideDuration} min / ${this.rideDistance} km`;
        console.log("Ride distance: ", this.rideDistance);

        const myRideCost = this.calculateCost(this.rideDistance);
        this.sharedService.updateRideCost(myRideCost);
        this.rideCost = `Est. max. Cost: ${this.rideCost} €`;

        this.addRouteToMap(route);

        this.fitMapToBounds(pickup, dropoff);

        this.routeFoundSwitch();
    });
}

calculateDistance(distanceInMeters: number): number {
    let distanceInKilometers = distanceInMeters / 1000;
    return Math.round(distanceInKilometers * 10) / 10;
}

calculateDuration(durationInSeconds: number): number {
    let durationInMinutes = durationInSeconds / 60;
    return Math.round(durationInMinutes * 10) / 10;
}

calculateCost(distance: number): string {
    let cost = distance * 1.5;
    return (Math.round(cost * 100) / 100).toString();
}

routeFoundSwitch() {
  this.routeFound = !this.routeFound;
}

async startBooking() {
  console.log('Login button clicked');
  this.router.navigate(['/booking']);
  const auctionResultInWei = 100;
  console.log("Amount in WEI: ", auctionResultInWei);
  this.sharedService.updateAuctionResult(auctionResultInWei.toString());
}


addRouteToMap(route: any) {
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
}

fitMapToBounds(pickup: [number, number], dropoff: [number, number]) {
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(pickup);
    bounds.extend(dropoff);
    this.map.fitBounds(bounds, { padding: 50 });
}


  async getCurrentLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log("Current location: ", this.lat, this.lng);

          this.map.flyTo({
            center: [this.lng, this.lat]
          });

          this.pickupLocation = "Current Location";
          resolve([this.lng, this.lat]);
        }, error => {
          reject(error);
        });
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  }

  findRide(pickupLocation: string, dropoffLocation: string): Observable<any> {
    const body = JSON.stringify({ pickupLocation, dropoffLocation });

    return this.http.post('https://matching-service.azurewebsites.net/findRide', body, this.httpOptions)
    .pipe(
      tap(_ => console.log('found ride')),
      catchError(this.handleError<any>('findRide'))
    );
  }

  getStatus(): Observable<any> {
    return this.http.get('https://matching-service.azurewebsites.net/health', this.httpOptions)
    .pipe(
      tap(_ => console.log('checked status')),
      catchError(this.handleError<any>('getStatus'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
