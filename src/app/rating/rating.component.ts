import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})

export class RatingComponent {

  constructor(private sharedService: SharedService) { }

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;


  handleClick(star: number) {
    this.selectedValue = star;
    this.sharedService.updateRating(this.selectedValue);
  }
}
