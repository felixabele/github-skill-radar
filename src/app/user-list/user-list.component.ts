import { User, UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `
    <p>
      user-list works!
    </p>
  `,
  styles: [
  ]
})
export class UserListComponent implements OnInit {
  users: User[] | [] = [];
  bla: any;

  constructor(private userService: UsersService) { }

  async ngOnInit(): Promise<void> {
    const result = await this.userService.getOrgaMembers();
    this.bla = result.membersWithRole;
    console.log(this.bla);

  }
}
