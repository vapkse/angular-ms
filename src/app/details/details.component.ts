import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay, switchMap } from 'rxjs';

import { User, UserService } from '../users.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AsyncPipe
    ]
})
export class DetailsComponent {
    protected user$: Observable<User | undefined>;

    private route = inject(ActivatedRoute);
    private userService = inject(UserService);

    public constructor() {
        this.user$ = this.route.params.pipe(
            map(params => params['id'] as string),
            switchMap(id => this.userService.getUser$(+id)),
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }
}
