import {useQuery} from '@tanstack/react-query';
import {usePublicClient, useWriteContract} from 'wagmi';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';

/**
 * One transaction to the bills contract, followed from the wallet's confirmation to its block.
 *
 * The caller sends it with `writeContract`, which wagmi types against the contract's ABI. The outcome
 * comes from the transaction receipt, not from the wallet's "submitted": only a receipt says whether
 * the contract did what was asked.
 */
export function useBillsTransaction() {
    const contract = useDisplayedContract('BillsOfExchange');
    const {writeContract, data: hash, status: writeStatus, error: writeError, reset} = useWriteContract();

    // Not wagmi's useWaitForTransactionReceipt: on a reverted transaction it throws instead of returning
    // the receipt, and the query then retries for seconds before reporting a vague error. viem's action
    // returns the receipt with status 'reverted', which is exactly the outcome the page has to show.
    const publicClient = usePublicClient({chainId: contract.chainId});
    const {data: receipt, status: receiptStatus, error: receiptError} = useQuery({
        queryKey: ['bills-transaction-receipt', contract.chainId, hash],
        queryFn: () => publicClient!.waitForTransactionReceipt({hash: hash!}),
        enabled: hash !== undefined && publicClient !== undefined,
        staleTime: Infinity, // a receipt never changes
    });

    return {contract, writeContract, hash, writeStatus, writeError, receipt, receiptStatus, receiptError, reset};
}

export type BillsTransaction = ReturnType<typeof useBillsTransaction>;
