import { CHAINS } from '../src/constants/chains';
import { UniswapV3 } from '../src/dexes/uniswap/v3';
import BigNumber from '../src/utils/bignumber';
import { PoolDayData } from '../src/dexes/types';
import { UNISWAP_V3 } from '../src';

const service = new UniswapV3(CHAINS.MAINNET);
const DOG_ADDRESS = '0xbaac2b4491727d78d2b78815144570b9f2fe8899';
const HSM_ADDRESS = '0xe356025459d8222b068c474d50d93933f7316610';
describe('UniswapV3 integration tests', () => {
  describe('Basic Tests', () => {
    it('mainnet should chain be supported', () => {
      expect(UniswapV3.isChainSupported(CHAINS.MAINNET)).toEqual(true);
    });

    it("ropsten shouldn't be supported", () => {
      expect(UniswapV3.isChainSupported(CHAINS.ROPSTEN)).toEqual(false);
    });
  });

  describe('Token Data', () => {
    it('should return token data for DOG', async () => {
      const token = await service.getTokenData(DOG_ADDRESS);
      expect(token?.name).toEqual('The Doge NFT');
      expect(token?.symbol).toEqual('DOG');
    });

    it('should return historic data for token DOG', async () => {
      const mock = {
        source: UNISWAP_V3,
        address: '0xbaac2b4491727d78d2b78815144570b9f2fe8899',
        derivedETH: new BigNumber('0.0000008750625911134898757997152569684134'),
        name: 'The Doge NFT',
        symbol: 'DOG',
        totalValueLocked: new BigNumber('907220172.009883850231405117'),
        txCount: new BigNumber('5676'),
        untrackedVolumeUSD: new BigNumber(
          '52742716.81743021625159454334182219'
        ),
        volume: new BigNumber('5565626341.62730978131209568'),
        volumeUSD: new BigNumber('57369542.67170267775957625595010653'),
      };
      const token = await service.getTokenData(DOG_ADDRESS, 14901000);
      expect(token).toEqual(mock);
    });
    it('should return null historic data for 0x671ee71e1d285606c784ae9f262bc0d87e315e6c', async () => {
      const mock = null;
      const token = await service.getTokenData(
        '0x671ee71e1d285606c784ae9f262bc0d87e315e6c',
        13019640
      );
      expect(token).toEqual(mock);
    });
    it('should return no token data - 0xe356025459d8222b068c474d50d93933f7316610', async () => {
      const token = await service.getTokenData(
        '0xe356025459d8222b068c474d50d93933f7316610'
      );
      expect(token).toEqual(null);
    });

    it('should return no token pools - 0xe356025459d8222b068c474d50d93933f7316610', async () => {
      const token = await service.getTokenPools(
        '0xe356025459d8222b068c474d50d93933f7316610'
      );
      expect(token).toEqual([]);
    });

    it('should return 1 token pool - 0xe356025459d8222b068c474d50d93933f7316610', async () => {
      const pools = await service.getTokenPools(
        '0x671ee71e1d285606c784ae9f262bc0d87e315e6c'
      );
      expect(pools.length).toEqual(1);
      const pool = pools[0];
      expect(pool.address).toEqual(
        '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095'
      );
      expect(Object.keys(pool).sort()).toEqual(
        [
          'source',
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
        ].sort()
      );
    });
  });

  describe('Pool Data', () => {
    it('should return pool data for Half Suit Meebit', async () => {
      const poolsData = await service.getPoolsData([
        '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095',
      ]);
      expect(poolsData.length).toEqual(1);
      expect(Object.keys(poolsData[0]).sort()).toEqual(
        [
          'source',
          'address',
          'token0',
          'token1',
          'txCount',
          'volumeUSD',
          'token0Price',
          'token1Price',
          'totalValueLockedUSD',
          'totalValueLockedToken0',
          'totalValueLockedToken1',
        ].sort()
      );
    });
    it('should return empty pool data', async () => {
      const poolsData = await service.getPoolsData([
        '0x671ee71e1d285606c784ae9f262bc0d87e315e6c',
      ]);
      expect(poolsData.length).toEqual(0);
    });

    it('should return past pool data for Half Suit Meebit', async () => {
      const poolsData = await service.getPoolsPastData(
        ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9095'],
        13401000
      );
      const poolData = poolsData[0];
      expect(poolData.address).toEqual(
        '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095'
      );
      expect(poolData.token0.address).toEqual(
        '0x671ee71e1d285606c784ae9f262bc0d87e315e6c'
      );
      expect(poolData.token1.address).toEqual(
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      );
      expect(poolData.address).toEqual(
        '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095'
      );
      expect(poolData.txCount.toString()).toEqual('22');
      expect(poolData.volumeUSD.toString()).toEqual(
        '5090.869503999055973916256440568868'
      );
      expect(poolData.token0Price.toString()).toEqual(
        '2087.112107191257175815740566857251'
      );
      expect(poolData.token1Price.toString()).toEqual(
        '0.0004791309468017775090548934267174422'
      );
      expect(poolData.totalValueLockedToken0.toString()).toEqual(
        '10233.206769724493713198'
      );
      expect(poolData.totalValueLockedToken1.toString()).toEqual(
        '0.004106219564178342'
      );
    });

    it('should return past day data for LP of Half Suit Meebit vault', async () => {
      const poolsData = await service.getPoolsDayDatas(
        ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9095'],
        13401000
      );

      const poolData1 = poolsData.find(
        (i: PoolDayData) => i.date === 1629244800
      );
      const poolData2 = poolsData.find(
        (i: PoolDayData) => i.date === 1629417600
      );
      const poolData3 = poolsData.find(
        (i: PoolDayData) => i.date === 1629590400
      );

      expect(poolData1).toEqual({
        source: UNISWAP_V3,
        address: '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095',
        date: 1629244800,
        tvlUSD: new BigNumber('12.24018476402591085175615458988112'),
        txCount: new BigNumber('5'),
        volumeUSD: new BigNumber('0'),
      });
      expect(poolData2).toEqual({
        source: UNISWAP_V3,
        address: '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095',
        date: 1629417600,
        tvlUSD: new BigNumber('12.29394617138116527978772171676333'),
        txCount: new BigNumber('1'),
        volumeUSD: new BigNumber('16.30747729619707360260094145799149'),
      });
      expect(poolData3).toEqual({
        source: UNISWAP_V3,
        address: '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095',
        date: 1629590400,
        tvlUSD: new BigNumber('24.99475530520431231738711311976973'),
        txCount: new BigNumber('3'),
        volumeUSD: new BigNumber('3171.796261282185481938073145321421'),
      });
    });
    it('should return DOG token pools data with weight', async () => {
      const poolsData = await service.getTokenPoolsData(DOG_ADDRESS, []);
      expect(poolsData.length > 0).toEqual(true);
      expect(
        poolsData.filter(poolData => Object.keys(poolData).includes('weight'))
          .length > 0
      ).toEqual(true);
    });
    it('should return empty token pools data', async () => {
      const poolsData = await service.getTokenPoolsData(
        '0xc260d73773a1e0cd7c294310f871fdc1cfbf9095',
        []
      );
      expect(poolsData.length === 0).toEqual(true);
    });

    it('should return bulk token pools data with weights (DOG, Half Suit Meebit)', async () => {
      const poolsDatas = await service.getBulkPoolsData({
        [DOG_ADDRESS]: [
          '0xd0a927837cff32d55e5d8fad5145562e7ad85f30',
          '0x7731ca4d00800b6a681d031f565deb355c5b77da',
        ],
        [HSM_ADDRESS]: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9095'],
        fake: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9094'],
      });

      // @ts-ignore
      expect(poolsDatas[DOG_ADDRESS].length).toEqual(2);
      // @ts-ignore
      expect(poolsDatas[HSM_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDatas['fake'].length).toEqual(0);
      expect(Object.keys(poolsDatas).length).toEqual(3);
    });

    it('should return bulk past day data by tiemstamp (DOG, Half Suit Meebit)', async () => {
      const poolsDayDatas = await service.getBulkPoolsDayDatas(
        {
          [DOG_ADDRESS]: [
            '0xd0a927837cff32d55e5d8fad5145562e7ad85f30',
            '0x7731ca4d00800b6a681d031f565deb355c5b77da',
          ],
          [HSM_ADDRESS]: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9095'],
          fake: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9094'],
        },
        13401000
      );

      // @ts-ignore
      expect(poolsDayDatas[DOG_ADDRESS].length).toEqual(2);
      // @ts-ignore
      expect(poolsDayDatas[HSM_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDayDatas['fake'].length).toEqual(1);
      expect(Object.keys(poolsDayDatas).length).toEqual(3);
      // @todo merge test
    });
  });

  describe('ETH price', () => {
    it('should return ETH price', async () => {
      const ethPrice = await service.getEthPrice();
      expect(ethPrice).not.toEqual(0);
    });
    it('should return past ETH price', async () => {
      const ethPrice = await service.getEthPrice(13019640);
      expect(ethPrice.toString()).toEqual(
        '3285.337343994361572420319851159309'
      );
    });
    it('should return 0, because the requested price was before Uniswap V3 launched', async () => {
      const ethPrice = await service.getEthPrice(1);
      expect(ethPrice.toString()).toEqual('0');
    });
  });
});
