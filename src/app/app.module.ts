import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DetailsModule } from './details/details.module';
import { MasterModule } from './master/master.module';
import { MasterDetailsService } from './master-details.service';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        DetailsModule,
        HttpClientModule,
        MasterModule,
        RouterModule.forRoot([]),
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    providers: [
        MasterDetailsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
