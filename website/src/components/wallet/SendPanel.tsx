import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {type Address, formatUnits, getAddress, isAddress, parseUnits} from 'viem';
import {useQuery} from '@tanstack/react-query';
import {usePublicClient, useWriteContract} from 'wagmi';
import {TOKEN_DECIMALS} from '@site/src/constants';
import {billsOfExchangeAbi} from '@site/src/generated';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {explorerTransactionUrl} from '@site/src/components/contracts/contractLinks';
import {useBillTerms} from '@site/src/components/bill/useBillTerms';
import {currencySymbol, formatBillCount, formatBillsSum} from '@site/src/components/bill/formatBills';
import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import styles from './MyBills.module.css';

type Step = 'enter' | 'review' | 'progress';
type AmountUnit = 'currency' | 'bills';

const UNIT_OPTIONS = [
    {value: 'currency', label: 'Face value'},
    {value: 'bills', label: 'Bills'},
] as const satisfies readonly { value: AmountUnit; label: string }[];

/**
 * The amount typed by the holder, in bills (the smallest units). Undefined unless it is a positive
 * number with no more decimals than the unit allows: at most TOKEN_DECIMALS for a face value, none
 * for a count of bills.
 */
function parseAmount(text: string, unit: AmountUnit): bigint | undefined {
    const trimmed = text.trim();
    const pattern = unit === 'bills' ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{0,${TOKEN_DECIMALS}})?$`);
    if (!pattern.test(trimmed)) {
        return undefined;
    }
    const bills = unit === 'bills' ? BigInt(trimmed) : parseUnits(trimmed, TOKEN_DECIMALS);
    return bills > 0n ? bills : undefined;
}

function amountText(bills: bigint, unit: AmountUnit): string {
    return unit === 'bills' ? bills.toString() : formatUnits(bills, TOKEN_DECIMALS);
}

/** viem's errors carry a one-line summary; the full message adds pages of technical detail. */
function errorSummary(error: Error): string {
    return (error as Error & { shortMessage?: string }).shortMessage ?? error.message;
}

type SendPanelProps = {
    holder: Address;
    /** Accepted bills the holder has, for the "Max" button. */
    balance: bigint | undefined;
    onClose: () => void;
    /** Called when the transfer is in a block (succeeded or reverted), to refresh what depends on it. */
    onSettled: () => void;
};

/** Sending bills in three steps: enter the amount and the recipient, review, then follow the transaction. */
export default function SendPanel({holder, balance, onClose, onSettled}: SendPanelProps) {
    const contract = useDisplayedContract('BillsOfExchange');
    const termsResult = useBillTerms();
    const symbol = termsResult.status === 'ready' ? currencySymbol(termsResult.terms.CURRENCY) : '';

    const [step, setStep] = useState<Step>('enter');
    const [unit, setUnit] = useState<AmountUnit>('currency');
    const [amountInput, setAmountInput] = useState('');
    const [recipientInput, setRecipientInput] = useState('');

    const amount = parseAmount(amountInput, unit);
    const recipientText = recipientInput.trim();
    const recipient = isAddress(recipientText, {strict: false}) ? getAddress(recipientText) : undefined;

    const {writeContract, data: transactionHash, status: writeStatus, error: writeError, reset} = useWriteContract();
    // Not wagmi's useWaitForTransactionReceipt: on a reverted transaction it throws instead of returning
    // the receipt, and the query then retries for seconds before reporting a vague error. viem's action
    // returns the receipt with status 'reverted', which is exactly the outcome this panel has to show.
    const publicClient = usePublicClient({chainId: contract.chainId});
    const {data: receipt, status: receiptStatus, error: receiptError} = useQuery({
        queryKey: ['transfer-receipt', contract.chainId, transactionHash],
        queryFn: () => publicClient!.waitForTransactionReceipt({hash: transactionHash!}),
        enabled: transactionHash !== undefined && publicClient !== undefined,
        staleTime: Infinity, // a receipt never changes
    });

    useEffect(() => {
        if (receipt !== undefined) {
            onSettled();
        }
    }, [receipt]); // eslint-disable-line react-hooks/exhaustive-deps -- once per receipt

    const changeUnit = (newUnit: AmountUnit) => {
        // Keep the amount the holder typed, expressed in the new unit.
        if (amount !== undefined) setAmountInput(amountText(amount, newUnit));
        setUnit(newUnit);
    };

    const send = () => {
        // No chainId here: WalletGate renders this panel only while the wallet is on the bills' chain,
        // and unmounts it as soon as the wallet switches away.
        writeContract({
            abi: billsOfExchangeAbi,
            address: contract.address,
            functionName: 'transfer',
            args: [recipient!, amount!],
        });
        setStep('progress');
    };

    const startOver = () => {
        reset();
        setAmountInput('');
        setRecipientInput('');
        setStep('enter');
    };

    const amountDescription = amount === undefined
        ? undefined
        : `${formatBillCount(amount)} bills · face value ${formatBillsSum(amount, symbol)}`;

    return (
        <section className={styles.panel} aria-labelledby="send-heading">
            <div className={styles.panelHeader}>
                <h2 id="send-heading" className={styles.panelTitle}>Send bills</h2>
                <button type="button" className="button button--sm button--link" onClick={onClose}>Close</button>
            </div>

            {step === 'enter' && (
                <form className={styles.form} onSubmit={(event) => {
                    event.preventDefault();
                    setStep('review');
                }}>
                    <div className={styles.field}>
                        <label htmlFor="send-amount">Amount</label>
                        <div className={styles.inputRow}>
                            <input id="send-amount" className={styles.input} inputMode="decimal" autoComplete="off"
                                   placeholder={unit === 'bills' ? 'number of bills' : `${symbol} face value`}
                                   value={amountInput} onChange={(event) => setAmountInput(event.target.value)}/>
                            <button type="button" className="button button--secondary" disabled={balance === undefined}
                                    onClick={() => balance !== undefined && setAmountInput(amountText(balance, unit))}>
                                Max
                            </button>
                        </div>
                        <SegmentedControl label="Amount in" options={UNIT_OPTIONS} value={unit} onChange={changeUnit}/>
                        <div className={styles.hint}>
                            {amountDescription ?? (amountInput.trim() === '' ? 'Enter an amount' : 'Not a valid amount')}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="send-recipient">Recipient address</label>
                        <input id="send-recipient" className={clsx(styles.input, styles.mono)} autoComplete="off"
                               spellCheck={false} placeholder="0x…" value={recipientInput}
                               onChange={(event) => setRecipientInput(event.target.value)}/>
                        <div className={styles.hint}>
                            {recipientText === '' ? 'The address that will hold the bills'
                                : recipient === undefined ? 'Not a valid Ethereum address' : 'Valid address'}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className="button button--primary"
                                disabled={amount === undefined || recipient === undefined}>
                            Review
                        </button>
                    </div>
                </form>
            )}

            {step === 'review' && amount !== undefined && recipient !== undefined && (
                <div className={styles.form}>
                    <dl className={styles.summary}>
                        <dt>Send</dt>
                        <dd>{amountDescription}</dd>
                        <dt>To</dt>
                        <dd className={styles.mono}>{recipient}</dd>
                        <dt>From</dt>
                        <dd className={styles.mono}>{holder}</dd>
                        <dt>Network</dt>
                        <dd>{contract.chain.name}</dd>
                    </dl>
                    <p className={styles.note}>
                        This transfer is final: the bills pass to whoever controls the receiving address, as their
                        bearer. It cannot be undone.
                    </p>
                    <div className={styles.actions}>
                        <button type="button" className="button button--secondary" onClick={() => setStep('enter')}>
                            Back
                        </button>
                        <button type="button" className="button button--primary" onClick={send}>
                            Confirm and send
                        </button>
                    </div>
                </div>
            )}

            {step === 'progress' && (
                <div className={styles.form}>
                    <ol className={styles.progress}>
                        <ProgressStep
                            state={writeStatus === 'pending' ? 'active' : writeStatus === 'error' ? 'failed' : 'done'}
                            text={writeStatus === 'error'
                                ? `Not sent: ${errorSummary(writeError!)}`
                                : 'Confirm the transfer in your wallet'}/>
                        <ProgressStep
                            state={transactionHash === undefined ? 'waiting' : receiptStatus === 'pending' ? 'active' : 'done'}
                            text={<>
                                Submitted to the network
                                {transactionHash !== undefined && <>
                                    {' · '}
                                    <a href={explorerTransactionUrl(contract.chainId, transactionHash)}
                                       target="_blank" rel="noreferrer noopener">view transaction</a>
                                </>}
                            </>}/>
                        <ProgressStep
                            state={receipt === undefined ? (receiptStatus === 'error' ? 'failed' : 'waiting')
                                : receipt.status === 'success' ? 'done' : 'failed'}
                            text={receipt === undefined
                                ? (receiptStatus === 'error' ? `Could not confirm: ${errorSummary(receiptError!)}` : 'Confirmed in a block')
                                : receipt.status === 'success'
                                    ? `Confirmed in block ${receipt.blockNumber}: the bills have been transferred`
                                    : `Failed in block ${receipt.blockNumber}: the contract rejected the transfer`}/>
                    </ol>
                    <div className={styles.actions}>
                        {writeStatus === 'error' && (
                            <button type="button" className="button button--secondary" onClick={() => {
                                reset();
                                setStep('review');
                            }}>Back</button>
                        )}
                        {(receipt !== undefined || writeStatus === 'error') && (
                            <button type="button" className="button button--primary" onClick={startOver}>
                                New transfer
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

type ProgressState = 'waiting' | 'active' | 'done' | 'failed';

const PROGRESS_STATE_LABEL: Record<ProgressState, string> = {
    waiting: 'waiting',
    active: 'in progress',
    done: 'done',
    failed: 'failed',
};

function ProgressStep({state, text}: { state: ProgressState; text: React.ReactNode }) {
    return (
        <li className={clsx(styles.progressStep, styles[`progress_${state}`])}>
            <span className={styles.progressMarker} aria-hidden="true"/>
            <span>
                {text}
                <span className={styles.visuallyHidden}> ({PROGRESS_STATE_LABEL[state]})</span>
            </span>
        </li>
    );
}
