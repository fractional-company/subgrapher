import { GraphQLClient } from 'graphql-request';

interface GraphQlService {
  chainId: number;
  client: GraphQLClient;
}

export default class BaseService implements GraphQlService {
  chainId: number;
  client: GraphQLClient;

  constructor(chainEndpoints: any, chainId: number) {
    this.chainId = chainId;
    if (!chainEndpoints[chainId]) {
      throw new Error(`Chain id ${chainId} is not supported`);
    }
    console.log(chainEndpoints[chainId])
    this.client = new GraphQLClient(chainEndpoints[chainId]);
  }
}
