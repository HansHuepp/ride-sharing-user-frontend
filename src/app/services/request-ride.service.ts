import { Injectable } from '@angular/core';
import * as h3 from "h3-js";
import { SharedService } from '../services/shared.service';
import * as elliptic from 'elliptic';

@Injectable({
  providedIn: 'root'
})
export class RequestRideService {

  pickupLocationCoordinates: [number, number] | any;
  dropoffLocationCoordinates: [number, number] | any;
  pickupLocationCoordinatesGrid: [number, number] | any;
  dropoffLocationCoordinatesGrid: [number, number] | any;
  myPublicKey: string = "";

  maxUserRating:number = 0;
  minRating:number = 0;
  maxPassengers:number = 0;
  maxWaitingTime:number = 0;
  minPassengerRating:number = 0;

  constructor(private sharedService: SharedService) {
    this.sharedService.getPickupLocationCoordinates().subscribe(value => {
      this.pickupLocationCoordinates = value;
    });
    this.sharedService.getDropoffLocationCoordinates().subscribe(value => {
      this.dropoffLocationCoordinates = value;
    });
    this.sharedService.getPickupLocationCoordinatesGrid().subscribe(value => {
      this.pickupLocationCoordinatesGrid = value;
    });
    this.sharedService.getDropoffLocationCoordinatesGrid().subscribe(value => {
      this.dropoffLocationCoordinatesGrid = value;
    });
    this.sharedService.getMyPublicKey().subscribe(value => {
      this.myPublicKey = value;
    });
    this.sharedService.getMaxUserRating().subscribe(value => {
      this.maxUserRating = value;
    });
    this.sharedService.getMinRating().subscribe(value => {
      this.minRating = value;
    });
    this.sharedService.getMaxPassengers().subscribe(value => {
      this.maxPassengers = value;
    });
    this.sharedService.getMaxWaitingTime().subscribe(value => {
      this.maxWaitingTime = value;
    });
    this.sharedService.getMinPassengerRating().subscribe(value => {
      this.minPassengerRating = value;
    });


  }





  async  toGridRideLocation(rideLocation: any, gridSize: number = 0.01): Promise<any> {
    const gridPickupLatitude = Math.round(rideLocation.pickupLocationCoordinates[0] / gridSize) * gridSize;
    const gridPickupLongitude = Math.round(rideLocation.pickupLocationCoordinates[1] / gridSize) * gridSize;

    const gridDropoffLatitude = Math.round(rideLocation.dropoffLocationCoordinates[0] / gridSize) * gridSize;
    const gridDropoffLongitude = Math.round(rideLocation.dropoffLocationCoordinates[1] / gridSize) * gridSize;

    this.sharedService.updatePickupLocationCoordinatesGrid([gridPickupLatitude, gridPickupLongitude]);
    this.sharedService.updateDropoffLocationCoordinatesGrid([gridDropoffLatitude, gridDropoffLongitude]);
    this.pickupLocationCoordinatesGrid = [gridPickupLatitude, gridPickupLongitude];
    this.dropoffLocationCoordinatesGrid = [gridDropoffLatitude, gridDropoffLongitude];
  };

  localPickupGrid: any = null;
  localDropoffGrid: any = null;



  async requestRide() {
    this.generateKeyPair();
    const rideRequestBody: any = {
      userId: '12345',
      pickupLocation: {
        type: 'Point',
        coordinates: this.pickupLocationCoordinatesGrid
      },
      dropoffLocation: {
        type: 'Point',
        coordinates: this.dropoffLocationCoordinatesGrid
      },
      gridLocation: this.getGridLocation(this.pickupLocationCoordinatesGrid, 10),
      rating: this.maxUserRating,
      userPublicKey: this.myPublicKey,
      maxUserRating: this.maxUserRating,
      minRating: this.minRating,
      maxPassengers: this.maxPassengers,
      maxWaitingTime: this.maxWaitingTime,
      minPassengerRating: this.minPassengerRating
    };

    const response = await fetch('http://localhost:8080/requestRide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
        body: JSON.stringify(rideRequestBody),
    })
    console.log("This is the respone",response)
    return await response.json();
  }

  async getRideRequest(rideId: string) {
    const response = await fetch(`http://localhost:8080/rideRequest/${rideId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log(response)
    return await response.json();
}


  async setContractAddress(rideId: string, contractAddress: string) {
    console.log("This is URL is called", `http://localhost:8080/setContractAddress/${rideId}/${contractAddress}`)
    const response = await fetch(`http://localhost:8080/setContractAddress/${rideId}/${contractAddress}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response;
  }

  getGridLocation(coordinates: [number, number], resolution: number) {
    return h3.latLngToCell(coordinates[0],coordinates[1],resolution);
  }



  generateKeyPair(): void {
    const ec = new elliptic.ec('secp256k1');
    const keyPair = ec.genKeyPair();

    const publicKey = keyPair.getPublic('hex');
    const privateKey = keyPair.getPrivate('hex');
    this.sharedService.updateMyPublicKey(publicKey);
    this.sharedService.updateMyPrivateKey(privateKey);
  }

}





