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
  private orgaMembersQuery: QueryRef<{ organization: any }>;

  constructor(private apollo: Apollo) {
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

  public async getOrgaMembers(): Promise<User[]> {
    const result = await this.orgaMembersQuery.refetch();
    const { nodes } = result.data.organization.membersWithRole;

    const users: User[] = nodes.map((node: OrganizationMemberConnection) => (
      {
        login: node.login,
        repositoryLanguages: this.aggregatedRepositories(node.repositories.edges),
      }
    ));

    return users;
  }
}
