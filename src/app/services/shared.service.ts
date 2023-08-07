import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private myAddress = new BehaviorSubject<string>("");
  private myAddressShort = new BehaviorSubject<string>("");
  private myBalance = new BehaviorSubject<string>("");
  private web3 = new BehaviorSubject<Web3 | null>(null);

  private pickupLocationCoordinates = new BehaviorSubject<[number, number] | any>(null);
  private dropoffLocationCoordinates = new BehaviorSubject<[number, number] | any>(null);
  private pickupLocationCoordinatesGrid = new BehaviorSubject<[number, number] | any>(null);
  private dropoffLocationCoordinatesGrid = new BehaviorSubject<[number, number] | any>(null);
  private rideCost = new BehaviorSubject<string>("");
  private rideDistance = new BehaviorSubject<number | null>(null);
  private rideDuration = new BehaviorSubject<number | null>(null);

  private auctionResult = new BehaviorSubject<string>("");

  private maxUserRating = new BehaviorSubject<number>(4.6);
  private userRating = new BehaviorSubject<number>(4.2);
  private minRating = new BehaviorSubject<number>(4);
  private maxPassengers = new BehaviorSubject<number>(2);
  private maxWaitingTime = new BehaviorSubject<number>(15);
  private minPassengerRating = new BehaviorSubject<number>(4);

  private myPublicKey = new BehaviorSubject<string>("");
  private myPrivateKey = new BehaviorSubject<string>("");
  private sharedPrime = new BehaviorSubject<number>(0);
  private sharedGenerator = new BehaviorSubject<number>(0);
  private sharedSecret = new BehaviorSubject<string>("");
  private vehiclePublicKey = new BehaviorSubject<string>("");

  private rideContractAddress = new BehaviorSubject<string | null | any>(null);

  private passengers = new BehaviorSubject<Object[]>([]);

  private rating = new BehaviorSubject<number>(0);

  getRating() {
    return this.rating.asObservable();
  }
  updateRating(newValue: number) {
    this.rating.next(newValue);
  }

  getRideContractAddress() {
    return this.rideContractAddress.asObservable();
  }

  updateRideContractAddress(newValue: string) {
    this.rideContractAddress.next(newValue);
  }

  getPassengers() {
    return this.passengers.asObservable();
  }

  updatePassengers(newValue: Object[]) {
    this.passengers.next(newValue);
  }

  getMinPassengerRating() {
    return this.minPassengerRating.asObservable();
  }

  updateMinPassengerRating(newValue: number) {
    this.minPassengerRating.next(newValue);
  }

  getVehiclePublicKey() {
    return this.vehiclePublicKey.asObservable();
  }

  updateVehiclePublicKey(newValue: string) {
    this.vehiclePublicKey.next(newValue);
  }

  getSharedPrime() {
    return this.sharedPrime.asObservable();
  }

  updateSharedPrime(newValue: number) {
    this.sharedPrime.next(newValue);
  }

  getSharedGenerator() {
    return this.sharedGenerator.asObservable();
  }

  updateSharedGenerator(newValue: number) {
    this.sharedGenerator.next(newValue);
  }

  getSharedSecret() {
    return this.sharedSecret.asObservable();
  }

  updateSharedSecret(newValue: string) {
    this.sharedSecret.next(newValue);
  }

  getMyPublicKey() {
    return this.myPublicKey.asObservable();
  }

  updateMyPublicKey(newValue: string) {
    this.myPublicKey.next(newValue);
  }

  getMyPrivateKey() {
    return this.myPrivateKey.asObservable();
  }

  updateMyPrivateKey(newValue: string) {
    this.myPrivateKey.next(newValue);
  }

  getMaxUserRating() {
    return this.maxUserRating.asObservable();
  }

  updateMaxUserRating(newValue: number) {
    this.maxUserRating.next(newValue);
  }

  getUserRating() {
    return this.userRating.asObservable();
  }

  updateUserRating(newValue: number) {
    this.userRating.next(newValue);
  }

  getMinRating() {
    return this.minRating.asObservable();
  }

  updateMinRating(newValue: number) {
    this.minRating.next(newValue);
  }

  getMaxPassengers() {
    return this.maxPassengers.asObservable();
  }

  updateMaxPassengers(newValue: number) {
    this.maxPassengers.next(newValue);
  }

  getMaxWaitingTime() {
    return this.maxWaitingTime.asObservable();
  }

  updateMaxWaitingTime(newValue: number) {
    this.maxWaitingTime.next(newValue);
  }

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

  getPickupLocationCoordinatesGrid() {
    return this.pickupLocationCoordinatesGrid.asObservable();
  }

  updatePickupLocationCoordinatesGrid(newValue: [number, number] | any) {
    this.pickupLocationCoordinatesGrid.next(newValue);
  }

  getDropoffLocationCoordinatesGrid() {
    return this.dropoffLocationCoordinatesGrid.asObservable();
  }

  updateDropoffLocationCoordinatesGrid(newValue: [number, number] | any) {
    this.dropoffLocationCoordinatesGrid.next(newValue);
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

  getMyAddressShort() {
    return this.myAddressShort.asObservable();
  }

  updateMyAddressShort(newValue: string) {
    this.myAddressShort.next(newValue);
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

  getAuctionResult() {
    return this.auctionResult.asObservable();
  }

  updateAuctionResult(newValue: string) {
    this.auctionResult.next(newValue);
  }

}


