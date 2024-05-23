import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Destroy } from '@deja-js/component/core';
import { combineLatestWith, debounceTime, map, Observable, shareReplay, switchMap, takeUntil } from 'rxjs';

import { DetailService } from './detail.service';
import { UserBase, UserService } from './users.service';

interface SearchFormControls {
    search: FormControl<string>;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DetailService
    ]
})
export class AppComponent extends Destroy {
    protected title = 'angular-ms';
    protected searchForm$: Observable<FormGroup<SearchFormControls>>;

    protected userList$: Observable<ReadonlyArray<UserBase>>;
    protected filteredUserList$: Observable<ReadonlyArray<UserBase>>;

    protected userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    public constructor() {
        super();

        this.userList$ = this.userService.getUsers$().pipe(
            shareReplay({ bufferSize: 1, refCount: true })
        );

        this.filteredUserList$ = this.userList$.pipe(
            combineLatestWith(this.route.queryParams),
            map(([users, params]) => {
                const search = params['search'] as string | undefined;

                return users.filter(user => {
                    if (!search) {
                        return users;
                    }
                    const rg = new RegExp(search, 'ig');
                    return rg.test(`${user.firstName || ''} ${user.lastName || ''}`);
                });
            }),
            shareReplay({ bufferSize: 1, refCount: true })
        );

        this.searchForm$ = this.route.queryParams.pipe(
            debounceTime(20),
            map(params => {
                const search = params['search'] as string | undefined;

                // const pasCoolValidator = (abstractControl: AbstractControl): ValidationErrors | null => {
                //     const control = abstractControl as FormControl<string>;
                //     return null;
                // };

                const formGroup = new FormGroup<SearchFormControls>({
                    search: new FormControl(search || '', { nonNullable: true })
                });

                return formGroup;
            }),
            shareReplay({ bufferSize: 1, refCount: false })
        );

        this.searchForm$.pipe(
            switchMap(searchForm => searchForm.controls.search.valueChanges.pipe(
                debounceTime(300)
            )),
            takeUntil(this.destroyed$)
        ).subscribe(search => {
            const queryParams = { search };
            void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
        });
    }

    protected selectUserId(userId: number | undefined): void {
        void this.router.navigate([`/${userId ? userId : ''}`], { queryParamsHandling: 'preserve' });
    }
}
