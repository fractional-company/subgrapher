import type {BulkPoolsAnalytics, PoolAnalytics} from '../dexes/types';

export default function mergePools(bulk: boolean = true, ...args: PoolAnalytics[] | BulkPoolsAnalytics[]): Object | [] {
  if (!bulk) {
    return args.flatMap((pools: []) => pools)
  }

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
