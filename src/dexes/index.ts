import { CHAINS } from '../constants/chains';
import { DEX_SERVICES, DEXES } from './constants';
import BigNumber from '../utils/FractionalBigNumber';
import { PoolData } from './types';

export const METHOD_MIN = 'min';
export const METHOD_MAX = 'max';

// @ts-ignore
export class Dexes {
  chainId: number;

  constructor(chainId: number | undefined = CHAINS.MAINNET) {
    this.chainId = chainId;
  }

  /**
   * Get pools
   * @param contractAddress
   * @param sources
   */
  async getTokenPools(
    contractAddress: string,
    sources: string[] = DEXES
  ): Promise<PoolData[] | []> {
    const services = this._getServices(sources);
    const poolData = await Promise.all(
      services.map(service =>
        new service(this.chainId).getTokenPools(contractAddress)
      )
    );
    return poolData.flatMap(x => x).filter(x => x);
  }

  /**
   * Get token price in ETH
   * @param contractAddress
   * @param blockNumber
   * @param method
   * @param sources
   */
  async getTokenPrice(
    contractAddress: string,
    blockNumber: number | null = null,
    method: string = METHOD_MAX,
    sources: string[] = DEXES
  ): Promise<BigNumber | null> {
    if (![METHOD_MIN, METHOD_MAX].includes(method)) {
      throw new Error('Method does not exists!');
    }

    const quotes = (
      await this.getTokenPrices(contractAddress, blockNumber, sources)
    ).filter(quote => quote?.isGreaterThan(0));

    if (quotes.length === 0) {
      return null;
    }

    switch (method) {
      case METHOD_MIN: {
        return BigNumber.minimum(...quotes);
      }
      case METHOD_MAX:
      default: {
        return BigNumber.maximum(...quotes);
      }
    }
  }

  /**
   * Get token prices in ETH
   * @param contractAddress
   * @param blockNumber
   * @param sources
   */
  async getTokenPrices(
    contractAddress: string,
    blockNumber: number | null = null,
    sources: string[] = DEXES
  ) {
    // @ts-ignore
    const services = this._getServices(sources);
    const tokenData = await Promise.all(
      services.map(service =>
        new service(this.chainId).getTokenData(contractAddress, blockNumber)
      )
    );
    return tokenData.filter(x => x).map(i => i.derivedETH);
  }

  /**
   * Get eth USD price
   * @param blockNumber
   * @param method
   * @param sources
   */
  async getEthPrice(
    blockNumber: number | null = null,
    method: string = METHOD_MAX,
    sources: string[] = DEXES
  ): Promise<BigNumber | null> {
    if (![METHOD_MIN, METHOD_MAX].includes(method)) {
      throw new Error('Method does not exists!');
    }

    /**
     * ETH will always be grater than 0
     */
    const quotes = (await this.getEthPrices(blockNumber, sources)).filter(
      quote => quote?.isGreaterThan(0)
    );

    if (quotes.length === 0) {
      return null;
    }

    switch (method) {
      case METHOD_MIN: {
        return BigNumber.minimum(...quotes);
      }
      case METHOD_MAX:
      default: {
        return BigNumber.maximum(...quotes);
      }
    }
  }

  /**
   * Get ETH prices in USD
   * @param blockNumber
   * @param sources
   */
  getEthPrices(
    blockNumber: null | number = null,
    sources: string[] = DEXES
  ): Promise<BigNumber[]> {
    // @ts-ignore
    const services = this._getServices(sources);
    return Promise.all(
      services.map(service =>
        new service(this.chainId).getEthPrice(blockNumber)
      )
    );
  }

  /**
   *
   * @param sources
   */
  _getServices(sources: string[] = DEXES) {
    return (
      sources
        // @ts-ignore
        .map((dex: string) => DEX_SERVICES[dex])
        .filter(x => x)
        .filter(x => x.isChainSupported(this.chainId))
    );
  }
}
