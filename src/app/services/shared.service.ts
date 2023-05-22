import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private myAddress = new BehaviorSubject<string>("");
  private myBalance = new BehaviorSubject<string>("");
  private web3 = new BehaviorSubject<Web3 | null>(null);

  private pickupLocationCoordinates = new BehaviorSubject<[number, number] | any>(null);
  private dropoffLocationCoordinates = new BehaviorSubject<[number, number] | any>(null);
  private rideCost = new BehaviorSubject<string>("");
  private rideDistance = new BehaviorSubject<number | null>(null);
  private rideDuration = new BehaviorSubject<number | null>(null);

  getPickupLocationCoordinates() {
    return this.pickupLocationCoordinates.asObservable();
  }

  updatePickupLocationCoordinates(newValue: [number, number] | any) {
    this.pickupLocationCoordinates.next(newValue);
  }

  getDropoffLocationCoordinates() {
    return this.dropoffLocationCoordinates.asObservable();
  }

  updateDropoffLocationCoordinates(newValue: [number, number] | any) {
    this.dropoffLocationCoordinates.next(newValue);
  }

  getRideCost() {
    return this.rideCost.asObservable();
  }

  updateRideCost(newValue: string) {
    this.rideCost.next(newValue);
  }

  getRideDistance() {
    return this.rideDistance.asObservable();
  }

  updateRideDistance(newValue: number | null) {
    this.rideDistance.next(newValue);
  }

  getRideDuration() {
    return this.rideDuration.asObservable();
  }

  updateRideDuration(newValue: number | null) {
    this.rideDuration.next(newValue);
  }

  getMyAddress() {
    return this.myAddress.asObservable();
  }

  updateMyAddress(newValue: string) {
    this.myAddress.next(newValue);
  }

  getMyBalance() {
    return this.myBalance.asObservable();
  }

  updateMyBalance(newValue: string) {
    this.myBalance.next(newValue);
  }

  getWeb3() {
    return this.web3.asObservable();
  }

  updateWeb3(newValue: Web3) {
    this.web3.next(newValue);
  }

}

