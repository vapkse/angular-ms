import { CommonModule, JsonPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { DetailsComponent } from './details.component';

@NgModule({
    declarations: [
        DetailsComponent
    ],
    exports: [
        DetailsComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        JsonPipe
    ]
})
export class DetailsModule { }
