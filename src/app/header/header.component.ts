import { Component } from '@angular/core';
import Web3 from 'web3';
import { SharedService } from '../services/shared.service';
declare let window:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {

  constructor(private sharedService: SharedService) { }

  web3: Web3 | undefined | null;
  myAddress: string  = "";
  myAddressShort: string = "";
  myBalance: string = "";
  showBurgerMenu = false;


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


  toggleBurgerMenu() {
    this.showBurgerMenu = !this.showBurgerMenu;
  }

  async connectMetaMask() {
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
      this.myAddressShort = this.myAddress.slice(0, 4) + '...' + this.myAddress.slice(-4);


      console.log('Selected address:', this.myAddress);

      // Get the account balance
      const balance = await this.web3.eth.getBalance(this.myAddress);
      this.myBalance = this.web3.utils.fromWei(balance, 'ether');
      this.myBalance = (parseFloat(this.myBalance) * 1678).toFixed(2);


    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      alert('Error connecting to MetaMask. Please check the console for details.');
    }
  }

}
