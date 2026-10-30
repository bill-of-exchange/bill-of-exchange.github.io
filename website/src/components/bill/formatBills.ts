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
 * How sums of bills are written, as read from the contract: the currency's symbol, and the contract's
 * `decimals()`. Every bill is worth one smallest unit of the token (specification §3.3:
 * SUM_PER_BILL = 10^-decimals), so a sum is the number of bills shifted by `decimals` places.
 */
export type BillDenomination = { symbol: string; decimals: number };

/** The total sum of `bills`, exactly, as in "₪6.50". Bigint arithmetic only: floats would round. */
export function formatBillsSum(bills: bigint, {symbol, decimals}: BillDenomination): string {
    const unitsPerWhole = 10n ** BigInt(decimals);
    const whole = groupedNumber.format(bills / unitsPerWhole);
    if (decimals === 0) {
        return `${symbol}${whole}`;
    }
    const fraction = (bills % unitsPerWhole).toString().padStart(decimals, '0');
    return `${symbol}${whole}.${fraction}`;
}
