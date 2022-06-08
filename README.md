# @fractional-company/subgrapher

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Simple utility for querying popular Subgraphs.
> 
> Supported Subgraphs: Blocks, Uniswap V2, Uniswap V3 and Sushiswap.

## Install

```bash
npm install @fractional-company/subgrapher
```

## Usage

## Ethereum Blocks

### Get the nearest block based on a timestamp

```ts
import { Blocks, CHAINS } from '@fractional-company/subgrapher';

const service = new Blocks(CHAINS.MAINNET);
await service.getNearestBlockByTimestamp(1654313448);
//=> {id: '0xd357c32704daa1147461c786a9fd6ee29d2119b2f416aefe253b231b20b99a3a', number: 14901000, timestamp: 1654313446}
```
#### getNearestBlockByTimestamp(timestamp)

#### timestamp

Type: `number` - *(timestamp)*

### Get blocks based on block numbers

```ts
import { Blocks, CHAINS } from '@fractional-company/subgrapher';

const service = new Blocks(CHAINS.MAINNET);
await service.getBlocksByNumbers([14901000]);
//=> [{id: '0xd357c32704daa1147461c786a9fd6ee29d2119b2f416aefe253b231b20b99a3a', number: 14901000, timestamp: 1654313446}]
```

#### getNearestBlockByTimestamp(blockNumbers)

#### blockNumbers

Type: `array` - *(array of block numbers)*

### Get block based on current date sub one, two or seven day/s

```ts
import { Blocks, CHAINS } from '@fractional-company/subgrapher';

const service = new Blocks(CHAINS.MAINNET);

// now sub 1 day
await service.fetchOneDayBlock();
//=> {id: '0x0e7ae8b9cbdb9f12bc2add28f31e21fe2225f06d9a7d44a5eb2742b54f8b6321',number: 14919711,timestamp: 1654588984}

// now sub 2 days
await service.fetchTwoDayBlock();
//=> {id: '0xcaf1a8fe520abaaf4e5b0de91c4caeafcbea4add66192e45dd0310b9167d7058',number: 14913845,timestamp: 1654502582} 

// now sub 7 days
await service.fetchSevenDayBlock();
//=> {id: '0xd6e300ce35886708485d99c75211f22ca4747626e65187abb25d068923490d5f',number: 14883711,timestamp: 1654070592}
```

## Dexes

Supported:
- SUSHISWAP 
- UNISWAP V2 
- UNISWAP V3

### Get current or historical ETH price

```ts
import { DEXES, CHAINS } from '@fractional-company/subgrapher';

const service = new DEXES(CHAINS.MAINNET);

// ETH price
const blockNumber = 14901000;
service.getEthPrice(blockNumber, method, sources)
//=> BigNumber

// Array of  ETH prices (across dexes) 
service.getEthPrices(blockNumber, sources)
//=> [BigNumber,BigNumber,BigNumber]
```
#### getEthPrice(blockNumber?, method?, sources?)
#### getEthPrices(blockNumber?, sources?)
#### blockNumber

Type: `number` - *(block number)*

#### method

Type: `string`

Default: `max`

##### sources

Type: `array` - *(array of sources to fetch prices from)*

Default: `[SUSHISWAP_V1, UNISWAP_V2, UNISWAP_V3]`

### Get current or historical ERC20 token price

```ts
import { DEXES, CHAINS } from '@fractional-company/subgrapher';

const service = new DEXES(CHAINS.MAINNET);

// ETH price
const blockNumber = 14901000;
service.getTokenPrice(contractAddress, blockNumber, method, sources)
//=> BigNumber

// Array of  prices (across dexes) 
service.getTokenPrices(contractAddress, blockNumber, sources)
//=> [BigNumber,BigNumber,BigNumber]
```
#### getTokenPrice(contractAddress, blockNumber?, method?, sources?)
#### getTokenPrices(contractAddress, blockNumber?, sources?)

#### contractAddress

Type: `string` -  *(ERC 20 token contract Address)*

#### blockNumber

Type: `number`  - *(the block number)*

#### method

Type: `string`

Default: `max`

##### sources

Type: `array` - *(array of sources to fetch prices from)*

Default: `[SUSHISWAP_V1, UNISWAP_V2, UNISWAP_V3]`

### Get ERC20 token pools

```ts
import { DEXES, CHAINS } from '@fractional-company/subgrapher';

const service = new DEXES(CHAINS.MAINNET);

service.getTokenPools(contractAddress)
//=> [{ weight?: number,  source: string,  address: string,  token0: TokenData,  token1: TokenData,  token0Price: BigNumber,  token1Price: BigNumber,  volumeUSD: BigNumber,  txCount: BigNumber,  totalValueLockedUSD: BigNumber,  totalValueLockedToken0: BigNumber,  totalValueLockedToken1: BigNumber}]

```
#### getTokenPools(contractAddress)

#### contractAddress

Type: `string` - *(ERC 20 contract address)* 

[build-img]:https://github.com/fractional-company/subgrapher/actions/workflows/release.yml/badge.svg

[build-url]:https://github.com/fractional-company/subgrapher/actions/workflows/release.yml

[downloads-img]:https://img.shields.io/npm/dt/@fractional-company/subgrapher

[downloads-url]:https://www.npmtrends.com/@fractional-company/subgrapher

[npm-img]:https://img.shields.io/npm/v/@fractional-company/subgrapher

[npm-url]:https://www.npmjs.com/package/@fractional-company/subgrapher

[issues-img]:https://img.shields.io/github/issues/fractional-company/subgrapher

[issues-url]:https://github.com/fractional-company/subgrapher/issues

[codecov-img]:https://codecov.io/gh/fractional-company/subgrapher/branch/main/graph/badge.svg

[codecov-url]:https://codecov.io/gh/fractional-company/subgrapher

[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[semantic-release-url]:https://github.com/semantic-release/semantic-release
