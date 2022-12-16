import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatestWith, map, Observable, of, ReplaySubject, shareReplay, switchMap } from 'rxjs';

import { User, UserBase, UserService } from './users.service';

@Injectable()
export class MasterDetailsService {
    public selectUserId$ = new ReplaySubject<number | undefined>(1);
    public search$ = new BehaviorSubject<string>('');
    public selectedUser$: Observable<User | undefined>;

    public users$: Observable<ReadonlyArray<UserBase>>;

    private userCache = new Map<number, Observable<User | undefined>>;

    public constructor(private userService: UserService) {
        this.users$ = userService.getUsers$().pipe(
            combineLatestWith(this.search$),
            map(([users, search]) => users.filter(user => {
                if (!search) {
                    return users;
                }
                const rg = new RegExp(search, 'ig');
                return rg.test(`${user.firstName || ''} ${user.lastName || ''}`);
            })),
            shareReplay({ bufferSize: 1, refCount: true })
        );

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


