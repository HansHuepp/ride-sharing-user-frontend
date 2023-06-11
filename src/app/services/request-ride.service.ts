import { Injectable } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class RequestRideService {

  pickupLocationCoordinates: [number, number] | any;
  dropoffLocationCoordinates: [number, number] | any;
  pickupLocationCoordinatesGrid: [number, number] | any;
  dropoffLocationCoordinatesGrid: [number, number] | any;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
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
      rating: 4.5
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
}





