import { CHAINS } from '../constants/chains';

export const ENDPOINTS = {
  [CHAINS.MAINNET]: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
  [CHAINS.RINKEBY]: 'https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks',
}
