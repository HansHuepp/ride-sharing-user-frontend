// app.component.ts
import { Component } from '@angular/core';
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  web3: Web3 | undefined;
  myAddress: string | null = null;
  myBalance: string | null = null;

}


