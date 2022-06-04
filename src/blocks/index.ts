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
    if (!ENDPOINTS[chainId]) {
      throw new Error(`BlocksClient: chain id ${chainId} is not supported`);
    }
    super(ENDPOINTS[chainId], chainId);
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
}
