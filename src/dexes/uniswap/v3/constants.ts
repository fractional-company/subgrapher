// CHAIN ID : ENDPOINT
import { CHAINS } from '../../../constants/chains';

export const ENDPOINTS = {
  [CHAINS.MAINNET]:
    'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3',
  [CHAINS.GÖRLI]:
    'https://api.thegraph.com/subgraphs/name/0xfind/uniswap-v3-goerli',
};
