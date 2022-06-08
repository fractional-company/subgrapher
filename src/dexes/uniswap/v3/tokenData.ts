import { formatTokenName, formatTokenSymbol } from '../../../utils/tokens';
import { tokenPastQuery, tokenQuery, tokensQuery } from './queries';
import { TokenData } from '../../types';
import { GraphQLClient } from 'graphql-request';
import BigNumber from './../../../utils/BigNumber';
import { UNISWAP_V3 } from '../../constants';

export type TokenFields = {
  id: string
  symbol: string
  decimals: string
  name: string
  derivedETH: string
  volume: string
  volumeUSD: string
  feesUSD: string
  txCount: string
  untrackedVolumeUSD: string
  totalValueLocked: string
  totalValueLockedUSD: string
}

/**
 *
 * @param token
 */
export const mapToken = function(token: TokenFields): TokenData {
  return {
    source: UNISWAP_V3,
    address: token.id,
    derivedETH: new BigNumber(token.derivedETH?.toString()),
    name: formatTokenName(token.id, token.name),  // 'Art Blocks Curated Full Set',
    symbol: formatTokenSymbol(token.id, token.symbol),  // 'ABC123',
    txCount: new BigNumber(token.txCount?.toString()),  // '448',
    totalValueLocked: new BigNumber(token.totalValueLocked?.toString()),  // '2030.560502437830764385',
    untrackedVolumeUSD: new BigNumber(token.untrackedVolumeUSD?.toString()),
    volume: new BigNumber(token.volume?.toString()),  // '13514.487363679039296109',
    volumeUSD: new BigNumber(token.volumeUSD?.toString())  // '13514.487363679039296109',
  };
};

/**
 *
 * @param client
 * @param tokenAddress
 * @param blockNumber
 * @returns {Promise<TokenData|null>}
 */
export const fetchTokenData = async (client: GraphQLClient,
                                     tokenAddress: string,
                                     blockNumber: number | null = null): Promise<TokenData | null> => {

  const { token } = await client.request(blockNumber ? tokenPastQuery : tokenQuery, {
    id: tokenAddress,
    block: { number: blockNumber },
  });
  return token ? mapToken(token) : null;
};

/**
 *
 * @param client
 * @param tokenAddresses
 * @param blockNumber
 * @param orderBy
 * @param orderDirection
 */
export const fetchTokensData = async (client: GraphQLClient,
                                      tokenAddresses: string[] = [],
                                      blockNumber: null | number | undefined = null,
                                      orderBy: string | undefined = 'totalValueLockedUSD',
                                      orderDirection: string | undefined = 'desc'): Promise<TokenData[] | any[]> => {
  if (tokenAddresses.length === 0) {
    return [];
  }

  const { tokens } = await client.request(tokensQuery, {
    ids: tokenAddresses,
    block: blockNumber,
    orderBy,
    orderDirection,
  });

  if (tokens.length === 0) {
    return [];
  }

  return tokens
    .filter((x: TokenFields | null) => x)
    .map((token: TokenFields) => mapToken(token));
};
