import { Blocks } from '../src/blocks';
import { CHAINS } from '../src/constants/chains';

const service = new Blocks(CHAINS.MAINNET);
const blockMock = {
  id: '0xd357c32704daa1147461c786a9fd6ee29d2119b2f416aefe253b231b20b99a3a',
  number: 14901000,
  timestamp: 1654313446,
};

describe('Blocks integration tests', () => {
  it('should return nearest block by timestamp', async () => {
    const block = await service.getNearestBlockByTimestamp(blockMock.timestamp + 2);
    expect(block).toEqual(blockMock);
  });
  it('should return block by block number', async () => {
    const timestamps = await service.getBlocksByNumbers([blockMock.number]);
    expect(timestamps[0]).toEqual(blockMock);
  });
  it('should return one day block', async () => {
    const block = await service.getOneDayBlock();
    expect(Object.keys(block)).toEqual([
      'id',
      'number',
      'timestamp',
    ]);
  });
  it('should return two day block', async () => {
    const block = await service.getTwoDayBlock();
    expect(Object.keys(block)).toEqual([
      'id',
      'number',
      'timestamp',
    ]);
  });
  it('should return seven day block', async () => {
    const block = await service.getSevenDayBlock();
    expect(Object.keys(block)).toEqual([
      'id',
      'number',
      'timestamp',
    ]);
  });
  it('should chain be supported', async () => {
    expect(Blocks.isChainSupported(CHAINS.MAINNET)).toEqual(true);
  });
});
