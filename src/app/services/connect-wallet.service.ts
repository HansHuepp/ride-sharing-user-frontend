import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { SharedService } from './shared.service';
declare let window:any;

@Injectable({
  providedIn: 'root'
})
export class ConnectWalletService {

  constructor(private sharedService: SharedService) { }

  web3: Web3 | undefined | null;
  myAddress: string  = "";
  myAddressShort: string = "";
  myBalance: string = "";


  async connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Ethereum wallet extension.');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.web3 = new Web3(window.ethereum);
      this.sharedService.updateWeb3(this.web3);
      console.log('MetaMask connected');

      // Get the selected account address
      const accounts = await this.web3.eth.getAccounts();
      const address = accounts[0];
      this.sharedService.updateMyAddress(address);
      this.myAddressShort = address.slice(0, 4) + '...' + address.slice(-4);
      this.sharedService.updateMyAddressShort(this.myAddressShort);


      // Get the account balance
      const balance = await this.web3.eth.getBalance(address);
      this.myBalance = this.web3.utils.fromWei(balance, 'ether');
      this.myBalance = (parseFloat(this.myBalance) * 1678).toFixed(2);
      this.sharedService.updateMyBalance(this.myBalance);


    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Error connecting to MetaMask. Please check the console for details.');
    }
  }


}
