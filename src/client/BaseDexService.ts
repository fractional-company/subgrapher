import BaseService from './BaseService';
import { CHAINS } from '../constants/chains';
import { BulkAnalyticsRequest, BulkPoolsAnalytics, PoolData, PoolDayData } from '../dexes/types';

export default class BaseDexService extends BaseService {
  constructor(ENDPOINTS: any, chainId: number | undefined = CHAINS.MAINNET) {
    super(ENDPOINTS, chainId);
  }

  static isChainSupported(chainId: number): boolean {
    throw new Error(`isChainSupported function not implemented`);
  }

  getTokenPools(contractAddress: string): Promise<PoolData[] | []> {
    // @ts-ignore
    return [];
  }

  getPoolsData(pools: string[]): Promise<PoolData[] | []> {
    // @ts-ignore
    return [];
  }

  getPoolsPastData(pools: string[], blockNumber: number): Promise<PoolData[] | []> {
    // @ts-ignore
    return [];
  }

  getPoolsDayDatas(pools: any, timestamp: number): Promise<PoolDayData[]> {
    // @ts-ignore
    return [];
  }

  async getTokenPoolsData(contractAddress: string, pools: string[] = [], blockNumber = null): Promise<PoolData[]> {

    if (pools.length === 0) {
      pools = (await this.getTokenPools(contractAddress))
        .map(pool => pool.address);
    }

    if (pools.length === 0) {
      return [];
    }

    pools = pools.map(poolAddress => poolAddress.toLowerCase());
    const poolsData: PoolData[] | [] = blockNumber !== null
      ? await this.getPoolsPastData(pools, blockNumber)
      : await this.getPoolsData(pools);

    if (poolsData.length === 0) {
      return [];
    }

    return poolsData.map((pool: PoolData) => {

      // @ts-ignore
      pool.weight = pool.token1.address.toLowerCase() === contractAddress.toLowerCase()
        ? pool.totalValueLockedToken1
        : pool.totalValueLockedToken0;
      return pool;
    });
  }

  /**
   *
   * @param request
   * @param blockNumber
   * @returns {Promise<{}|null>}
   */
  async getBulkPoolsData(request: BulkAnalyticsRequest, blockNumber = null): Promise<BulkPoolsAnalytics | object> {
    const vaultAddresses = Object.keys(request);
    const pools = vaultAddresses.flatMap((vaultAddress: string) => request[vaultAddress])
      .map((poolAddress: string) => poolAddress.toLowerCase());
    const poolsData: PoolData[] | [] = blockNumber !== null
      ? await this.getPoolsPastData(pools, blockNumber)
      : await this.getPoolsData(pools);

    if (poolsData.length === 0) {
      return [];
    }

    return vaultAddresses.reduce((carry, vaultAddress) => {
      const poolAddresses = request[vaultAddress];
      // @ts-ignore
      carry[vaultAddress] = poolAddresses
        .map(address => poolsData.find(p => p.address === address))
        .filter(x => x)
        // @ts-ignore
        .map((pool: PoolData) => {
          // @ts-ignore
          pool.weight = pool.token1.address.toLowerCase() === vaultAddress.toLowerCase()
            ? pool.totalValueLockedToken1
            : pool.totalValueLockedToken0;
          return pool;
        });

      return carry;
    }, {});
  }

  /**
   *
   * @param request
   * @param timestamp
   * @returns {Promise<{}>}
   */
  async getBulkPoolsDayDatas(request: BulkAnalyticsRequest, timestamp: number | string) {
    const vaultAddresses: string[] = Object.keys(request);
    const pools = vaultAddresses.flatMap(vaultAddress => request[vaultAddress])
      .map((poolAddress: string) => poolAddress.toLowerCase());
    // @ts-ignore
    const data: [] = await this.getPoolsDayDatas(pools, timestamp);
    if (data.length === 0) {
      return {};
    }
    return vaultAddresses.reduce((carry: {}, vaultAddress) => {
      const poolAddresses = request[vaultAddress];
      // @ts-ignore
      carry[vaultAddress] = poolAddresses
        .map(address => data.filter((pool: PoolData) => pool.address === address))
        .filter(x => x);

      return carry;
    }, {});
  }

}
