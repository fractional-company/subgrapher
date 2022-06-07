import type {BulkPoolsAnalytics, PoolAnalytics} from '../dexes/types';

export function mergePools(bulk: boolean = true, ...args: PoolAnalytics[] | BulkPoolsAnalytics[]): Object | [] {
  if (!bulk) {
    // @ts-ignore
    return args.flatMap((pools: any[]) => pools)
  }

  // @ts-ignore
  return args.reduce((carry, bulkTokenPoolsAnalytics: BulkPoolsAnalytics) => {
    let tokenAddresses = Object.keys(bulkTokenPoolsAnalytics)
    tokenAddresses.forEach(tokenAddress => {
      carry[tokenAddress] = carry[tokenAddress]
        ? carry[tokenAddress].concat(bulkTokenPoolsAnalytics[tokenAddress])
        : bulkTokenPoolsAnalytics[tokenAddress]
    })

    return carry
  }, {})
}
