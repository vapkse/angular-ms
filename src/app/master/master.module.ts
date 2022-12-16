import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { MasterComponent } from './master.component';

@NgModule({
    declarations: [
        MasterComponent
    ],
    imports: [
        CommonModule,
        MatListModule
    ],
    exports: [
        MasterComponent
    ]
})
export class MasterModule { }
