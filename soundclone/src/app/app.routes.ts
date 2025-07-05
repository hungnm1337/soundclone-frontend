import { Routes } from '@angular/router';
import { HomepageComponent } from './Views/common.component/homepage/homepage.component';
import { ErrorComponent } from './Views/common.component/error/error.component';
import { SignInComponent } from './Views/common.component/sign-in/sign-in.component';
import { SignUpComponent } from './Views/common.component/sign-up/sign-up.component';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomepageComponent},
  {path: 'login', component: SignInComponent},
  {path: 'register', component: SignUpComponent},
  {path: '**', component: ErrorComponent},

];
