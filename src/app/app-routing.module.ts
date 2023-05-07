import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RideProviderComponent } from './ride-provider/ride-provider.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: 'ride-provider', component: RideProviderComponent },
  { path: 'user',        component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
