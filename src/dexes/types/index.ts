import BigNumber from 'bignumber.js';

export type PoolAnalytics = {
  address: string
  token0: TokenData
  token1: TokenData
  token0Price: BigNumber
  token1Price: BigNumber
  volumeUSD: BigNumber
  txCount: BigNumber
  totalValueLockedToken0: BigNumber
  totalValueLockedToken1: BigNumber
  weight: BigNumber
}

export type TokenData = {
  source: string,
  address: string
  derivedETH: BigNumber
  name: string
  symbol: string
  totalValueLocked: BigNumber
  txCount: BigNumber
  untrackedVolumeUSD: BigNumber
  volume: BigNumber
  volumeUSD: BigNumber
}

export type PoolData = {
  weight?: number;
  source: string,
  address: string
  token0: TokenData
  token1: TokenData
  token0Price: BigNumber
  token1Price: BigNumber
  volumeUSD: BigNumber
  txCount: BigNumber
  totalValueLockedUSD: BigNumber
  totalValueLockedToken0: BigNumber
  totalValueLockedToken1: BigNumber
}

export type PoolDayData = {
  source?: string,
  date: number
  address: string
  volumeUSD: BigNumber
  tvlUSD: BigNumber
  txCount: BigNumber
}

export type BulkPoolsAnalytics = {
  [address: string]: PoolAnalytics[]
}

export type BulkAnalyticsRequest = {
  [address: string]: string[]
}
