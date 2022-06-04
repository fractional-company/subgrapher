import { startOfMinute, subDays, subWeeks } from 'date-fns';
import { GraphQLClient } from 'graphql-request';
import { blockQuery, blocksTimestampQuery, blocksNumbersQuery } from './queries';

type Block = {
  number: number;
  timestamp: number;
  id: string;
};

type BlockData = {
  number: string;
  timestamp: string;
  id: string;
};

const mapBlock = function(blockData: BlockData): Block {
  return {
    id: String(blockData?.id),
    number: Number(blockData?.number),
    timestamp: Number(blockData?.timestamp),
  };
};

export const fetchOneDayBlock = async (
  client: GraphQLClient,
): Promise<Block> => {
  const date = startOfMinute(subDays(Date.now(), 1));
  // @ts-ignore
  const start = Math.floor(date / 1000);
  // @ts-ignore
  const end = Math.floor(date / 1000) + 600;
  const response = await client.request(blockQuery, {
    start,
    end,
  });

  return mapBlock(response?.blocks[0]);
};

export const fetchTwoDayBlock = async (
  client: GraphQLClient,
): Promise<Block> => {
  const date = startOfMinute(subDays(Date.now(), 2));
  // @ts-ignore
  const start = Math.floor(date / 1000);
  // @ts-ignore
  const end = Math.floor(date / 1000) + 600;

  const response = await client.request(blockQuery, {
    start,
    end,
  });

  return mapBlock(response?.blocks[0]);
};

export const fetchSevenDayBlock = async (
  client: GraphQLClient,
): Promise<Block> => {
  const date = startOfMinute(subWeeks(Date.now(), 1));
  // @ts-ignore
  const start = Math.floor(date / 1000);
  // @ts-ignore
  const end = Math.floor(date / 1000) + 600;

  const response = await client.request(blockQuery, {
    start,
    end,
  });

  return mapBlock(response?.blocks[0]);
};

export const fetchBlocksByNumbers = async (
  client: GraphQLClient,
  blockNumbers: (number | string)[],
): Promise<Block[]> => {
  const response = await client.request(blocksNumbersQuery, {
    blockNumbers,
  });

  return response?.blocks?.map((blockData: BlockData) => mapBlock(blockData));
};

export const fetchBlockByTimestamp = async (
  client: GraphQLClient,
  timestamp: number | string,
): Promise<Block> => {
  const response = await client.request(blocksTimestampQuery, {
    timestamp,
  });

  return mapBlock(response?.blocks[0]);
};
