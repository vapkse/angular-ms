import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { User } from '../users.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent {
    @Input()
    public user!: User;
}
