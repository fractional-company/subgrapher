import BigNumber from './BigNumber';

/**
 *
 * @param values
 */
export const median = function(values: BigNumber[] | number[]) {
  if (values.length === 0) throw new Error('No inputs');

  values.sort(function(a, b) {
    // @ts-ignore
    return a - b;
  });

  let half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  // @ts-ignore
  return (values[half - 1] + values[half]) / 2.0;
};
