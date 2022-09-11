import { User, UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <app-user *ngFor="let user of users" [user]="user"></app-user>
    </ul>
  `,
  styles: [
  ]
})
export class UserListComponent implements OnInit {
  users: User[] | [] = [];
  constructor(private userService: UsersService) { }

  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getOrgaMembers();
  }
}
