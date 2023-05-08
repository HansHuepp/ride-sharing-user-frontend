import { Component } from '@angular/core';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractAbi from '../abi-files/contractAbi.json' ; // Make sure to import the correct ABI JSON file
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
        this.rideContractAddress = receipt.events.ContractCreated.returnValues.newContract;
      })

      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
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



}
