import {gql} from "graphql-request";

const blockFieldsQuery = gql`
  fragment blockFields on Block {
    id
    number
    timestamp
  }
`;

export const blockQuery = gql`
  query blockQuery($start: Int!, $end: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $start, timestamp_lt: $end }
    ) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`;

export const blocksQuery = gql`
  query blocksQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $start: Int!
    $end: Int!
  ) {
    blocks(
      first: $first
      skip: $skip
      orderBy: number
      orderDirection: desc
      where: { timestamp_gt: $start, timestamp_lt: $end, number_gt: 9300000 }
    ) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`;

export const latestBlockQuery = gql`
  query latestBlockQuery {
    blocks(
      first: 1
      skip: 0
      orderBy: number
      orderDirection: desc
      where: { number_gt: 9300000 }
    ) {
      ...blockFields
    }
  }
  ${blockFieldsQuery}
`;

export const blocksNumbersQuery = gql`
  query blocksTimestamps($blockNumbers: [Int!]) {
    blocks(
      where: { number_in: $blockNumbers },
      orderBy: number,
      orderDirection: desc
    ) {
      ...blockFields
    }
  }
   ${blockFieldsQuery}
`;

export const blocksTimestampQuery = gql`
  query blocksTimestamps($timestamp: Int!) {
    blocks(
      first: 1,
      where: { timestamp_lte: $timestamp },
      orderBy: timestamp,
      orderDirection: desc
    ) {
      ...blockFields
    }
  }
   ${blockFieldsQuery}
`;
