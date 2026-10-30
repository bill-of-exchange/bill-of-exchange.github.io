import React, {useState} from 'react';
import clsx from 'clsx';
import {type Address, getAddress, isAddress} from 'viem';
import {billsOfExchangeAbi} from '@site/src/generated';
import BillsActionForm from './BillsActionForm';
import {useBillsTransaction} from './useBillsTransaction';
import styles from './MyBills.module.css';

type SendPanelProps = {
    holder: Address;
    /** Accepted bills the holder has, for the "Max" button. */
    balance: bigint | undefined;
    onClose: () => void;
    /** Called when the transfer is in a block (succeeded or reverted), to refresh what depends on it. */
    onSettled: () => void;
};

/** Sending accepted bills: the amount and the recipient, review, then the transaction. */
export default function SendPanel({holder, balance, onClose, onSettled}: SendPanelProps) {
    const transaction = useBillsTransaction();
    const [recipientInput, setRecipientInput] = useState('');
    const recipientText = recipientInput.trim();
    const recipient = isAddress(recipientText, {strict: false}) ? getAddress(recipientText) : undefined;

    return (
        <section className={styles.panel} aria-labelledby="send-heading">
            <div className={styles.panelHeader}>
                <h2 id="send-heading" className={styles.panelTitle}>Send bills</h2>
                <button type="button" className="button button--sm button--link" onClick={onClose}>Close</button>
            </div>
            <BillsActionForm
                id="send"
                transaction={transaction}
                showMax
                maxBills={balance}
                otherFields={
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
                }
                otherFieldsValid={recipient !== undefined}
                reviewRows={(amountDescription) => [
                    {label: 'Send', value: amountDescription},
                    {label: 'To', value: recipient, monospace: true},
                    {label: 'From', value: holder, monospace: true},
                ]}
                reviewNote={<>
                    This transfer is final: the bills pass to whoever controls the receiving address, as their
                    bearer. It cannot be undone.
                </>}
                wording={{
                    confirm: 'Confirm and send',
                    walletStep: 'Confirm the transfer in your wallet',
                    success: (block) => `Confirmed in block ${block}: the bills have been transferred`,
                    failure: (block) => `Failed in block ${block}: the contract rejected the transfer`,
                    restart: 'New transfer',
                }}
                submit={(amount) => transaction.writeContract({
                    abi: billsOfExchangeAbi,
                    address: transaction.contract.address,
                    functionName: 'transfer',
                    args: [recipient!, amount],
                })}
                onRestart={() => setRecipientInput('')}
                onSettled={onSettled}
            />
        </section>
    );
}
