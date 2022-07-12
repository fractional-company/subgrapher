import { CHAINS } from '../../../constants/chains';
import { ENDPOINTS } from './constants';
import {
  fetchPoolsData,
  fetchPoolsDayData,
  fetchPoolsPastData,
  fetchTokenPools,
} from './poolData';
import { PoolData, PoolDayData, TokenData } from '../../types';
import { fetchTokenData } from './tokenData';
import { TOKEN_1 } from '../../constants';
import { getEthPrice, getPastEthPrice } from './eth';
import BigNumber from '../../../utils/bignumber';
import BaseDexService from '../../../client/BaseDexService';

export class UniswapV3 extends BaseDexService {
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

  getPoolsPastData(pools: string[], blockNumber: number): Promise<PoolData[]> {
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
      startTime,
      skip
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
