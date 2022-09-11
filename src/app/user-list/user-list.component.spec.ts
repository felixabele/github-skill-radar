import { UserComponent } from './../user/user.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { GraphQLModule } from '../graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../users.service';

import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  const sampleUsers: User[] = [
    {
      login: 'Alf',
      repositoryLanguages: [
        {
          name: 'Ruby',
          count: 14,
        },
        {
          name: 'Java',
          count: 3,
        },
      ]
    },
    {
      login: 'Yoda',
      repositoryLanguages: [
        {
          name: 'CSS',
          count: 4,
        },
        {
          name: 'javaScript',
          count: 12,
        },
      ]
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UserListComponent,
        UserComponent
      ],
      imports: [
        BrowserModule,
        GraphQLModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    component.users = sampleUsers
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all users login', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(sampleUsers[0].login);
    expect(compiled.textContent).toContain(sampleUsers[1].login);
  });

  it('should filter users by search term', () => {
    const element = fixture.nativeElement;
    const searchInput: HTMLInputElement = element.querySelector('#searchTerm');

    searchInput.value = 'javaScript';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain(sampleUsers[0].login);
    expect(compiled.textContent).toContain(sampleUsers[1].login);
  });
});
