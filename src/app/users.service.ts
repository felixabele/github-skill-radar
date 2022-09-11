import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { environment } from 'src/environments/environment';

export interface RepositoryLanguage {
  name: string;
  count: number;
}

export interface User {
  login: string;
  repositoryLanguages: RepositoryLanguage[];
}

interface RepositoryConnection {
  node: {
    primaryLanguage: {
      name: string;
    }
  }
}

interface OrganizationMemberConnection {
  login: string;
  repositories: { edges: RepositoryConnection[] };
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public users: User[] = [];
  private orgaMembersQuery: QueryRef<{ organization: any }>;

  constructor(private apollo: Apollo) {
    this.orgaMembersQuery = this.apollo.watchQuery({
      query: gql`
        query ($login: String!, $after: String) {
          organization(login: $login) {
            membersWithRole(first: 15, after: $after) {
              pageInfo {
                endCursor
                hasNextPage
              }
              nodes {
                login
                repositories(first: 50) {
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

  private aggregatedRepositories(repositories: RepositoryConnection[]): RepositoryLanguage[] {
    const languageCount: RepositoryLanguage[] = [];
    const aggregateLanguage = (repo: RepositoryConnection) => {
      const name = repo.node.primaryLanguage?.name;
      if (!name) return;
      const existing = languageCount.find((lan: RepositoryLanguage) => lan.name === name);
      existing ? existing.count++ : languageCount.push({ name, count: 1 });
    }

    repositories.forEach(aggregateLanguage);
    return languageCount;
  }

  public async getOrgaMembers(after?: string): Promise<User[]> {
    const result = await this.orgaMembersQuery.refetch({
      login: environment.organizationName,
      after
    });
    const { nodes, pageInfo } = result.data.organization.membersWithRole;

    if (pageInfo.hasNextPage) {
      await this.getOrgaMembers(pageInfo.endCursor);
    }

    const users = nodes.map((node: OrganizationMemberConnection) => (
      {
        login: node.login,
        repositoryLanguages: this.aggregatedRepositories(node.repositories.edges),
      }
    ));

    this.users = this.users.concat(users);
    return this.users;
  }
}
