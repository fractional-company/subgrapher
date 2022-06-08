import { GraphQLClient } from 'graphql-request';
import {
  findPoolsByToken0Query,
  findPoolsByToken1Query,
  poolDayDatasQuery,
  poolsQuery,
  poolTimeTravelQuery,
} from './queries';
import { mapToken, TokenFields } from './tokenData';
import { PoolData, PoolDayData } from '../../types';
import { TOKEN_0, UNISWAP_V3 } from '../../constants';
import BigNumber from '../../../utils/BigNumber';

type PoolFields = {
  id: string
  feeTier: string
  liquidity: string
  sqrtPrice: string
  tick: string
  token0: TokenFields
  token1: TokenFields
  token0Price: string
  token1Price: string
  volumeUSD: string
  txCount: string
  totalValueLockedToken0: string
  totalValueLockedToken1: string
  totalValueLockedUSD: string
}

type PoolDayFields = {
  pool: any
  date: string
  tvlUSD: string
  txCount: string
  volumeUSD: string
}
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

  const { pools } = await client.request(tokenSide === TOKEN_0 ? findPoolsByToken0Query : findPoolsByToken1Query,
    { tokenAddress });

  return (pools || [])
    .filter((x: PoolFields | null) => x)
    .map((pool: PoolFields) => mapPool(pool));
};

const mapPool = function(pool: PoolFields): PoolData {
  return {
    source: UNISWAP_V3,
    address: pool.id,
    token0: {
      ...mapToken(pool.token0),
    },
    token1: {
      ...mapToken(pool.token1),
    },
    txCount: new BigNumber(pool.txCount?.toString()),
    volumeUSD: new BigNumber(pool.volumeUSD?.toString()),
    token0Price: new BigNumber(pool.token0Price?.toString()),
    token1Price: new BigNumber(pool.token1Price?.toString()),
    totalValueLockedUSD: new BigNumber(pool.totalValueLockedUSD?.toString()),
    totalValueLockedToken0: new BigNumber(pool.totalValueLockedToken0?.toString()),
    totalValueLockedToken1: new BigNumber(pool.totalValueLockedToken1?.toString()),
  };
};

const mapPoolDayData = function(poolDayData: PoolDayFields): PoolDayData {
  return {
    source: UNISWAP_V3,
    address: poolDayData?.pool?.id,
    date: parseInt(poolDayData.date),
    tvlUSD: new BigNumber(poolDayData.tvlUSD?.toString()),
    txCount: new BigNumber(poolDayData.txCount?.toString()),
    volumeUSD: new BigNumber(poolDayData.volumeUSD?.toString()),
  };
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
                                     orderBy: string | undefined = 'totalValueLockedUSD',
                                     orderDirection: string | undefined = 'desc'): Promise<PoolData[] | []> => {

  const { pools } = await client.request(poolsQuery, {
    pools: poolsArr,
    orderBy,
    orderDirection,
  });

  return pools.map((pool: PoolFields) => mapPool(pool));
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
                                         orderBy: string | undefined = 'totalValueLockedUSD',
                                         orderDirection: string | undefined = 'desc'): Promise<PoolData[]> => {

  const { pools } = await client.request(poolTimeTravelQuery, {
    pools: poolsArr,
    block: {
      number: blockNumber,
    },
    orderBy,
    orderDirection,
  });

  return pools.map((pool: PoolFields) => mapPool(pool));
};


/**
 *
 * @param client
 * @param poolsArr
 * @param startTime
 * @param skip
 * @returns {Promise<null|*>}
 */
export const fetchPoolsDayData = async (client: GraphQLClient,
                                        poolsArr: string[] = [],
                                        startTime: number,
                                        skip: number = 0,
): Promise<PoolDayData[]> => {

  const { poolDayDatas } = await client.request(poolDayDatasQuery, {
    pools: poolsArr,
    startTime: startTime,
    skip: skip,
  });

  // @ts-ignore
  return poolDayDatas.map((poolDayData: PoolFields) => mapPoolDayData(poolDayData));
};
