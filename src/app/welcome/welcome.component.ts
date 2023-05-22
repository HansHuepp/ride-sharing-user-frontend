import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  constructor(private router: Router) {}
  start() {
    // Implement your login functionality here
    console.log('Login button clicked');
    // Navigate to localhost:4200/user
    this.router.navigate(['/map']);
  }

}
