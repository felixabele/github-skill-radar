import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';

const uri = 'https://api.github.com/graphql';
const token = environment.githubAuthToken;

export function createApollo(httpLink: HttpLink) {
  const context = setContext(() => (
    {
      headers: {
        Authorization: `bearer ${token}`,
        Accept: 'charset=utf-8'
      }
    }
  ));

  const link = ApolloLink.from([context, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }

