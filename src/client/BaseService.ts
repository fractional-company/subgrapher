import { GraphQLClient } from 'graphql-request';

interface GraphQlService {
  chainId: number;
  client: GraphQLClient;
}

export default class BaseService implements GraphQlService {
  chainId: number;
  client: GraphQLClient;

  constructor(endpoint: string, chainId: number) {
    this.chainId = chainId;
    this.client = new GraphQLClient(endpoint);
  }
}
