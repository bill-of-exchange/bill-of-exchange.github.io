import {useReadContracts} from 'wagmi';
import {billsOfExchangeAbi} from '@site/src/generated';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {type BillDenomination, currencySymbol} from './formatBills';

// The getters that make up the text of the bill: the stable interface of specification §3.6.
// Their order here is the order of the values returned by the multicall below.
const TERM_GETTERS = [
    'DRAWER_NAME',
    'DRAWEE_NAME',
    'ORDER',
    'TIME_OF_PAYMENT',
    'SUM_PER_BILL',
    'CURRENCY',
    'DRAWER_ETH_ADDRESS',
    'DRAWEE_ETH_ADDRESS',
    'LEGAL_SIGNATURE_STATEMENT',
    'DESCRIPTION',
    'KYC_AND_AML_NOTICE',
    'CONTRACT_VERSION',
] as const;

export type BillTerms = Record<(typeof TERM_GETTERS)[number], string>;

export type BillTermsResult =
    | { status: 'loading' }
    | { status: 'not-deployed' }
    | { status: 'error'; retry: () => void }
    | { status: 'ready'; terms: BillTerms; decimals: number };

/**
 * Reads the terms of the bill, and the contract's `decimals()`, from the contract shown on the current
 * chain, in one multicall.
 */
export function useBillTerms(): BillTermsResult {
    const {chainId, address, isDeployed} = useDisplayedContract('BillsOfExchange');
    const {data, status, refetch} = useReadContracts({
        allowFailure: false,
        contracts: [
            ...TERM_GETTERS.map((functionName) => ({abi: billsOfExchangeAbi, address, chainId, functionName})),
            {abi: billsOfExchangeAbi, address, chainId, functionName: 'decimals'},
        ],
        // The terms are compile-time constants of a deployed contract: they never change.
        query: {enabled: isDeployed, staleTime: Infinity},
    });

    if (!isDeployed) {
        return {status: 'not-deployed'};
    }
    if (status === 'error') {
        return {status: 'error', retry: () => void refetch()};
    }
    if (data === undefined) {
        return {status: 'loading'};
    }
    const values = data as readonly unknown[];
    const terms = Object.fromEntries(TERM_GETTERS.map((getter, index) => [getter, String(values[index])])) as BillTerms;
    // decimals() comes last, after the term getters.
    return {status: 'ready', terms, decimals: Number(values[TERM_GETTERS.length])};
}

/** The currency symbol and decimals of the bills; undefined until the contract has been read. */
export function useBillDenomination(): BillDenomination | undefined {
    const termsResult = useBillTerms();
    return termsResult.status === 'ready'
        ? {symbol: currencySymbol(termsResult.terms.CURRENCY), decimals: termsResult.decimals}
        : undefined;
}

export type RegistryTotals = { accepted: bigint; unaccepted: bigint };

/**
 * The number of bills in each ledger. Refreshed periodically, so that during a demonstration
 * the figures follow drawing and acceptance without reloading the page.
 */
export function useRegistryTotals(): RegistryTotals | undefined {
    const {chainId, address, isDeployed} = useDisplayedContract('BillsOfExchange');
    const {data} = useReadContracts({
        allowFailure: false,
        contracts: [
            {abi: billsOfExchangeAbi, address, chainId, functionName: 'totalSupply'},
            {abi: billsOfExchangeAbi, address, chainId, functionName: 'totalSupplyOfUnaccepted'},
        ],
        query: {enabled: isDeployed, refetchInterval: 15_000},
    });
    if (data === undefined) {
        return undefined;
    }
    const [accepted, unaccepted] = data;
    return {accepted, unaccepted};
}
