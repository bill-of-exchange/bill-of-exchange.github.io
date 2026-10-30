import React, {type ReactNode, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {type Address, getAddress, isAddress, isAddressEqual} from 'viem';
import {useQueryClient} from '@tanstack/react-query';
import {billsOfExchangeAbi} from '@site/src/generated';
import {type BillTerms, useBillTerms} from '@site/src/components/bill/useBillTerms';
import {currencySymbol, formatBillCount} from '@site/src/components/bill/formatBills';
import BillsActionForm from '@site/src/components/wallet/BillsActionForm';
import {useBillsTransaction} from '@site/src/components/wallet/useBillsTransaction';
import {useHolderBills} from '@site/src/components/wallet/useHolderBills';
import styles from '@site/src/components/wallet/MyBills.module.css';

type StepProps = {
    account: Address;
    terms: BillTerms;
    drawer: Address;
    drawee: Address;
    /** Refreshes balances and totals once a transaction is in a block. */
    onSettled: () => void;
};

/** Drawing, delivery to the drawee and acceptance, in the order in which a bill goes through them. */
export default function IssuanceSteps({account}: { account: Address }) {
    const termsResult = useBillTerms();
    const queryClient = useQueryClient();
    if (termsResult.status !== 'ready') {
        return null;
    }
    const {terms} = termsResult;
    const stepProps: StepProps = {
        account,
        terms,
        drawer: getAddress(terms.DRAWER_ETH_ADDRESS),
        drawee: getAddress(terms.DRAWEE_ETH_ADDRESS),
        // Every balance and total on the page is a contract read; after a transaction all of them may change.
        onSettled: () => void queryClient.invalidateQueries({queryKey: ['readContracts']}),
    };
    return (
        <>
            <DrawStep {...stepProps}/>
            <DeliverStep {...stepProps}/>
            <AcceptStep {...stepProps}/>
        </>
    );
}

function DrawStep({account, terms, drawer, onSettled}: StepProps) {
    const transaction = useBillsTransaction();
    const denomination = `${currencySymbol(terms.CURRENCY)}${terms.SUM_PER_BILL}`;
    return (
        <StepCard number={1} title="Draw bills">
            <p>
                Each new bill is the drawer's order to the drawee to pay {denomination} to the bearer at sight.
                Drawn bills are unaccepted: until the drawee accepts them, only the drawer is liable on them, and
                they do not appear in wallet apps.
            </p>
            {isAddressEqual(account, drawer) ? (
                <BillsActionForm
                    id="draw"
                    transaction={transaction}
                    reviewRows={(amountDescription) => [
                        {label: 'Draw', value: amountDescription},
                        {label: 'Drawer', value: terms.DRAWER_NAME},
                        {label: 'Signed by', value: drawer, monospace: true},
                    ]}
                    reviewNote={<>
                        Your signature of this transaction is the drawer's signature on the bills, as the statement
                        recorded in the contract provides. The new bills will be held by the drawer.
                    </>}
                    wording={{
                        confirm: 'Confirm and draw',
                        walletStep: 'Confirm the drawing in your wallet',
                        success: (block) => `Drawn in block ${block}: the bills are in the drawer's ledger of unaccepted bills`,
                        failure: (block) => `Failed in block ${block}: the contract rejected the drawing`,
                        restart: 'Draw more',
                    }}
                    submit={(amount) => transaction.writeContract({
                        abi: billsOfExchangeAbi,
                        address: transaction.contract.address,
                        functionName: 'draw',
                        args: [amount],
                    })}
                    onSettled={onSettled}
                />
            ) : (
                <RoleRequired role="drawer" action="draw bills" required={drawer} account={account}/>
            )}
        </StepCard>
    );
}

function DeliverStep({account, terms, drawer, drawee, onSettled}: StepProps) {
    const transaction = useBillsTransaction();
    const {bills: drawerBills} = useHolderBills(drawer);
    const description = (
        <p>
            Drawn bills are first held by the drawer: the contract credits them to the drawer's address. The drawer
            then delivers them to the drawee, who will accept them.
        </p>
    );

    if (isAddressEqual(drawer, drawee)) {
        return (
            <StepCard number={2} title="Deliver to the drawee">
                {description}
                <p className={styles.note}>
                    In this deployment the drawer and the drawee use the same address: drawn bills are already with
                    the drawee, so there is nothing to deliver.
                </p>
            </StepCard>
        );
    }
    return (
        <StepCard number={2} title="Deliver to the drawee">
            {description}
            {isAddressEqual(account, drawer) ? (
                <BillsActionForm
                    id="deliver"
                    transaction={transaction}
                    showMax
                    maxBills={drawerBills?.unaccepted}
                    reviewRows={(amountDescription) => [
                        {label: 'Deliver', value: amountDescription},
                        {label: 'To', value: terms.DRAWEE_NAME},
                        {label: 'Address', value: drawee, monospace: true},
                    ]}
                    reviewNote={<>
                        The bills stay unaccepted: only the drawer is liable on them until the drawee accepts them.
                    </>}
                    wording={{
                        confirm: 'Confirm and deliver',
                        walletStep: 'Confirm the delivery in your wallet',
                        success: (block) => `Delivered in block ${block}: the bills are with the drawee`,
                        failure: (block) => `Failed in block ${block}: the contract rejected the delivery`,
                        restart: 'Deliver more',
                    }}
                    submit={(amount) => transaction.writeContract({
                        abi: billsOfExchangeAbi,
                        address: transaction.contract.address,
                        functionName: 'transferOfUnaccepted',
                        args: [drawee, amount],
                    })}
                    onSettled={onSettled}
                />
            ) : (
                <RoleRequired role="drawer" action="deliver drawn bills" required={drawer} account={account}/>
            )}
        </StepCard>
    );
}

function AcceptStep({account, terms, drawee, onSettled}: StepProps) {
    const transaction = useBillsTransaction();
    // Normally the drawee accepts the bills it holds; the contract also lets it accept bills held elsewhere.
    const [holderInput, setHolderInput] = useState<string>(drawee);
    const holderText = holderInput.trim();
    const holder = isAddress(holderText, {strict: false}) ? getAddress(holderText) : undefined;
    const {bills: holderBills} = useHolderBills(holder);

    return (
        <StepCard number={3} title="Accept">
            <p>
                The drawee accepts bills by signing a transaction. The same bills move from the ledger of unaccepted
                bills to the ledger of accepted bills: none are created, and the drawee becomes liable to pay them to
                the bearer at sight. Accepted bills circulate as a standard token; their holder sends them
                from <Link to="/wallet">My bills</Link>.
            </p>
            {isAddressEqual(account, drawee) ? (
                <BillsActionForm
                    id="accept"
                    transaction={transaction}
                    showMax
                    maxBills={holderBills?.unaccepted}
                    otherFields={
                        <div className={styles.field}>
                            <label htmlFor="accept-holder">Holder of the bills</label>
                            <input id="accept-holder" className={clsx(styles.input, styles.mono)} autoComplete="off"
                                   spellCheck={false} placeholder="0x…" value={holderInput}
                                   onChange={(event) => setHolderInput(event.target.value)}/>
                            <div className={styles.hint}>
                                {holder === undefined ? 'Not a valid Ethereum address'
                                    : holderBills === undefined ? 'Reading the unaccepted bills of this address…'
                                        : `Holds ${formatBillCount(holderBills.unaccepted)} unaccepted bills`}
                            </div>
                        </div>
                    }
                    otherFieldsValid={holder !== undefined}
                    reviewRows={(amountDescription) => [
                        {label: 'Accept', value: amountDescription},
                        {label: 'Held by', value: holder, monospace: true},
                        {label: 'Acceptor', value: terms.DRAWEE_NAME},
                    ]}
                    reviewNote={<>
                        Your signature of this transaction is the drawee's acceptance: the mere signature of the
                        drawee is sufficient (Bills of Exchange Act 1882, s.17(2)(a)). The contract has no way to
                        undo an acceptance.
                    </>}
                    wording={{
                        confirm: 'Confirm and accept',
                        walletStep: 'Confirm the acceptance in your wallet',
                        success: (block) => `Accepted in block ${block}: the bills are now in circulation`,
                        failure: (block) => `Failed in block ${block}: the contract rejected the acceptance`,
                        restart: 'Accept more',
                    }}
                    submit={(amount) => transaction.writeContract({
                        abi: billsOfExchangeAbi,
                        address: transaction.contract.address,
                        functionName: 'acceptOn',
                        args: [holder!, amount],
                    })}
                    onRestart={() => setHolderInput(drawee)}
                    onSettled={onSettled}
                />
            ) : (
                <RoleRequired role="drawee" action="accept bills" required={drawee} account={account}/>
            )}
        </StepCard>
    );
}

function StepCard({number, title, children}: { number: number; title: string; children: ReactNode }) {
    return (
        <section className={styles.panel} aria-labelledby={`step-${number}-heading`}>
            <div className={styles.stepLabel}>Step {number}</div>
            <h2 id={`step-${number}-heading`} className={styles.panelTitle}>{title}</h2>
            {children}
        </section>
    );
}

/** Shown instead of a form: who can take this step, so that a visitor still sees how the bill is made. */
function RoleRequired({role, action, required, account}: { role: string; action: string; required: Address; account: Address }) {
    return (
        <p className={styles.note}>
            Only the {role}'s address can {action}: <code>{required}</code>. Your wallet
            is <code>{account}</code>.
        </p>
    );
}
