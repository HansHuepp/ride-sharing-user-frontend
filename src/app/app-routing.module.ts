import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideProviderComponent } from './ride-provider/ride-provider.component';
import { UserComponent } from './user/user.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: 'ride-provider',  component: RideProviderComponent },
  { path: 'booking',           component: UserComponent },
  { path: 'login',          component: UserLoginComponent },
  { path: '',               component: WelcomeComponent },
  { path: 'map',            component: MapComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
