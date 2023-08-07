import { Component, Input } from '@angular/core';
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
  constructor(private sharedService: SharedService) { }

  @Input() passengerNumber: any;

  passenger:any

  web3: Web3 | any;
  myAddress: string  = "";
  myBalance: string  = "";
  rideContractAddress: string | null | any= null;
  rideContract: Contract | undefined | any;

  dropdownActive = true;

  stars: number[] = [1, 2, 3, 4, 5];
  seatingPosition = 1;
  startTime = "10:00";

  ngOnInit(): void {
    this.sharedService.getPassengers().subscribe((passengers: any) => {
      this.passenger = passengers[this.passengerNumber];
      console.log("Passengers: ",passengers);
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
    }
    );

  }




  selectedValue: number = 0;

  handleClick(star: number) {
    this.selectedValue = star;
  }

  toggleDropdown() {
    this.dropdownActive = !this.dropdownActive;
  }

  async sendRating() {
    await this.addPassengerRating(0, 5);
  }

  async addPassengerRating(passengerId: number, rating: number) {
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
