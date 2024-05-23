import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject, shareReplay, switchMap } from 'rxjs';

import { User, UserService } from './users.service';

@Injectable()
export class DetailService {
    public selectUserId$ = new ReplaySubject<number | undefined>(1);
    public selectedUser$: Observable<User | undefined>;

    private userCache = new Map<number, Observable<User | undefined>>;

    public constructor(private userService: UserService) {
        this.selectedUser$ = this.selectUserId$.pipe(
            switchMap(selectUserId => selectUserId ? this.getUser$(selectUserId) : of(undefined)),
            shareReplay({ bufferSize: 1, refCount: true })
        );
    }

    private getUser$(id: number): Observable<User | undefined> {
        let cached$ = this.userCache.get(id);
        if (!cached$) {
            this.userCache.set(id, cached$ = this.userService.getUser$(id).pipe(
                shareReplay({ bufferSize: 1, refCount: true })
            ));
        }
        return cached$;
    }
}
