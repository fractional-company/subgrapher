import {WETH_ADDRESS} from '../dexes/constants';

/***
 *
 * @param address
 * @param symbol
 * @returns {string}
 */
export function formatTokenSymbol(address: string, symbol: string): string {
  if (!symbol) {
    throw Error('No symbol provided')
  }

  if (address === WETH_ADDRESS) {
    return 'ETH'
  }

  return symbol?.toUpperCase()
}

/**
 *
 * @param address
 * @param name
 * @returns {string}
 */
export function formatTokenName(address: string, name: string): string {
  if (address === WETH_ADDRESS) {
    return 'Ether'
  }

  return name
}
