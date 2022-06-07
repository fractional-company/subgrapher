import { CHAINS } from '../src/constants/chains';
import { UniswapV2 } from '../src/dexes/uniswap/v2';
import BigNumber from './../src/utils/BigNumber';
import { PoolDayData } from '../src/dexes/types';

const service = new UniswapV2(CHAINS.MAINNET);
const FOX_ADDRESS = '0xf5d990c5e284d2b4dee8473048ec869032f5a3b2';
const PBAYC_ADDRESS = '0x0441f4355d918d60e59d42e37ebcdf94de2727c3';
describe('UniswapV2 integration tests', () => {

  describe('Basic Tests', () => {
    it('mainnet should chain be supported', async () => {
      expect(UniswapV2.isChainSupported(CHAINS.MAINNET)).toEqual(true);
    });

    it('ropsten shouldn\'t be supported', async () => {
      expect(UniswapV2.isChainSupported(CHAINS.ROPSTEN)).toEqual(false);
    });
  });

  describe('Token Data', () => {
    it('should return token data for Fox vault', async () => {
      const token = await service.getTokenData(FOX_ADDRESS);
      expect(token?.name).toEqual('Fox vault');
      expect(token?.symbol).toEqual('FOX');
    });

    it('should return historic data for token FOX', async () => {
      const mock = {
        address: '0xf5d990c5e284d2b4dee8473048ec869032f5a3b2',
        symbol: 'FOX',
        name: 'Fox vault',
        totalValueLocked: new BigNumber('0.000000000000014551'),
        txCount: new BigNumber('5'),
        untrackedVolumeUSD: new BigNumber('76.30795377259072457282647504828243'),
        volume: new BigNumber('10.89826430245960294'),
        volumeUSD: new BigNumber('0'),
        derivedETH: new BigNumber('0'),
      };
      const token = await service.getTokenData(FOX_ADDRESS, 14901000);
      expect(token).toEqual(mock);
    });
    it('should return null historic data for 0x671ee71e1d285606c784ae9f262bc0d87e315e6c', async () => {
      const mock = null;
      const token = await service.getTokenData('0x671ee71e1d285606c784ae9f262bc0d87e315e6c', 13019640);
      expect(token).toEqual(mock);
    });
    it('should return no token data - 0xe356025459d8222b068c474d50d93933f7316610', async () => {
      const token = await service.getTokenData('0xe356025459d8222b068c474d50d93933f7316610');
      expect(token).toEqual(null);
    });

    it('should return no token pools - 0xe356025459d8222b068c474d50d93933f7316610', async () => {
      const token = await service.getTokenPools('0xe356025459d8222b068c474d50d93933f7316610');
      expect(token).toEqual([]);
    });

    it('should return 1 token pool - 0xf5d990c5e284d2b4dee8473048ec869032f5a3b2', async () => {
      const pools = await service.getTokenPools(FOX_ADDRESS);
      expect(pools.length).toEqual(1);
      const pool = pools[0];
      expect(pool.address).toEqual('0x6f780226518a05c7d523e27fda2923ed80a6bae6');
      expect((Object.keys(pool)).sort()).toEqual([
        'address',
        'token0',
        'token0Price',
        'token1',
        'token1Price',
        'totalValueLockedToken0',
        'totalValueLockedToken1',
        'totalValueLockedUSD',
        'txCount',
        'volumeUSD',
      ].sort());
    });
  });

  describe('Pool Data', () => {
    it('should return pool data for Fox vault', async () => {
      const poolsData = await service.getPoolsData(['0x6f780226518a05c7d523e27fda2923ed80a6bae6']);
      expect(poolsData.length).toEqual(1);
      expect((Object.keys(poolsData[0])).sort()).toEqual(['address',
        'token0',
        'token1',
        'txCount',
        'volumeUSD',
        'token0Price',
        'token1Price',
        'totalValueLockedUSD',
        'totalValueLockedToken0',
        'totalValueLockedToken1',
      ].sort());
    });
    it('should return empty pool data', async () => {
      const poolsData = await service.getPoolsData(['0x671ee71e1d285606c784ae9f262bc0d87e315e6c']);
      expect(poolsData.length).toEqual(0);
    });

    it('should return past pool data for PBAYC', async () => {
      const poolsData = await service.getPoolsPastData(['0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d'], 13921672);
      const poolData = poolsData[0];
      expect(poolData.address).toEqual('0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d');
      expect(poolData.token0.address).toEqual(PBAYC_ADDRESS);
      expect(poolData.token1.address).toEqual('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
      expect(poolData.txCount.toString()).toEqual('104');
      expect(poolData.volumeUSD.toString()).toEqual('0');
      expect(poolData.token0Price.toString()).toEqual('408035.0863471973987418891045115962');
      expect(poolData.token1Price.toString()).toEqual('0.000002450769635896211036864679914811175');
      expect(poolData.totalValueLockedToken0.toString()).toEqual('8315.235280813108477741');
      expect(poolData.totalValueLockedToken1.toString()).toEqual('0.02037872614154967');
    });

    it('should return past day data for LP of PBAYC vault', async () => {
      const poolsData = await service.getPoolsDayDatas(['0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d'], 13421672);
      let poolData1 = poolsData.find((i: PoolDayData) => i.date === 1640995200);
      let poolData2 = poolsData.find((i: PoolDayData) => i.date === 1640822400);
      let poolData3 = poolsData.find((i: PoolDayData) => i.date === 1640736000);
      //
      expect(poolData1).toEqual({
        address: '0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d',
        date: 1640995200,
        tvlUSD: new BigNumber('8315.255659539250027411'),
        txCount: new BigNumber('1'),
        volumeUSD: new BigNumber('0'),
      });
      expect(poolData2).toEqual({
        address: '0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d',
        date: 1640822400,
        tvlUSD: new BigNumber('3315.286302296463539332'),
        txCount: new BigNumber('2'),
        volumeUSD: new BigNumber('0'),
      });
      expect(poolData3).toEqual({
        address: '0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d',
        date: 1640736000,
        tvlUSD: new BigNumber('82324.488987331541934782'),
        txCount: new BigNumber('9'),
        volumeUSD: new BigNumber('0'),
      });
    });
    it('should return FOX token pools data with weight', async () => {
      const poolsData = await service.getTokenPoolsData(FOX_ADDRESS, []);
      expect(poolsData.length > 0).toEqual(true);
      expect(poolsData.filter((poolData) => Object.keys(poolData).includes('weight')).length > 0).toEqual(true);
    });
    it('should return empty token pools data', async () => {
      const poolsData = await service.getTokenPoolsData('0xc260d73773a1e0cd7c294310f871fdc1cfbf9095', []);
      expect(poolsData.length === 0).toEqual(true);
    });

    it('should return bulk token pools data with weights (FOX, PBAYC)', async () => {
      const poolsDatas = await service.getBulkPoolsData({
        [FOX_ADDRESS]: ['0x6f780226518a05c7d523e27fda2923ed80a6bae6'],
        [PBAYC_ADDRESS]: ['0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d'],
        fake: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9094'],
      });

      // @ts-ignore
      expect(poolsDatas[FOX_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDatas[PBAYC_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDatas['fake'].length).toEqual(0);
      expect(Object.keys(poolsDatas).length).toEqual(3);
    });

    it('should return bulk past day data by tiemstamp (FOX, PBAYC)', async () => {
      const poolsDayDatas = await service.getBulkPoolsDayDatas({
        [FOX_ADDRESS]: ['0x6f780226518a05c7d523e27fda2923ed80a6bae6'],
        [PBAYC_ADDRESS]: ['0x2aeb4cb9a9bff48cdeef591af1d63d8ee0b8bb6d'],
        fake: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9094'],
      }, 13401000);

      // @ts-ignore
      expect(poolsDayDatas[FOX_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDayDatas[PBAYC_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDayDatas['fake'].length).toEqual(1);
      expect(Object.keys(poolsDayDatas).length).toEqual(3);
      // @todo merge test
    });
  });

  describe('ETH price', () => {
    it('should return ETH price', async () => {
      const ethPrice = await service.getEthPrice();
      expect(ethPrice).not.toEqual('0');
    });
    it('should return past ETH price', async () => {
      const ethPrice = await service.getEthPrice(13019640);
      expect(ethPrice.toString()).toEqual('3288.370898345506552593266885555588');
    });
    it('should return 0, because the requested price was before Uniswap V2 launched', async () => {
      const ethPrice = await service.getEthPrice(1);
      expect(ethPrice.toString()).toEqual('0');
    });
  });
});
