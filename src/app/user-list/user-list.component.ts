import { User, UsersService } from './../users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-list',
  template: `
    <input
      type="text"
      [(ngModel)]="search"
      placeholder="Search expert for..."
      id="searchTerm"
    />
    <ul>
      <li *ngFor="let user of filteredUsers">
        <app-user [user]="user"></app-user>
      </li>
    </ul>
  `,
  styles: [
    'ul { list-style: none; }',
    'ul li { padding-top: 1rem; }'
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

    const searchMatch = new RegExp(`^${this.search}$`, 'i');
    const languageMatchScore = (user: User): number => (
      user.repositoryLanguages.find(({ name }) => searchMatch.test(name))?.count || 0
    )

    return this.users
      .filter(languageMatchScore)
      .sort((user1, user2) => languageMatchScore(user2) - languageMatchScore(user1));
  }
}
