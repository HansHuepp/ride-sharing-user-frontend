import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  public rating: number;

  @Output() ratingChange = new EventEmitter<number>();

  constructor() {
    this.rating = 0;
  }

  ngOnInit(): void {
  }

  incrementRating(): void {
    if (this.rating < 5) {
      this.rating++;
      this.ratingChange.emit(this.rating);
    }
  }

  decrementRating(): void {
    if (this.rating > 0) {
      this.rating--;
      this.ratingChange.emit(this.rating);
    }
  }
}
