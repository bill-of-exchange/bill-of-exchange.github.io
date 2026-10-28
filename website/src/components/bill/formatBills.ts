import {TOKEN_DECIMALS} from '@site/src/constants';

const groupedNumber = new Intl.NumberFormat('en-US');

/** The symbol of an ISO 4217 currency code ("ILS" → "₪"); the code itself if the browser does not know it. */
export function currencySymbol(currencyCode: string): string {
    try {
        const parts = new Intl.NumberFormat('en', {style: 'currency', currency: currencyCode, currencyDisplay: 'narrowSymbol'})
            .formatToParts(0);
        return parts.find((part) => part.type === 'currency')?.value ?? currencyCode;
    } catch {
        // An unknown code (RangeError) is shown as it is: the contract's text stays visible either way.
        return currencyCode;
    }
}

/** "1,000" for 1000 bills. */
export function formatBillCount(bills: bigint): string {
    return groupedNumber.format(bills);
}

/**
 * The total sum of `bills`, exactly, as in "₪6.50". Every bill is worth one smallest unit of the
 * currency (specification §3.3: SUM_PER_BILL = 10^-decimals), so the sum is the count shifted by
 * TOKEN_DECIMALS. Bigint arithmetic only: floats would round.
 */
export function formatBillsSum(bills: bigint, symbol: string): string {
    const unitsPerWhole = 10n ** BigInt(TOKEN_DECIMALS);
    const whole = groupedNumber.format(bills / unitsPerWhole);
    const fraction = (bills % unitsPerWhole).toString().padStart(TOKEN_DECIMALS, '0');
    return `${symbol}${whole}.${fraction}`;
}
