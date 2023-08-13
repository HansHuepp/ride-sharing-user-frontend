import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../services/shared.service';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractAbi from '../abi-files/contractAbi.json' ;

@Component({
  selector: 'app-user-rating',
  templateUrl: './user-rating.component.html',
  styleUrls: ['./user-rating.component.css']
})
export class UserRatingComponent {
  constructor(private sharedService: SharedService, private cdr: ChangeDetectorRef) { }

  @Input() passengerNumber: any;

  passenger:any

  web3: Web3 | any;
  myAddress: string  = "";
  myBalance: string  = "";
  rideContractAddress: string | null | any= null;
  rideContract: Contract | undefined | any;

  dropdownActive = false;

  passengerID = "0";
  stars: number[] = [1, 2, 3, 4, 5];
  seatingPosition = 1;
  startTime = 1;

  selectedValue: number = 0;

  ngOnInit(): void {
    this.sharedService.getPassengers().subscribe((passengers: any) => {
      this.passenger = passengers[this.passengerNumber];
      console.log("Passengers: ",passengers);
      this.passengerID = this.passenger.passengerID;
      this.seatingPosition = this.passenger.seatingPosition;
      this.startTime = this.passenger.startTime;
      console.log("Passenger SP!!!! : ",this.passenger.seatingPosition);
      this.cdr.detectChanges(); // Manually trigger change detection
    });
    this.sharedService.getMyAddress().subscribe(value => {
      this.myAddress = value;
    });
    this.sharedService.getMyBalance().subscribe(value => {
      this.myBalance = value;
    });
    this.sharedService.getWeb3().subscribe(value => {
      this.web3 = value;
    });
    this.sharedService.getRideContractAddress().subscribe(value => {
      this.rideContractAddress = value;
    });
  }

  handleRatingChange(value: number) {
    console.log("Value changed to ur: ", value);
    this.selectedValue = value;
  }

  toggleDropdown() {
    this.dropdownActive = !this.dropdownActive;
  }

  async sendRating() {
    await this.addPassengerRating(0, this.selectedValue);
  }

  async addPassengerRating(passengerId: number, rating: number) {
    console.log('addPassengerRating called with Rating: ', rating);
    if (!this.web3) {
        console.error('MetaMask not connected');
        return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.rideContract = new this.web3.eth.Contract(
        contractAbi as AbiItem[],
        this.rideContractAddress,
    );

    // Call the addPassengerRating function
    const gasEstimate = await this.rideContract.methods
        .addPassengerRating(passengerId, rating)
        .estimateGas({ from: selectedAddress });

    this.rideContract.methods
        .addPassengerRating(passengerId, rating)
        .send({ from: selectedAddress, gas: gasEstimate })
        .on('transactionHash', (hash: string) => {
            console.log('Transaction hash:', hash);
        })
        .on('receipt', (receipt: any) => {
            console.log('Transaction receipt events:', receipt);
        })
        .on('error', (error: Error) => {
            console.error('Error:', error);
        });
}


}
