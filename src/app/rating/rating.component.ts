import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})

export class RatingComponent implements OnInit {

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;

  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  handleClick(star: number) {
    this.selectedValue = star;
  }

  submitRating() {
    this.ratingClick.emit(this.selectedValue);
  }
}
