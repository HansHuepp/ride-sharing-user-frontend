import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideProviderComponent } from './ride-provider/ride-provider.component';
import { UserComponent } from './user/user.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  { path: 'ride-provider',  component: RideProviderComponent },
  { path: 'user',           component: UserComponent },
  { path: 'login',          component: UserLoginComponent },
  { path: '',               component: WelcomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
