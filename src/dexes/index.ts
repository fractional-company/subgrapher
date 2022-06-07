import { CHAINS } from '../constants/chains';

// @ts-ignore
export class Dexes {
  chainId: number;

  constructor(chainId: number | undefined = CHAINS.MAINNET) {
    this.chainId = chainId;
  }
}
