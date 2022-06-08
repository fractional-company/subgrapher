import { formatTokenName, formatTokenSymbol } from '../../../utils/tokens';
import { tokenQuery, tokenTimeTravelQuery } from './queries';
import { TokenData } from '../../types';
import { GraphQLClient } from 'graphql-request';
import BigNumber from './../../../utils/BigNumber';
import { UNISWAP_V2 } from '../../constants';

export type TokenFields = {
  id: string,
  symbol: string,
  name: string,
  derivedETH: string,
  totalSupply: string,
  tradeVolume: string,
  tradeVolumeUSD: string,
  txCount: string,
  totalLiquidity: string,
  untrackedVolumeUSD: string
}

export const mapToken = function(token: TokenFields): TokenData {

  return {
    source: UNISWAP_V2,
    address: token.id,
    derivedETH: new BigNumber(token.derivedETH?.toString()),
    name: formatTokenName(token.id, token.name),  // 'Art Blocks Curated Full Set',
    symbol: formatTokenSymbol(token.id, token.symbol),  // 'ABC123',
    totalValueLocked: new BigNumber(token.totalLiquidity?.toString()),  // '2030.560502437830764385',
    txCount: new BigNumber(token.txCount?.toString()),  // '448',
    untrackedVolumeUSD: new BigNumber(token.untrackedVolumeUSD?.toString()),
    volume: new BigNumber(token.tradeVolume?.toString()),  // '13514.487363679039296109',
    volumeUSD: new BigNumber(token.tradeVolumeUSD?.toString()),
  };
};

/**
 *
 * @param client
 * @param tokenAddress
 * @returns {Promise<TokenData|null>}
 */
export const fetchTokenData = async (client: GraphQLClient,
                                     tokenAddress: string,
                                     blockNumber: number | undefined | null = null): Promise<TokenData | null> => {

  const { token } = await client.request(blockNumber ? tokenTimeTravelQuery : tokenQuery, {
    id: tokenAddress,
    block: {
      number: blockNumber,
    },
  });

  return token ? mapToken(token) : null;
};

/**
 *
 * @param client
 * @param tokenAddress
 * @param blockNumber
 * @returns {Promise<*[]|PoolData[]>}
 */

export const fetchPastTokenData = async (client: GraphQLClient,
                                         tokenAddress: string,
                                         blockNumber: number | undefined): Promise<TokenData | null> => {

  const { token } = await client.request(tokenTimeTravelQuery, {
    id: tokenAddress,
    block: {
      number: blockNumber,
    },
  });
  return token ? mapToken(token) : null;
};
