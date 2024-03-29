import { Component, ChangeDetectorRef } from '@angular/core';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractFactoryAbi from '../abi-files/contractFactoryAbi.json' ;
import contractAbi from '../abi-files/contractAbi.json' ;
import { SharedService } from '../services/shared.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RequestRideService } from '../services/request-ride.service';
import { environment} from '../../environments/environment.development';

declare let window:any;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {

  constructor(private requestRide: RequestRideService, private cdr: ChangeDetectorRef, private sharedService: SharedService, private router: Router, private http: HttpClient) { }

  web3: Web3 | any;
  myAddress: string  = "";
  myBalance: string  = "";

  contractFactoryAddress = environment.CONTRACT_FACTORY;
  contractFactory: Contract | undefined | any;

  rideContractAddress: string | null | any= null;
  rideContract: Contract | undefined | any;

  rideId: string = "";
  rideFoundStatus: boolean = false;
  model: string = "";
  estimatedArrivalTime: number = 0;
  passengerCount: number = 0;
  rating: number = 0;
  auctionResult: number = 0;
  auctionWinner: string = "";

  rideSearchStatus: boolean = false;
  rideProviderAcceptedStatus: boolean | null = false;
  rideProviderArrivedAtPickupLocation: boolean = false;
  rideProviderStartedRide: boolean = false;
  rideProviderArrivedAtDropoffLocation: boolean = false;
  rideMarkedComplete: boolean = false;
  rideProviderCanceldRide: boolean = false;
  auctionResultInWai: string = "";

  pickupLocationCoordinates: [number, number] | any;
  dropoffLocationCoordinates: [number, number] | any;
  pickupLocationCoordinatesGrid: [number, number] | any;
  dropoffLocationCoordinatesGrid: [number, number] | any;

  bookingTimer: number = 30;
  interval: any;
  offerExpired: boolean = false;

  userRatingForRide = 0;

  passengers: Object[] = [];

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

    this.sharedService.getRideContractAddress().subscribe(value => {
      this.rideContractAddress = value;
    });


    await this.findRide();
  }

  handleRatingChange(value: number) {
    this.userRatingForRide = value;
    console.log("User Rating: ", this.userRatingForRide);
  }

  async findRide() {
    const coordinates = {
      pickupLocationCoordinates: this.pickupLocationCoordinates,
      dropoffLocationCoordinates: this.dropoffLocationCoordinates,
    }
    this.requestRide.toGridRideLocation(coordinates);
    console.log('Coordinates:', coordinates);
    await this.requestRide.requestRide().then((rideId: string) => {
      console.log('Ride ID:', rideId);
      this.rideId = rideId;
      setTimeout(async () => {
        const respone = await this.requestRide.getRideRequest(rideId);
        console.log("Response: ", JSON.stringify(respone));
        this.rideSearchStatus = true
        this.cdr.detectChanges();
        if (!respone.bid)
        {
          console.log("No ride found");
          this.rideFoundStatus = false;
          this.cdr.detectChanges();
          return;
        }
        else
        {
          console.log("Ride found");
          this.rideFoundStatus = true;
          this.runCountdown();
          this.model = respone.bid.model;
          this.estimatedArrivalTime = respone.bid.estimatedArrivalTime;
          this.passengerCount = respone.bid.passengerCount;
          this.rating = respone.bid.rating;
          this.auctionWinner = respone.rideRequest.auctionWinner;
          this.auctionResult = respone.rideRequest.winningBid;
          console.log("Auction Result: ", this.auctionResult);
          this.auctionResultInWai = this.convertEurosToWei(this.auctionResult);
          console.log("Auction Result in Wei: ", this.auctionResultInWai);
          this.cdr.detectChanges();
          this.sharedService.updateSharedPrime(respone.rideRequest.sharedPrime);
          this.sharedService.updateSharedGenerator(respone.rideRequest.sharedGenerator);
          this.sharedService.updateVehiclePublicKey(respone.bid.vehiclePublicKey);


        }
      }, 40000)});
  }


  async copyAddress() {
    try {
      await navigator.clipboard.writeText(this.rideContractAddress);
      // Optionally, show a notification or message that copying was successful
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  async runCountdown() {
    this.interval = setInterval(() => {
      this.bookingTimer--;
      if (this.bookingTimer === 0) {
        clearInterval(this.interval);
        this.offerExpired = true;
      }
    }, 1000);
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
    const gasEstimate = await this.contractFactory.methods
      .createContract( this.auctionResultInWai)
      .estimateGas({ from: selectedAddress, value: this.auctionResultInWai });

    this.contractFactory.methods
      .createContract( this.auctionResultInWai)
      .send({ from: selectedAddress, gas: gasEstimate, value: this.auctionResultInWai })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', async (receipt: any) => {
        console.log('Transaction receipt events:', receipt);
        // find the value newContract in receipt.events
        const myrideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
        this.sharedService.updateRideContractAddress(myrideContractAddress);
        console.log('Ride Contract Address:', this.rideContractAddress);
        console.log('sending Contract Address to backend');
        //this.sendContractAddress(this.rideContractAddress)

        // Start listening for updates
        console.log('Start listening for updates');
        this.listenForUpdates();
        console.log('Set contract address', this.rideId);
        await this.requestRide.setContractAddress(this.rideId ,this.rideContractAddress);

      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
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

  async rateRide(){
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
      .setRideRating(this.userRatingForRide)
      .estimateGas({ from: selectedAddress });

    this.contractFactory.methods
      .setRideRating(this.userRatingForRide)
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

  async getPassengers(number: number) {
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

    try {
        const passengers = await this.rideContract.methods
            .passengers(number)
            .call({ from: selectedAddress });

        //push Object to array shared
        this.passengers.push(passengers);
        console.log('Passenger list:', passengers);
    } catch (error) {
        console.error('Error:', error);
    }
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
    .on('data', async (event: any) => {
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
        await this.getPassengers(0);
        await this.getPassengers(1);
        console.log("Passengers: !!!Hans ", this.passengers);
        this.sharedService.updatePassengers(this.passengers);
        this.cdr.detectChanges();
      }

    })
    .on('error', console.error);
  }

  convertEurosToWei(amountInEuros: number){
    const etherPriceInEuros = 1706;
    const amountInEther = amountInEuros / etherPriceInEuros;
    const amountInWei = this.web3.utils.toWei(amountInEther.toString(), 'ether');
    return amountInWei;
  }

  cancelBooking() {
    this.router.navigate(['/map']);
  }

  bookNewRide() {
    this.router.navigate(['/']);
  }

  calculateSharedSecret() {
    const publicKey: any = this.sharedService.getMyPublicKey();
    const privateKey: any = this.sharedService.getMyPrivateKey();
    const sharedPrime: any = this.sharedService.getSharedPrime();
    const sharedGenerator: any = this.sharedService.getSharedGenerator();

   // console.log('Shared secret:', sharedSecret);
  }


}
