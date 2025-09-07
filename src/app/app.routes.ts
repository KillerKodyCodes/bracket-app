import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RoundRobinRunComponent } from './round-robin-run/round-robin-run.component';

export const routes: Routes = [
  {
    title: 'Home',
    component: HomeComponent,
    path: ''
  },
  {
    title: 'Round Robin',
    component: RoundRobinRunComponent,
    path: 'round-robin/run',
  }
];
