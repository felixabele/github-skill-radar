import { User, UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `
    <input type="text" [(ngModel)]="search" placeholder="Search user..." />
    <ul>
      <app-user *ngFor="let user of filteredUsers" [user]="user"></app-user>
    </ul>
  `,
  styles: [
  ]
})
export class UserListComponent implements OnInit {
  users: User[] | [] = [];
  search: string = '';
  constructor(private userService: UsersService) { }

  async ngOnInit(): Promise<void> {
    this.users = await this.userService.getOrgaMembers();
  }

  get filteredUsers(): User[] {
    if (!this.search) {
      return this.users
    };

    return this.users.filter((user) => (
      user.login.includes(this.search)
    ));
  }
}
