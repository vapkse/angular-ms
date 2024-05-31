import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatestWith, debounceTime, map, Observable, shareReplay, switchMap } from 'rxjs';

import { DetailService } from './detail.service';
import { MasterComponent } from './master/master.component';
import { UserBase, UserService } from './users.service';

interface SearchFormControls {
    search: FormControl<string>;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
        AsyncPipe,
        MasterComponent,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterModule
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DetailService
    ]
})
export class AppComponent {
    protected title = 'angular-ms';
    protected searchForm$: Observable<FormGroup<SearchFormControls>>;

    protected userList$: Observable<ReadonlyArray<UserBase>>;
    protected filteredUserList$: Observable<ReadonlyArray<UserBase>>;

    protected userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    public constructor() {

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
            takeUntilDestroyed()
        ).subscribe(search => {
            const queryParams = { search };
            void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
        });
    }

    protected selectUserId(userId: number | undefined): void {
        void this.router.navigate([`/${userId ? userId : ''}`], { queryParamsHandling: 'preserve' });
    }
}
