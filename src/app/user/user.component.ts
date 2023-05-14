import { Component } from '@angular/core';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractFactoryAbi from '../abi-files/contractFactoryAbi.json' ;
import contractAbi from '../abi-files/contractAbi.json' ;
declare let window:any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  web3: Web3 | undefined;
  contractFactoryAddress = '0xC1F3a2dfa938f5486dEE4B80E49352A660969592';
  contractFactory: Contract | undefined | any;;

  myAddress: string | null = null;
  myBalance: string | null = null;
  rideContractAddress: string | null | any= null;

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
    const userMarkedRideCompleteMessage = document.getElementById('userReadyToStartRideMessage') as HTMLInputElement;

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

}
