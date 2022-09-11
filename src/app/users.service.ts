import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';

export interface RepositoryLanguage {
  name: string;
  count: number;
}

export interface User {
  login: string;
  repositoryLanguages: RepositoryLanguage[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private orgaMembersQuery: QueryRef<{ organization: any }>;

  constructor(private apollo:Apollo) {
    this.orgaMembersQuery = this.apollo.watchQuery({
      query: gql`
        {
          organization(login: "codecentric") {
            membersWithRole(first:30) {
              nodes {
                login
                repositories(first:30) {
                  edges {
                    node {
                      primaryLanguage {
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    });
  }

  async getOrgaMembers(): Promise<any> {
    const result = await this.orgaMembersQuery.refetch();
    return result.data.organization;
  }
}
