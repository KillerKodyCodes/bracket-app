import { Routes } from '@angular/router';
import { RoundRobinHomeComponent } from './round-robin-home/round-robin-home.component';
import { RoundRobinRunComponent } from './round-robin-run/round-robin-run.component';

export const routes: Routes = [
  {
    title: 'Round Robin',
    component: RoundRobinHomeComponent,
    path: 'round-robin'
  },
  {
    title: 'Round Robin',
    component: RoundRobinRunComponent,
    path: 'round-robin/run',
  }
];
