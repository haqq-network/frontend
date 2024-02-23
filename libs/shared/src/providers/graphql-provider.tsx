import { PropsWithChildren } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

export function GraphQLProvider({ children }: PropsWithChildren) {
  const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
