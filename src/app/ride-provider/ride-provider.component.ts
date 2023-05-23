import { Component } from '@angular/core';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractAbi from '../abi-files/contractAbi.json' ;
declare let window:any;

@Component({
  selector: 'app-ride-provider',
  templateUrl: './ride-provider.component.html',
  styleUrls: ['./ride-provider.component.css']
})
export class RideProviderComponent {

  web3: Web3 | undefined;
  contract: Contract | undefined | any;

  myAddress: string | null = null;
  myBalance: string | null = null;
  rideContractAddress: string | null = null;

  userReadyToStartRid: boolean = false;
  userMarkedRideComplete: boolean = false;
  userCanceldRide: boolean = false;

  async connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Ethereum wallet extension.');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.web3 = new Web3(window.ethereum);
      console.log('MetaMask connected');

      // Get the selected account address
      const accounts = await this.web3.eth.getAccounts();
      this.myAddress = accounts[0];
      console.log('Selected address:', this.myAddress);

      // Get the account balance
      const balance = await this.web3.eth.getBalance(this.myAddress);
      this.myBalance = this.web3.utils.fromWei(balance, 'ether');

      // Update the UI with wallet information
      const addressElement:any = document.getElementById('address');
      addressElement.innerText = this.myAddress;

      const balanceElement:any = document.getElementById('balance');
      balanceElement.innerText = this.myBalance + ' ETH';



    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Error connecting to MetaMask. Please check the console for details.');
    }
  }

  onLoginButtonClick() {
    console.log('Button clicked!');
    this.connectMetaMask();
  }

  async onSignRideButtonClick() {
    const contractID = document.getElementById('contractID') as HTMLInputElement;
    this.rideContractAddress = contractID.value;

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID.value,
    );

    const contractBalance = await this.web3.eth.getBalance(contractID.value);
    console.log('Contract balance:', this.web3.utils.fromWei(contractBalance, 'ether'));
    console.log('Contract balance2:', contractBalance);
    // Call the createContract function
    const party2Signature = '0x60a7c6066628a615d200e91db865c562c84685fa5817a9defd4b57694604db1b';
    const gasEstimate = await this.contract.methods
      .signContract(party2Signature)
      .estimateGas({ from: selectedAddress });

    this.contract.methods
      .signContract(party2Signature)
      .send({ from: selectedAddress, gas: gasEstimate })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction receipt events:', receipt);
        // find the value newContract in receipt.events
        console.log('Start listening for updates');
        this.listenForUpdates();
      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
  }

  async setRideProviderAcceptedStatus() {
    const contractID = document.getElementById('contractID') as HTMLInputElement;
    const rideProviderAcceptedStatusMessage = document.getElementById('rideProviderAcceptedStatusMessage') as HTMLInputElement;

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID.value,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderAcceptedStatus(rideProviderAcceptedStatusMessage.value)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderAcceptedStatus(rideProviderAcceptedStatusMessage.value)
      .send({ from: selectedAddress, gas: gasEstimate })
  }

  async setRideProviderArrivedAtPickupLocation(){
    const contractID = document.getElementById('contractID') as HTMLInputElement;
    const rideProviderArrivedAtPickupLocationMessage = document.getElementById('rideProviderArrivedAtPickupLocationMessage') as HTMLInputElement;

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID.value,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderArrivedAtPickupLocation(rideProviderArrivedAtPickupLocationMessage.value)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderArrivedAtPickupLocation(rideProviderArrivedAtPickupLocationMessage.value)
      .send({ from: selectedAddress, gas: gasEstimate })
  }

  async setRideProviderStartedRide(){
    const contractID = document.getElementById('contractID') as HTMLInputElement;
    const rideProviderStartedRideMessage = document.getElementById('rideProviderStartedRideMessage') as HTMLInputElement;

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID.value,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderStartedRide(rideProviderStartedRideMessage.value)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderStartedRide(rideProviderStartedRideMessage.value)
      .send({ from: selectedAddress, gas: gasEstimate })
  }



  async setRideProviderArrivedAtDropoffLocation(){
    const contractID = document.getElementById('contractID') as HTMLInputElement;
    const rideProviderArrivedAtDropoffLocationMessage = document.getElementById('rideProviderArrivedAtDropoffLocationMessage') as HTMLInputElement;

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID.value,
    );

    // Estimate gas for the setRideProviderAcceptedStatus function
    const gasEstimate = await this.contract.methods
      .setRideProviderArrivedAtDropoffLocation(rideProviderArrivedAtDropoffLocationMessage.value)
      .estimateGas({ from: selectedAddress });

    // Call the setRideProviderAcceptedStatus function
    this.contract.methods
      .setRideProviderArrivedAtDropoffLocation(rideProviderArrivedAtDropoffLocationMessage.value)
      .send({ from: selectedAddress, gas: gasEstimate })
  }

  async onClaimDepositButtonClick() {
    const contractID = document.getElementById('contractID') as HTMLInputElement;

    if (!this.web3) {
      console.error('MetaMask not connected');
      return;
    }

    const accounts = await this.web3.eth.getAccounts();
    const selectedAddress = accounts[0];

    // Initialize the contract instance
    this.contract = new this.web3.eth.Contract(
      contractAbi as AbiItem[],
      contractID.value,
    );

    // Estimate gas for the claimDeposit function
    const gasEstimate = await this.contract.methods
      .claimETH()
      .estimateGas({ from: selectedAddress });

    // Call the claimDeposit function
    this.contract.methods
      .claimETH()
      .send({ from: selectedAddress, gas: gasEstimate })
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


    })
    .on('error', console.error);
  }

}
