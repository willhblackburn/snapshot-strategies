import { formatUnits } from '@ethersproject/units';
import { multicall } from '../../utils';

export const author = 'WillBlackburn';
export const version = '0.1.1';

const abi = [
  'function balanceOf(address account) external view returns (uint256)'
];

export async function strategy(
  space,
  network,
  provider,
  addresses,
  options,
  snapshot
) {
  const blockTag = typeof snapshot === 'number' ? snapshot : 'latest';
  const response = await multicall(
    network,
    provider,
    abi,
    addresses.map((address: any) => [options.address, 'balanceOf', [address]]),
    { blockTag }
  );
  return Object.fromEntries(
    response.map((value, i) => [
      addresses[i],
      parseInt(formatUnits(value.toString(), 0)) >= (options.minBalance || 1) ? 1 : 0
    ])
  );
}
