import { Routes } from '@angular/router';

import { NoUserComponent } from './no-user/no-user.component';

export const routes: Routes = [
    { path: '', component: NoUserComponent },
    { path: ':id', loadComponent: () => import('./details/details.component').then(c => c.DetailsComponent) },
    { path: '**', redirectTo: '' }
];
