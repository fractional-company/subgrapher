import { CHAINS } from '../src/constants/chains';
import BigNumber from './../src/utils/BigNumber';
import { PoolDayData } from '../src/dexes/types';
import { SushiswapV1 } from '../src/dexes/sushiswap/v1';

const service = new SushiswapV1(CHAINS.MAINNET);
const GAINZY_ADDRESS = '0x698ad151125deb394e62154245d6129e9068c483';
const DOG_ADDRESS = '0xbaac2b4491727d78d2b78815144570b9f2fe8899';
describe('SushiswapV1 integration tests', () => {

  describe('Basic Tests', () => {
    it('mainnet should chain be supported', async () => {
      expect(SushiswapV1.isChainSupported(CHAINS.MAINNET)).toEqual(true);
    });

    it('ropsten shouldn\'t be supported', async () => {
      expect(SushiswapV1.isChainSupported(CHAINS.ROPSTEN)).toEqual(false);
    });
  });

  describe('Token Data', () => {
    it('should return token data for DOG vault', async () => {
      const token = await service.getTokenData(DOG_ADDRESS);
      expect(token?.name).toEqual('The Doge NFT');
      expect(token?.symbol).toEqual('DOG');
    });

    it('should return historic data for token DOG', async () => {
      const mock = {
        address: '0xbaac2b4491727d78d2b78815144570b9f2fe8899',
        symbol: 'DOG',
        name: 'The Doge NFT',
        totalValueLocked: new BigNumber('913788834.49764951198953669'),
        txCount: new BigNumber('23698'),
        untrackedVolumeUSD: new BigNumber('647085497.127954314036435396106758'),
        volume: new BigNumber('39771575630.01057918505159614'),
        volumeUSD: new BigNumber('621325743.3059057528661740262024399'),
        derivedETH: new BigNumber('0.0000008694414856041912396819268267608504'),
      };
      const token = await service.getTokenData(DOG_ADDRESS, 14901000);
      expect(token).toEqual(mock);
    });

    it('should return null historic data for 0x671ee71e1d285606c784ae9f262bc0d87e315e6c', async () => {
      const mock = null;
      const token = await service.getTokenData('0x671ee71e1d285606c784ae9f262bc0d87e315e6c', 13019640);
      expect(token).toEqual(mock);
    });
    it('should return no token data - 0xe356025459d8222b068c474d50d93933f7316610', async () => {
      const token = await service.getTokenData('0xe356025459d8222b068c474d50d93933f7316611');
      expect(token).toEqual(null);
    });

    it('should return no token pools - 0xe356025459d8222b068c474d50d93933f7316610', async () => {
      const token = await service.getTokenPools('0xe356025459d8222b068c474d50d93933f7316611');
      expect(token).toEqual([]);
    });

    it('should return 1 token pool - 0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1', async () => {
      const pools = await service.getTokenPools(DOG_ADDRESS);
      expect(pools.length).toEqual(4);
      const pool = pools[0];
      expect(pool.address).toEqual('0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1');
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
  //
  describe('Pool Data', () => {
    it('should return pool data for DOG vault', async () => {
      const poolsData = await service.getPoolsData(['0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1']);
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

    it('should return past pool data for DOG', async () => {
      const poolsData = await service.getPoolsPastData(['0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1'], 13921672);
      const poolData = poolsData[0];
      expect(poolData.address).toEqual('0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1');
      expect(poolData.token0.address).toEqual(DOG_ADDRESS);
      expect(poolData.token1.address).toEqual('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
      expect(poolData.txCount.toString()).toEqual('19780');
      expect(poolData.volumeUSD.toString()).toEqual('599197448.3476094313396586418571604');
      expect(poolData.token0Price.toString()).toEqual('643921.0679038065905838569802165952');
      expect(poolData.token1Price.toString()).toEqual('0.000001552985373277749250206219727446145');
      expect(poolData.totalValueLockedToken0.toString()).toEqual('686427188.48062578342026839');
      expect(poolData.totalValueLockedToken1.toString()).toEqual('1066.01138353058057246');
    });

    it('should return past day data for LP of DOG vault', async () => {
      const poolsData = await service.getPoolsDayDatas(['0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1'], 13421672);
      let poolData1 = poolsData.find((i: PoolDayData) => i.date === 1632355200);
      let poolData2 = poolsData.find((i: PoolDayData) => i.date === 1632268800);
      let poolData3 = poolsData.find((i: PoolDayData) => i.date === 1632182400);
      //
      expect(poolData1).toEqual({
        address: '0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1',
        date: 1632355200,
        tvlUSD: new BigNumber('17879428.61150545300798661193304203'),
        txCount: new BigNumber('101'),
        volumeUSD: new BigNumber('1453978.320649491561728244211797638'),
      });
      expect(poolData2).toEqual({
        address: '0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1',
        date: 1632268800,
        tvlUSD: new BigNumber('17292318.51639216207693395661968781'),
        txCount: new BigNumber('63'),
        volumeUSD: new BigNumber('300777.4775557679968393061668179756'),
      });
      expect(poolData3).toEqual({
        address: '0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1',
        date: 1632182400,
        tvlUSD: new BigNumber('15739215.31729059548917862917503196'),
        txCount: new BigNumber('73'),
        volumeUSD: new BigNumber('889868.4526756842226141831551181439'),
      });
    });
    it('should return DOG token pools data with weight', async () => {
      const poolsData = await service.getTokenPoolsData(DOG_ADDRESS, []);
      expect(poolsData.length > 0).toEqual(true);
      expect(poolsData.filter((poolData) => Object.keys(poolData).includes('weight')).length > 0).toEqual(true);
    });
    it('should return empty token pools data', async () => {
      const poolsData = await service.getTokenPoolsData('0xc260d73773a1e0cd7c294310f871fdc1cfbf9095', []);
      expect(poolsData.length === 0).toEqual(true);
    });

    it('should return bulk token pools data with weights (FOX, PBAYC)', async () => {
      const poolsDatas = await service.getBulkPoolsData({
        [DOG_ADDRESS]: [
          '0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1',
          '0x3a61dd70a05f6cffde20e22593932123da180052',
          '0xdf49c092eb7f67548f431f877a7408f45de7b1a8',
          '0xb95ab2cfdea14a5b0f8c8b9df9812a6657a6d6c2',
        ],
        [GAINZY_ADDRESS]: ['0xa2cdb4c734283ff9297fa238e5d945d731881405'],
        fake: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9094'],
      });

      // @ts-ignore
      expect(poolsDatas[GAINZY_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDatas[DOG_ADDRESS].length).toEqual(4);
      // @ts-ignore
      expect(poolsDatas['fake'].length).toEqual(0);
      expect(Object.keys(poolsDatas).length).toEqual(3);
    });

    it('should return bulk past day data by tiemstamp (FOX, PBAYC)', async () => {
      const poolsDayDatas = await service.getBulkPoolsDayDatas({
        [GAINZY_ADDRESS]: ['0xa2cdb4c734283ff9297fa238e5d945d731881405'],
        [DOG_ADDRESS]: [
          '0xc96f20099d96b37d7ede66ff9e4de59b9b1065b1',
          '0x3a61dd70a05f6cffde20e22593932123da180052',
          '0xdf49c092eb7f67548f431f877a7408f45de7b1a8',
          '0xb95ab2cfdea14a5b0f8c8b9df9812a6657a6d6c2',
        ],
        fake: ['0xc260d73773a1e0cd7c294310f871fdc1cfbf9094'],
      }, 13401000);
      // @ts-ignore
      expect(poolsDayDatas[GAINZY_ADDRESS].length).toEqual(1);
      // @ts-ignore
      expect(poolsDayDatas[DOG_ADDRESS].length).toEqual(4);
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
      expect(ethPrice.toString()).toEqual('3286.62748637855037241225750580985');
    });
    it('should return 0, because the requested price was before Uniswap V2 launched', async () => {
      const ethPrice = await service.getEthPrice(1);
      expect(ethPrice.toString()).toEqual('0');
    });
  });
});
