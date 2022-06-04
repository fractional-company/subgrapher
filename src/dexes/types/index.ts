export type PoolAnalytics = {
  address: string,
  token0: TokenData,
  token1: TokenData,
  token0Price: number,
  token1Price: number,
  volumeUSD: number,
  txCount: number,
  totalValueLockedToken0: number,
  totalValueLockedToken1: number,
  weight: number,
}

export type TokenData = {
  address: string,
  derivedETH: number,
  name: string,
  symbol: string,
  totalSupply: number,
  totalValueLocked: number,
  txCount: number,
  untrackedVolumeUSD: number,
  volume: number,
  volumeUSD: number,
}

export type PoolData = {
  address: string,
  token0: TokenData,
  token1: TokenData,
  token0Price: number,
  token1Price: number,
  volumeUSD: number,
  feesUSD: number,
  txCount: number,
  totalValueLockedToken0: number,
  totalValueLockedToken1: number,
}

export type PoolDayData = {
  date: string,
  address: string,
  volumeUSD: number,
  tvlUSD: number,
  txCount: number,
}

export type BulkPoolsAnalytics = {
  [address: string]: PoolAnalytics[]
}

export type BulkAnalyticsRequest = {
  [address: string]: [string]
}
