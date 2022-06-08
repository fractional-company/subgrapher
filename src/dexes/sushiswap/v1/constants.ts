// CHAIN ID : ENDPOINT
import { CHAINS } from '../../../constants/chains';

export const ENDPOINTS = {
  [CHAINS.MAINNET]: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
  [CHAINS.BSC]: 'https://thegraph.com/explorer/subgraph/sushiswap/bsc-exchange',
  [CHAINS.XDAI]: 'https://thegraph.com/explorer/subgraph/sushiswap/xdai-exchange',
  [CHAINS.MATIC]: 'https://thegraph.com/explorer/subgraph/sushiswap/matic-exchange',
  [CHAINS.FANTOM]: 'https://thegraph.com/explorer/subgraph/sushiswap/fantom-exchange',
  [CHAINS.ARBITRUM]: 'https://thegraph.com/explorer/subgraph/sushiswap/arbitrum-exchange',
  [CHAINS.CELO]: 'https://thegraph.com/explorer/subgraph/sushiswap/celo-exchange',
  [CHAINS.AVALANCHE]: 'https://thegraph.com/explorer/subgraph/sushiswap/avalanche-exchange',
  [CHAINS.HARMONY]: 'https://sushi.graph.t.hmny.io/subgraphs/name/sushiswap/harmony-exchange',
  [CHAINS.MOONRIVER]: 'https://thegraph.com/hosted-service/subgraph/sushiswap/moonriver-exchange',
};
