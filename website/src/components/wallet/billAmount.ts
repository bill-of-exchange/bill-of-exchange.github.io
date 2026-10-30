import {formatUnits, parseUnits} from 'viem';

/** How an amount of bills is typed: as a face value (₪12.34) or as a number of bills (1234). */
export type AmountUnit = 'currency' | 'bills';

export const AMOUNT_UNIT_OPTIONS = [
    {value: 'currency', label: 'Face value'},
    {value: 'bills', label: 'Bills'},
] as const satisfies readonly { value: AmountUnit; label: string }[];

/**
 * The amount typed by the user, in bills (the smallest units). Undefined unless it is a positive
 * number with no more decimals than the unit allows: at most the contract's `decimals` for a face
 * value, none for a number of bills.
 */
export function parseAmount(text: string, unit: AmountUnit, decimals: number): bigint | undefined {
    const trimmed = text.trim();
    const pattern = unit === 'bills' ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{0,${decimals}})?$`);
    if (!pattern.test(trimmed)) {
        return undefined;
    }
    const bills = unit === 'bills' ? BigInt(trimmed) : parseUnits(trimmed, decimals);
    return bills > 0n ? bills : undefined;
}

/** An amount of bills written in the given unit, as the user would type it. */
export function amountText(bills: bigint, unit: AmountUnit, decimals: number): string {
    return unit === 'bills' ? bills.toString() : formatUnits(bills, decimals);
}

/** viem's errors carry a one-line summary; the full message adds pages of technical detail. */
export function errorSummary(error: Error): string {
    return (error as Error & { shortMessage?: string }).shortMessage ?? error.message;
}
