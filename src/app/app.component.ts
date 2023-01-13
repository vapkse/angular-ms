import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Destroy } from '@deja-js/component/core';
import { debounceTime, map, Observable, shareReplay, switchMap, takeUntil } from 'rxjs';

import { MasterDetailsService } from './master-details.service';

interface SearchFormControls {
    search: FormControl<string>;
}

interface QueryParams {
    userid: string;
    search: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends Destroy {
    protected title = 'angular-ms';
    protected searchForm$: Observable<FormGroup<SearchFormControls>>;

    public constructor(
        public masterDetailsService: MasterDetailsService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        super();

        this.searchForm$ = route.queryParams.pipe(
            debounceTime(20),
            map(params => {
                const queryParams = params as QueryParams;

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const userId = queryParams.userid;
                this.masterDetailsService.selectUserId$.next(userId && !isNaN(+userId) && +userId || undefined);


                const formGroup = new FormGroup<SearchFormControls>({
                    search: new FormControl(queryParams.search || '', { nonNullable: true })
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
            void router.navigate([], { relativeTo: route, queryParams, queryParamsHandling: 'merge' });
        });
    }

    protected selectUserId(userId: number | undefined): void {
        const queryParams = { userid: userId || undefined };
        void this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' });
    }
}
