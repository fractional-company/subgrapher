import { CHAINS } from '../src/constants/chains';
import { Dexes, SUSHISWAP_V1, UNISWAP_V3 } from '../src';

const service = new Dexes(CHAINS.MAINNET);
const DOG_ADDRESS = '0xbaac2b4491727d78d2b78815144570b9f2fe8899';
describe('Dexes integration tests', () => {
  describe('ETH price', () => {
    it('should return ETH price', async () => {
      const ethPrice = await service.getEthPrice();
      expect(ethPrice).not.toEqual('0');
    });

    it('should return max ETH price for block 13019640', async () => {
      const ethPrice = await service.getEthPrice(13019640);
      expect(ethPrice?.toString()).toEqual('3288.370898345506552593266885555588');
    });

    it('should return SUSHISWAP_V1, UNISWAP_V3 ETH price on block 13019640', async () => {
      const ethPrices = await service.getEthPrices(13019640, [SUSHISWAP_V1, UNISWAP_V3]);
      expect(ethPrices.length).toEqual(2);
    });

    it('should return 3 ETH quotes for block 13019640', async () => {
      const ethPrices = await service.getEthPrices(13019640);
      expect(ethPrices.length === 3).toEqual(true);
    });

    it('should return DOG price', async () => {
      const dogPrice = await service.getTokenPrice(DOG_ADDRESS);
      expect(dogPrice).not.toEqual('0');
    });

    it('should return max DOG price for block 14921977', async () => {
      const dogPrice = await service.getTokenPrice(DOG_ADDRESS, 14921977);
      expect(dogPrice?.toString()).toEqual('0.0000008500457886489529617351237728412639');
    });

    it('should return 2 DOG quotes for block 14921977', async () => {
      const dogPrices = await service.getTokenPrices(DOG_ADDRESS, 14921977);
      expect(dogPrices.length === 2).toEqual(true);
    });
  });

  describe('LP pools', () => {
    it('should return all LPs for DOG', async () => {
      const dogPrices = await service.getTokenPools(DOG_ADDRESS);
      expect(dogPrices.length > 1).toEqual(true);
    });
  });
});
