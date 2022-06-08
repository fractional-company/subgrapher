import { GraphQLClient } from 'graphql-request';
import { mapToken, TokenFields } from './tokenData';
import { PoolData, PoolDayData } from '../../types';
import { TOKEN_0, UNISWAP_V2 } from '../../constants';
import {
  pairDayDatasQuery, pairsPastQuery, pairsQuery, poolsByToken0Query, poolsByToken1Query,
} from './queries';
import BigNumber from '../../../utils/BigNumber';

type PoolFields = {
  id: string
  reserveUSD: string
  reserveETH: string
  volumeUSD: string
  untrackedVolumeUSD: string
  trackedReserveETH: string
  token0: TokenFields
  token1: TokenFields
  reserve0: string
  reserve1: string
  token0Price: string
  token1Price: string
  totalSupply: string
  txCount: string
  timestamp: string
}

type PoolDayFields = {
  date: string
  pairAddress: string
  reserve1: string
  reserve0: string
  tvlUSD: string
  dailyTxns: string
  dailyVolumeUSD: string
}

const mapPool = function(pool: PoolFields): PoolData {
  return {
    source: UNISWAP_V2,
    address: pool.id,
    token0: {
      ...mapToken(pool.token0),
    },
    token1: {
      ...mapToken(pool.token1),
    },
    txCount: new BigNumber(pool.txCount.toString()),
    volumeUSD: new BigNumber(pool.volumeUSD.toString()),
    token0Price: new BigNumber(pool.token0Price?.toString()),
    token1Price: new BigNumber(pool.token1Price?.toString()),
    totalValueLockedUSD: new BigNumber(pool.reserveUSD?.toString()),
    totalValueLockedToken0: new BigNumber(pool.reserve0?.toString()),
    totalValueLockedToken1: new BigNumber(pool.reserve1?.toString()),
  };
};

const mapPoolDayData = function(poolDayData: PoolDayFields): PoolDayData {
  return {
    source: UNISWAP_V2,
    address: poolDayData.pairAddress,
    date: parseInt(poolDayData.date),
    tvlUSD: new BigNumber(poolDayData.reserve1?.toString()).plus(poolDayData.reserve0.toString()),
    txCount: new BigNumber(poolDayData.dailyTxns?.toString()),
    volumeUSD: new BigNumber(poolDayData.dailyVolumeUSD?.toString()),
  };
};

/**
 * Fetch token pools
 * @param client
 * @param tokenAddress
 * @param tokenSide
 * @returns {Promise<null|*>}
 */
export const fetchTokenPools = async (client: GraphQLClient,
                                      tokenAddress: string,
                                      tokenSide: string | undefined = TOKEN_0): Promise<PoolData[] | []> => {

  const { pairs } = await client.request(tokenSide === TOKEN_0 ? poolsByToken0Query : poolsByToken1Query,
    { tokenAddress });

  return (pairs || [])
    .filter((x: PoolFields | null) => x)
    .map((pool: PoolFields) => mapPool(pool));
};

/**
 *
 * @param client
 * @param poolsArr
 * @param orderBy
 * @param orderDirection
 * @returns {Promise<void>}
 */
export const fetchPoolsData = async (client: GraphQLClient,
                                     poolsArr: any = [],
                                     orderBy: string | undefined = 'txCount',
                                     orderDirection: string | undefined = 'desc'): Promise<PoolData[] | []> => {

  const { pairs } = await client.request(pairsQuery, {
    pairs: poolsArr,
    orderBy,
    orderDirection,
  });

  return pairs.map((pool: PoolFields) => mapPool(pool));
};

/**
 *
 * @param client
 * @param poolsArr
 * @param blockNumber
 * @param orderBy
 * @param orderDirection
 * @returns {Promise<*[]|PoolData[]>}
 */
export const fetchPoolsPastData = async (client: GraphQLClient,
                                         poolsArr: string[] = [],
                                         blockNumber: number | undefined,
                                         orderBy: string | undefined = 'txCount',
                                         orderDirection: string | undefined = 'desc'): Promise<PoolData[]> => {

  const { pairs } = await client.request(pairsPastQuery, {
    pairs: poolsArr,
    block: {
      number: blockNumber,
    },
    orderBy,
    orderDirection,
  });

  return pairs.map((pool: PoolFields) => mapPool(pool));
};

/**
 *
 * @param client
 * @param poolsArr
 * @param startTime
 * @returns {Promise<null|*>}
 */
export const fetchPoolsDayData = async (client: GraphQLClient,
                                        poolsArr: string[],
                                        startTime: number,
): Promise<PoolDayData[]> => {

  const { pairDayDatas } = await client.request(pairDayDatasQuery,
    {
      pairs: poolsArr,
      date: startTime,
    });

  // @ts-ignore
  return pairDayDatas.map((poolDayData: PoolFields) => mapPoolDayData(poolDayData));
};
