import { Component, ChangeDetectorRef } from '@angular/core';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractFactoryAbi from '../abi-files/contractFactoryAbi.json' ;
import contractAbi from '../abi-files/contractAbi.json' ;
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
declare let window:any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {

  constructor(private cdr: ChangeDetectorRef, private sharedService: SharedService, private router: Router, private http: HttpClient) { }




  web3: Web3 | undefined | null;
  myAddress: string  = "";
  myBalance: string  = "";

  contractFactoryAddress = '0xC3250dB2106a6b7dc2Dc02D461039b4925E508F2';
  contractFactory: Contract | undefined | any;

  rideContractAddress: string | null | any= null;
  rideContract: Contract | undefined | any;

  rideSearchFoundStatus: boolean = false;
  rideProviderAcceptedStatus: boolean | null = false;
  rideProviderArrivedAtPickupLocation: boolean = false;
  rideProviderStartedRide: boolean = false;
  rideProviderArrivedAtDropoffLocation: boolean = false;
  rideMarkedComplete: boolean = false;
  rideProviderCanceldRide: boolean = false;
  auctionResult: string = "";

  async ngOnInit() {
    console.log(this.rideContractAddress);
    this.sharedService.getMyAddress().subscribe(value => {
      this.myAddress = value;
    });
    this.sharedService.getMyBalance().subscribe(value => {
      this.myBalance = value;
    });
    this.sharedService.getWeb3().subscribe(value => {
      this.web3 = value;
    });
    this.sharedService.getAuctionResult().subscribe(value => {
      this.auctionResult = value;
    });

    //call find dummy after 5 seconds
    setTimeout(() => {
      this.findRideDummy();
    }
    , 5000);
  }

  findRideDummy() {
      this.rideSearchFoundStatus = true;
      this.cdr.detectChanges();
  }

  async copyAddress() {
    try {
      await navigator.clipboard.writeText(this.rideContractAddress);
      // Optionally, show a notification or message that copying was successful
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  async bookRide() {

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contractFactory = new this.web3.eth.Contract(
      contractFactoryAbi as AbiItem[],
      this.contractFactoryAddress,
    );

    // Call the createContract function
    const party1Signature = '0xe382c6fbda9a7cafb4825dd04c2d5c10055da82c1a9dfcf761f6ccaffc7b2c1b';
    const gasEstimate = await this.contractFactory.methods
      .createContract(party1Signature, this.auctionResult)
      .estimateGas({ from: selectedAddress, value: this.auctionResult });

    this.contractFactory.methods
      .createContract(party1Signature, this.auctionResult)
      .send({ from: selectedAddress, gas: gasEstimate, value: this.auctionResult })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', async (receipt: any) => {
        console.log('Transaction receipt events:', receipt);
        // find the value newContract in receipt.events
        this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
        console.log('Ride Contract Address:', this.rideContractAddress);
        console.log('sending Contract Address to backend');
        this.sendContractAddress(this.rideContractAddress)

        // Start listening for updates
        console.log('Start listening for updates');
        this.listenForUpdates();

      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
  }

   sendContractAddress(contractAddress:string): void {
    fetch('http://localhost:3000/startRide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contractAddress: contractAddress }),
    })
  }

  async setUserReadyToStartRide(){
    const userReadyToStartRideMessage = "Ready to start ride"
    console.log("Adresse: ",this.rideContractAddress)

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contractFactory = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      this.rideContractAddress,
    );

    // Call the createContract function
    const gasEstimate = await this.contractFactory.methods
      .setUserReadyToStartRide(userReadyToStartRideMessage)
      .estimateGas({ from: selectedAddress });

    this.contractFactory.methods
      .setUserReadyToStartRide(userReadyToStartRideMessage)
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

  async cancelRide(){
    const userCanceldRideMessage = "Ride canceled"
    console.log("Adresse: ",this.rideContractAddress)

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

    // Call the createContract function
    const gasEstimate = await this.rideContract.methods
      .setUserCanceldRide(userCanceldRideMessage)
      .estimateGas({ from: selectedAddress });

    this.rideContract.methods
      .setUserCanceldRide(userCanceldRideMessage)
      .send({ from: selectedAddress, gas: gasEstimate })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction receipt events:', receipt);
        this.cancelBooking();
      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
  }

  async setUserMarkedRideComplete(){
    const userMarkedRideCompleteMessage = "Ride complete";

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contractFactory = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      this.rideContractAddress,
    );

    // Call the createContract function
    const gasEstimate = await this.contractFactory.methods
      .setUserMarkedRideComplete(userMarkedRideCompleteMessage)
      .estimateGas({ from: selectedAddress });

    this.contractFactory.methods
      .setUserMarkedRideComplete(userMarkedRideCompleteMessage)
      .send({ from: selectedAddress, gas: gasEstimate })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction receipt events:', receipt);
        this.rideMarkedComplete = true;
        this.cdr.detectChanges();
      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
  }

  async listenForUpdates() {
    if (!this.web3 || !this.rideContractAddress) {
      console.error('MetaMask not connected or ride contract address not set');
      return;
    }

    // Initialize the contract instance
    const contractInstance = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      this.rideContractAddress,
    );

    // Listen for UpdatePosted events
    contractInstance.events.allEvents()
    .on('data', (event: any) => {
      const functionName = event.returnValues.functionName;
      console.log("Function Name: ", functionName);

      if(functionName == "rideProviderAcceptedStatus"){
        this.rideProviderAcceptedStatus = true;
        this.cdr.detectChanges();
      }

      if(functionName == "rideProviderArrivedAtPickupLocation"){
        this.rideProviderAcceptedStatus = false;
        this.rideProviderArrivedAtPickupLocation = true;
        this.cdr.detectChanges();
      }

      if(functionName == "rideProviderStartedRide"){
        this.rideProviderArrivedAtPickupLocation = false;
        this.rideProviderStartedRide = true;
        this.cdr.detectChanges();
      }

      if(functionName == "rideProviderArrivedAtDropoffLocation"){
        this.rideProviderStartedRide = false;
        this.rideProviderArrivedAtDropoffLocation = true;
        this.cdr.detectChanges();
      }

    })
    .on('error', console.error);
  }

  cancelBooking() {
    this.router.navigate(['/map']);
  }

  bookNewRide() {
    this.router.navigate(['/']);
  }
}
