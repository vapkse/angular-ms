import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { MasterComponent } from './master/master.component';
import { NoUserComponent } from './no-user/no-user.component';

export const routes: Routes = [
    { path: '', component: NoUserComponent },
    { path: ':id', component: DetailsComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MasterComponent,
        RouterModule.forRoot(routes),
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
