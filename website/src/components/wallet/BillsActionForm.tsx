import React, {type ReactNode, useEffect, useState} from 'react';
import clsx from 'clsx';
import {explorerTransactionUrl} from '@site/src/components/contracts/contractLinks';
import {useBillDenomination} from '@site/src/components/bill/useBillTerms';
import {formatBillCount, formatBillsSum} from '@site/src/components/bill/formatBills';
import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import {AMOUNT_UNIT_OPTIONS, type AmountUnit, amountText, errorSummary, parseAmount} from './billAmount';
import type {BillsTransaction} from './useBillsTransaction';
import styles from './MyBills.module.css';

type Step = 'enter' | 'review' | 'progress';

export type ReviewRow = { label: string; value: ReactNode; monospace?: boolean };

/** What the form says at each stage; every action on bills has its own wording. */
export type ActionWording = {
    /** The button that sends the reviewed transaction, e.g. "Confirm and send". */
    confirm: string;
    /** The first progress step, e.g. "Confirm the transfer in your wallet". */
    walletStep: string;
    success: (blockNumber: bigint) => string;
    failure: (blockNumber: bigint) => string;
    /** The button that starts the same action again, e.g. "New transfer". */
    restart: string;
};

type BillsActionFormProps = {
    /** Prefix for element ids, unique on the page. */
    id: string;
    transaction: BillsTransaction;
    /** Sends the transaction for the reviewed amount, through `transaction.writeContract`. */
    submit: (amount: bigint) => void;
    /** Bills available for this action, for the "Max" button. Omitted when there is no limit (drawing). */
    maxBills?: bigint | undefined;
    showMax?: boolean;
    /** Fields of the action besides the amount (a recipient, a holder), shown after it. */
    otherFields?: ReactNode;
    otherFieldsValid?: boolean;
    /** Lines of the review, after the amount and before the network. */
    reviewRows: (amountDescription: string) => ReviewRow[];
    /** What the user must understand before confirming. */
    reviewNote: ReactNode;
    wording: ActionWording;
    /** Clears the caller's own fields when the user starts again. */
    onRestart?: () => void;
    /** Called once the transaction is in a block (succeeded or reverted), to refresh what depends on it. */
    onSettled: () => void;
};

/**
 * An action on bills in three steps: enter the amount (and the action's other fields), review,
 * then follow the transaction until its block. Sending, drawing, delivering and accepting all use it,
 * so that every action looks and behaves the same way.
 */
