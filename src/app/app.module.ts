import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingComponent } from './booking/booking.component';
import { RideProviderComponent } from './ride-provider/ride-provider.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingComponent } from './loading/loading.component';

import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './settings/settings.component';
import { RatingComponent } from './rating/rating.component';
import { UserRatingComponent } from './user-rating/user-rating.component';


@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
    RideProviderComponent,
    WelcomeComponent,
    UserLoginComponent,
    MapComponent,
    HeaderComponent,
    FooterComponent,
    LoadingComponent,
    SettingsComponent,
    RatingComponent,
    UserRatingComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
