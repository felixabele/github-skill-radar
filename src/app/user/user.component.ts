import { User } from './../users.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user',
  template: `
    <strong>{{ user.login }}</strong>
    <ul>
      <li *ngFor="let language of user.repositoryLanguages">
        {{ language.name }} {{ language.count }}
      </li>
    </ul>
  `
})
export class UserComponent {
  @Input() user!: User;
}
