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
    public userList!: ReadonlyArray<UserBase>;

    @Input()
    public selectedUserId?: number | null;

    @Output()
    public readonly selectedUserId$: Observable<number | undefined>;

    protected selectUserId$ = new Subject<number | undefined>();

    public constructor() {

        this.selectedUserId$ = this.selectUserId$.pipe(
            debounceTime(100)
        );
    }
}
