import type {Address} from 'viem';
import {useReadContracts} from 'wagmi';
import {billsOfExchangeAbi} from '@site/src/generated';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';

export type HolderBills = { accepted: bigint; unaccepted: bigint };

/**
 * The bills an address holds in each ledger. Refreshed every 15 seconds, so that bills received
 * from someone else appear without reloading; after the holder's own transfer, call `refetch`.
 */
export function useHolderBills(holder: Address | undefined) {
    const {chainId, address, isDeployed} = useDisplayedContract('BillsOfExchange');
    const {data, status, refetch} = useReadContracts({
        allowFailure: false,
        contracts: [
            {abi: billsOfExchangeAbi, address, chainId, functionName: 'balanceOf', args: [holder!]},
            {abi: billsOfExchangeAbi, address, chainId, functionName: 'balanceOfUnaccepted', args: [holder!]},
        ],
        query: {enabled: isDeployed && holder !== undefined, refetchInterval: 15_000},
    });
    const bills: HolderBills | undefined = data === undefined ? undefined : {accepted: data[0], unaccepted: data[1]};
    return {bills, status, refetch};
}
