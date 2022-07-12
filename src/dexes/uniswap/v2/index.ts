import { CHAINS } from '../../../constants/chains';
import { ENDPOINTS } from './constants';
import { getPastEthPrice, getEthPrice } from './eth';
import { PoolData, PoolDayData, TokenData } from '../../types';
import { fetchTokenData } from './tokenData';
import {
  fetchPoolsData,
  fetchPoolsDayData,
  fetchPoolsPastData,
  fetchTokenPools,
} from './poolData';
import { TOKEN_1 } from '../../constants';
import BaseDexService from '../../../client/BaseDexService';
import BigNumber from '../../../utils/bignumber';

export class UniswapV2 extends BaseDexService {
  constructor(chainId: number | undefined = CHAINS.MAINNET) {
    super(ENDPOINTS, chainId);
  }

  getTokenData(
    contractAddress: string,
    blockNumber: number | undefined | null = null
  ): Promise<TokenData | null> {
    return fetchTokenData(
      this.client,
      contractAddress.toLowerCase(),
      blockNumber
    );
  }

  async getTokenPools(contractAddress: string): Promise<PoolData[] | []> {
    const token0Pools = await fetchTokenPools(
      this.client,
      contractAddress.toLowerCase()
    );
    const token1Pools = await fetchTokenPools(
      this.client,
      contractAddress.toLowerCase(),
      TOKEN_1
    );

    // @ts-ignore
    return (token0Pools || []).concat(token1Pools || []);
  }

  getPoolsData(pools: string[] = []): Promise<PoolData[] | []> {
    return fetchPoolsData(
      this.client,
      pools.map(poolAddress => poolAddress.toLowerCase())
    );
  }

  getPoolsPastData(
    pools: string[],
    blockNumber: number
  ): Promise<PoolData[] | []> {
    return fetchPoolsPastData(
      this.client,
      pools.map((poolAddress: string) => poolAddress.toLowerCase()),
      blockNumber
    );
  }

  getPoolsDayDatas(
    pools: string[],
    startTime: number,
    skip = 0
  ): Promise<PoolDayData[]> {
    return fetchPoolsDayData(
      this.client,
      pools.map((poolAddress: string) => poolAddress.toLowerCase()),
      startTime
    );
  }

  getEthPrice(
    blockNumber: number | undefined | null = null
  ): Promise<BigNumber> {
    return blockNumber
      ? getPastEthPrice(this.client, blockNumber)
      : getEthPrice(this.client);
  }

  static isChainSupported(chainId: number): boolean {
    return !!ENDPOINTS[chainId];
  }
}
