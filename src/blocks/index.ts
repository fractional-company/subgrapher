import BaseService from '../client/BaseService';
import { ENDPOINTS } from './constants';
import { CHAINS } from '../constants/chains';
import {
  fetchBlocksByNumbers,
  fetchBlockByTimestamp,
  fetchOneDayBlock,
  fetchSevenDayBlock,
  fetchTwoDayBlock,
} from './blocksData';

export class Blocks extends BaseService {
  constructor(chainId: number | undefined = CHAINS.MAINNET) {
    super(ENDPOINTS, chainId);
  }

  getNearestBlockByTimestamp(timestamp: number | string) {
    return fetchBlockByTimestamp(this.client, timestamp);
  }

  getOneDayBlock() {
    return fetchOneDayBlock(this.client);
  }

  getTwoDayBlock() {
    return fetchTwoDayBlock(this.client);
  }

  getSevenDayBlock() {
    return fetchSevenDayBlock(this.client);
  }

  getBlocksByNumbers(numbers: (string | number)[]) {
    return fetchBlocksByNumbers(this.client, numbers);
  }

  static isChainSupported(chainId: number): boolean {
    return !!ENDPOINTS[chainId];
  }
}
