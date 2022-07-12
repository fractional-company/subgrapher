import { GraphQLClient } from 'graphql-request';
import { TokenData } from '../../types';
import { tokenQuery, tokenTimeTravelQuery } from './queries';
import BigNumber from '../../../utils/bignumber';
import { formatTokenName, formatTokenSymbol } from '../../../utils/tokens';
import { SUSHISWAP_V1 } from '../../constants';

export type TokenFields = {
  id: string;
  symbol: string;
  name: string;
  derivedETH: string;
  totalSupply: string;
  volume: string;
  volumeUSD: string;
  feesUSD: string;
  txCount: string;
  liquidity: string;
  untrackedVolumeUSD: string;
};

export const mapToken = function (token: TokenFields): TokenData {
  return {
    source: SUSHISWAP_V1,
    address: token.id,
    derivedETH: new BigNumber(token.derivedETH?.toString()),
    name: formatTokenName(token.id, token.name), // 'Art Blocks Curated Full Set',
    symbol: formatTokenSymbol(token.id, token.symbol),
    totalValueLocked: new BigNumber(token.liquidity?.toString()), // '2030.560502437830764385',
    txCount: new BigNumber(token.txCount.toString()), // '448',
    untrackedVolumeUSD: new BigNumber(token.untrackedVolumeUSD.toString()),
    volume: new BigNumber(token.volume?.toString()), // '13514.487363679039296109',
    volumeUSD: new BigNumber(token.volumeUSD.toString()),
  };
};

/**
 *
 * @param client
 * @param tokenAddress
 * @returns {Promise<TokenData|null>}
 */
export const fetchTokenData = async (
  client: GraphQLClient,
  tokenAddress: string,
  blockNumber: number | undefined | null = null
): Promise<TokenData | null> => {
  const { token } = await client.request(
    blockNumber ? tokenTimeTravelQuery : tokenQuery,
    {
      id: tokenAddress,
      block: {
        number: blockNumber,
      },
    }
  );

  return token ? mapToken(token) : null;
};

/**
 *
 * @param client
 * @param tokenAddress
 * @param blockNumber
 * @returns {Promise<*[]|PoolData[]>}
 */

export const fetchPastTokenData = async (
  client: GraphQLClient,
  tokenAddress: string,
  blockNumber: number | undefined
): Promise<TokenData | null> => {
  const { token } = await client.request(tokenTimeTravelQuery, {
    id: tokenAddress,
    block: {
      number: blockNumber,
    },
  });

  return token ? mapToken(token) : null;
};
