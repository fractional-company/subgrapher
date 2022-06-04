import { formatTokenName, formatTokenSymbol } from '../src/utils/tokens';
import { WETH_ADDRESS } from '../src/dexes/constants';
import { get2DayChange, getPercentChange } from '../src/utils/percentage';

describe('Format utils', () => {
  it('should format token name The Doge NFT', async () => {
    const name = formatTokenName('0xbaac2b4491727d78d2b78815144570b9f2fe8899', 'The Doge NFT');
    expect(name).toEqual('The Doge NFT');
  });
  it('should format token symbol DOG', async () => {
    const symbol = formatTokenSymbol('0xbaac2b4491727d78d2b78815144570b9f2fe8899', 'DOG');
    expect(symbol).toEqual('DOG');
  });
  it('should format token symbol WETH', async () => {
    const symbol = formatTokenSymbol(WETH_ADDRESS, 'ETH');
    expect(symbol).toEqual('ETH');
  });
  it('should format token name WETH', async () => {
    const name = formatTokenName(WETH_ADDRESS, 'ETH');
    expect(name).toEqual('Ether');
  });
});

describe('percentage utils', () => {
  it('should get the right percentage change', async () => {
    const change = getPercentChange('100', '120');
    expect(change).toEqual(-16.666666666666664);
  });

  it('should get the right 2 day percentage change', async () => {
    const changes = get2DayChange('80', '120', '160');
    expect(changes).toEqual([-40, -0]);
  });
});
