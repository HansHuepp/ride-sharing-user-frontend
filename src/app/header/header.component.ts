import { ConnectWalletService } from '../services/connect-wallet.service';
import { Component } from '@angular/core';
import Web3 from 'web3';
import { SharedService } from '../services/shared.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent {

  constructor(private connectWalletService: ConnectWalletService, private sharedService: SharedService) { }

  web3: Web3 | undefined | null;
  myAddress: string  = "";
  myAddressShort: string = "";
  myBalance: string = "";
  myRating: number = 0;
  showSettings: boolean = false;



  async ngOnInit() {
    this.sharedService.getMyAddress().subscribe(value => {
      this.myAddress = value;
    });
    this.sharedService.getMyAddressShort().subscribe(value => {
      this.myAddressShort = value;
    });
    this.sharedService.getMyBalance().subscribe(value => {
      this.myBalance = value;
    });
    this.sharedService.getWeb3().subscribe(value => {
      this.web3 = value;
    });
    this.sharedService.getMaxUserRating().subscribe(value => {
      this.myRating = value;
    });

    await this.connectWalletService.connectWallet();
  }

  showBurgerMenu = false;

  async connectWallet() {
    await this.connectWalletService.connectWallet();
  }



  toggleBurgerMenu() {
    this.showBurgerMenu = !this.showBurgerMenu;
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }
}
