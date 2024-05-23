import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
    selector: 'app-no-user',
    template: 'Please select a user',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class NoUserComponent {
}
