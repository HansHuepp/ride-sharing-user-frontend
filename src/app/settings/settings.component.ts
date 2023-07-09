import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private sharedService: SharedService) { }

  maxUserRating: number = 0;
  userRating: number = 0;
  minRating: number = 0;
  maxPassengers: number = 0;
  maxWaitingTime: number = 5;

  async ngOnInit() {
    this.sharedService.getMaxUserRating().subscribe(value => {
      this.maxUserRating = value;
    });
    this.sharedService.getUserRating().subscribe(value => {
      this.userRating = value;
    });
    this.sharedService.getMinRating().subscribe(value => {
      this.minRating = value;
    });
    this.sharedService.getMaxPassengers().subscribe(value => {
      this.maxPassengers = value;
    });
    this.sharedService.getMaxWaitingTime().subscribe(value => {
      this.maxWaitingTime = value;
    });
  }

  updateMaxUserRating() {
    this.sharedService.updateMaxUserRating(this.maxUserRating);
  }

  updateUserRating() {
    this.sharedService.updateUserRating(this.userRating);
  }

  updateMinRating() {
    this.sharedService.updateMinRating(this.minRating);
  }

  updateMaxPassengers() {
    this.sharedService.updateMaxPassengers(this.maxPassengers);
  }

  updateMaxWaitingTime() {
    this.sharedService.updateMaxWaitingTime(this.maxWaitingTime);
  }

}
