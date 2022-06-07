import { SushiswapV1 } from '../sushiswap/v1';
import { UniswapV2 } from '../uniswap/v2';
import { UniswapV3 } from '../uniswap/v3';

export const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

// Token side definitions
export const TOKEN_0 = 'token0'
export const TOKEN_1 = 'token1'

// Dexes
export const SUSHISWAP_V1 = 'SUSHISWAP_V1'
export const UNISWAP_V2 = 'UNISWAP_V2'
export const UNISWAP_V3 = 'UNISWAP_V3'

export const DEXES = [SUSHISWAP_V1, UNISWAP_V2, UNISWAP_V3]

export const DEX_SERVICES = {
  [SUSHISWAP_V1]: SushiswapV1,
  [UNISWAP_V2]: UniswapV2,
  [UNISWAP_V3]: UniswapV3
}
