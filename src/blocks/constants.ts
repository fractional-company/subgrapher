import { CHAINS } from '../constants/chains';

export const ENDPOINTS = {
  [CHAINS.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
  [CHAINS.GÖRLI]:
    'https://api.thegraph.com/subgraphs/name/blocklytics/goerli-blocks',
};
