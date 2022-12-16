import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { debounceTime, Observable, Subject } from 'rxjs';

import { UserBase } from '../users.service';

@Component({
    selector: 'app-master',
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterComponent {
    @Input()
    public users!: ReadonlyArray<UserBase>;

    @Output()
    public readonly selectUser$: Observable<number | undefined>;

    protected selectUser$$ = new Subject<number | undefined>();

    public constructor() {

        this.selectUser$ = this.selectUser$$.pipe(
            debounceTime(100)
        );
    }
}
