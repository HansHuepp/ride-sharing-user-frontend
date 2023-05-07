// app.component.ts
import { Component } from '@angular/core';
import Web3 from 'web3';
import  Contract from 'web3'
import { AbiItem } from 'web3-utils';
import contractFactoryAbi from './abi-files/contractFactoryAbi.json' ; // Make sure to import the correct ABI JSON file
declare let window:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  web3: Web3 | undefined;
  contractFactoryAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
  contractFactory: Contract | undefined | any;;

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
      const selectedAddress = accounts[0];
      console.log('Selected address:', selectedAddress);

      // Get the account balance
      const balance = await this.web3.eth.getBalance(selectedAddress);
      const etherBalance = this.web3.utils.fromWei(balance, 'ether');
      console.log('Account balance:', etherBalance, 'ETH');

      // Update the UI with wallet information
      const addressElement:any = document.getElementById('address');
      addressElement.innerText = selectedAddress;

      const balanceElement:any = document.getElementById('balance');
      balanceElement.innerText = etherBalance + ' ETH';



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
    const party1Signature = '0xe382c6fbda9a7cafb4825dd04c2d5c10055da82c1a9dfcf761f6ccaffc7b2c1b'; // Replace with the correct party1Signature bytes32 value
    const gasEstimate = await this.contractFactory.methods
      .createContract(party1Signature)
      .estimateGas({ from: selectedAddress });

    this.contractFactory.methods
      .createContract(party1Signature)
      .send({ from: selectedAddress, gas: gasEstimate })
      .on('transactionHash', (hash: string) => {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', (receipt: any) => {
        console.log('Transaction receipt:', receipt);
      })
      .on('error', (error: Error) => {
        console.error('Error:', error);
      });
  }
}

