import { GraphQLClient } from 'graphql-request';
import { ethPriceQuery, ethPriceTimeTravelQuery } from './queries';
import BigNumber from '../../../utils/bignumber';

export const getEthPrice = async (
  client: GraphQLClient
): Promise<BigNumber> => {
  const { bundles } = await client.request(ethPriceQuery);

  return new BigNumber(
    (bundles.length > 0 ? bundles[0]?.ethPriceUSD : 0).toString()
  );
};

export async function getPastEthPrice(
  client: GraphQLClient,
  blockNumber: number
): Promise<BigNumber> {
  const { bundles } = await client.request(ethPriceTimeTravelQuery, {
    block: { number: blockNumber },
  });

  return new BigNumber(
    (bundles.length > 0 ? bundles[0]?.ethPriceUSD : 0).toString()
  );
}
