import { Component, ChangeDetectorRef } from '@angular/core';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractFactoryAbi from '../abi-files/contractFactoryAbi.json' ;
import contractAbi from '../abi-files/contractAbi.json' ;
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
declare let window:any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  constructor(private cdr: ChangeDetectorRef, private sharedService: SharedService, private router: Router) { }




  web3: Web3 | undefined | null;
  myAddress: string  = "";
  myBalance: string  = "";

  contractFactoryAddress = '0xC3250dB2106a6b7dc2Dc02D461039b4925E508F2';
  contractFactory: Contract | undefined | any;

  rideContractAddress: string | null | any= null;
  rideContract: Contract | undefined | any;

  rideProviderAcceptedStatus: boolean | null = false;
  rideProviderArrivedAtPickupLocation: boolean = false;
  rideProviderStartedRide: boolean = false;
  rideProviderArrivedAtDropoffLocation: boolean = false;
  rideProviderCanceldRide: boolean = false;

  ngOnInit() {
    this.sharedService.getMyAddress().subscribe(value => {
      this.myAddress = value;
    });
    this.sharedService.getMyBalance().subscribe(value => {
      this.myBalance = value;
    });
    this.sharedService.getWeb3().subscribe(value => {
      this.web3 = value;
    });
  }

  async copyAddress() {
    try {
      await navigator.clipboard.writeText(this.rideContractAddress);
      // Optionally, show a notification or message that copying was successful
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  async onBookRideButtonClick() {
    const rideCost = document.getElementById('rideCost') as HTMLInputElement;

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
      .createContract(party1Signature, this.web3.utils.toWei(rideCost.value.toString(), 'ether'))
      .estimateGas({ from: selectedAddress, value: this.web3.utils.toWei(rideCost.value.toString(), 'ether') });

    this.contractFactory.methods
      .createContract(party1Signature, this.web3.utils.toWei(rideCost.value.toString(), 'ether'))
      .send({ from: selectedAddress, gas: gasEstimate, value: this.web3.utils.toWei(rideCost.value.toString(), 'ether') })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction receipt events:', receipt);
        // find the value newContract in receipt.events
        this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
        console.log('Ride Contract Address:', this.rideContractAddress);

        // Start listening for updates
        console.log('Start listening for updates');
        this.listenForUpdates();

      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
  }

  async setUserReadyToStartRide(){
    const userReadyToStartRideMessage = document.getElementById('userReadyToStartRideMessage') as HTMLInputElement;
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
      .setUserReadyToStartRide(userReadyToStartRideMessage.value)
      .estimateGas({ from: selectedAddress });

    this.contractFactory.methods
      .setUserReadyToStartRide(userReadyToStartRideMessage.value)
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
  async setUserMarkedRideComplete(){
    const userMarkedRideCompleteMessage = document.getElementById('userMarkedRideCompleteMessage') as HTMLInputElement;

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
      .setUserMarkedRideComplete(userMarkedRideCompleteMessage.value)
      .estimateGas({ from: selectedAddress });

    this.contractFactory.methods
      .setUserMarkedRideComplete(userMarkedRideCompleteMessage.value)
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
    // Implement your login functionality here
    console.log('Login button clicked');
    // Navigate to localhost:4200/user
    this.router.navigate(['/map']);
  }




}