export default function BillsActionForm(props: BillsActionFormProps) {
    const {id, transaction, submit, maxBills, showMax = false, otherFields, otherFieldsValid = true,
        reviewRows, reviewNote, wording, onRestart, onSettled} = props;
    // Until the contract has been read, no amount can be parsed: the decimals are not known yet.
    const denomination = useBillDenomination();

    const [step, setStep] = useState<Step>('enter');
    const [unit, setUnit] = useState<AmountUnit>('currency');
    const [amountInput, setAmountInput] = useState('');
    const amount = denomination && parseAmount(amountInput, unit, denomination.decimals);

    const {receipt} = transaction;
    useEffect(() => {
        if (receipt !== undefined) {
            onSettled();
        }
    }, [receipt]); // eslint-disable-line react-hooks/exhaustive-deps -- once per receipt

    const changeUnit = (newUnit: AmountUnit) => {
        // Keep the amount the user typed, expressed in the new unit.
        if (amount !== undefined && denomination !== undefined) setAmountInput(amountText(amount, newUnit, denomination.decimals));
        setUnit(newUnit);
    };

    const startOver = () => {
        transaction.reset();
        setAmountInput('');
        onRestart?.();
        setStep('enter');
    };

    const amountDescription = amount === undefined || denomination === undefined
        ? undefined
        : `${formatBillCount(amount)} bills · face value ${formatBillsSum(amount, denomination)}`;

    if (step === 'enter') {
        return (
            <form className={styles.form} onSubmit={(event) => {
                event.preventDefault();
                setStep('review');
            }}>
                <div className={styles.field}>
                    <label htmlFor={`${id}-amount`}>Amount</label>
                    <div className={styles.inputRow}>
                        <input id={`${id}-amount`} className={styles.input} inputMode="decimal" autoComplete="off"
                               placeholder={unit === 'bills' ? 'number of bills' : `${denomination?.symbol ?? ''} face value`}
                               value={amountInput} onChange={(event) => setAmountInput(event.target.value)}/>
                        {showMax && (
                            <button type="button" className="button button--secondary" disabled={maxBills === undefined || denomination === undefined}
                                    onClick={() => maxBills !== undefined && denomination !== undefined
                                        && setAmountInput(amountText(maxBills, unit, denomination.decimals))}>
                                Max
                            </button>
                        )}
                    </div>
                    <SegmentedControl label="Amount in" options={AMOUNT_UNIT_OPTIONS} value={unit} onChange={changeUnit}/>
                    <div className={styles.hint}>
                        {amountDescription ?? (amountInput.trim() === '' ? 'Enter an amount' : 'Not a valid amount')}
                    </div>
                </div>
                {otherFields}
                <div className={styles.actions}>
                    <button type="submit" className="button button--primary"
                            disabled={amount === undefined || !otherFieldsValid}>
                        Review
                    </button>
                </div>
            </form>
        );
    }

    if (step === 'review' && amount !== undefined && amountDescription !== undefined) {
        const rows = [...reviewRows(amountDescription), {label: 'Network', value: transaction.contract.chain.name}];
        return (
            <div className={styles.form}>
                <dl className={styles.summary}>
                    {rows.map((row) => (
                        <React.Fragment key={row.label}>
                            <dt>{row.label}</dt>
                            <dd className={clsx(row.monospace && styles.mono)}>{row.value}</dd>
                        </React.Fragment>
                    ))}
                </dl>
                <p className={styles.note}>{reviewNote}</p>
                <div className={styles.actions}>
                    <button type="button" className="button button--secondary" onClick={() => setStep('enter')}>
                        Back
                    </button>
                    <button type="button" className="button button--primary" onClick={() => {
                        // No chainId: the page renders this form only while the wallet is on the bills' chain.
                        submit(amount);
                        setStep('progress');
                    }}>
                        {wording.confirm}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.form}>
            <TransactionProgress transaction={transaction} wording={wording}/>
            <div className={styles.actions}>
                {transaction.writeStatus === 'error' && (
                    <button type="button" className="button button--secondary" onClick={() => {
                        transaction.reset();
                        setStep('review');
                    }}>Back</button>
                )}
                {(transaction.receipt !== undefined || transaction.writeStatus === 'error') && (
                    <button type="button" className="button button--primary" onClick={startOver}>
                        {wording.restart}
                    </button>
                )}
            </div>
        </div>
    );
}

/** The three stages of a transaction: confirmed in the wallet, submitted, settled in a block. */
function TransactionProgress({transaction, wording}: { transaction: BillsTransaction; wording: ActionWording }) {
    const {contract, hash, writeStatus, writeError, receipt, receiptStatus, receiptError} = transaction;
    return (
        <ol className={styles.progress}>
            <ProgressStep
                state={writeStatus === 'pending' ? 'active' : writeStatus === 'error' ? 'failed' : 'done'}
                text={writeStatus === 'error' ? `Not sent: ${errorSummary(writeError!)}` : wording.walletStep}/>
            <ProgressStep
                state={hash === undefined ? 'waiting' : receiptStatus === 'pending' ? 'active' : 'done'}
                text={<>
                    Submitted to the network
                    {hash !== undefined && <>
                        {' · '}
                        <a href={explorerTransactionUrl(contract.chainId, hash)} target="_blank"
                           rel="noreferrer noopener">view transaction</a>
                    </>}
                </>}/>
            <ProgressStep
                state={receipt === undefined ? (receiptStatus === 'error' ? 'failed' : 'waiting')
                    : receipt.status === 'success' ? 'done' : 'failed'}
                text={receipt === undefined
                    ? (receiptStatus === 'error' ? `Could not confirm: ${errorSummary(receiptError!)}` : 'Confirmed in a block')
                    : receipt.status === 'success' ? wording.success(receipt.blockNumber) : wording.failure(receipt.blockNumber)}/>
        </ol>
    );
}

type ProgressState = 'waiting' | 'active' | 'done' | 'failed';

const PROGRESS_STATE_LABEL: Record<ProgressState, string> = {
    waiting: 'waiting',
    active: 'in progress',
    done: 'done',
    failed: 'failed',
};

function ProgressStep({state, text}: { state: ProgressState; text: ReactNode }) {
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
