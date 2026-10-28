import React, {useState} from 'react';
import clsx from 'clsx';
import SegmentedControl from '@site/src/components/ui/SegmentedControl';
import Bill from './Bill';
import ContractTerms from './ContractTerms';
import RegistrySummary from './RegistrySummary';
import styles from './BillShowcase.module.css';

type AcceptanceState = 'unaccepted' | 'accepted';

const ACCEPTANCE_OPTIONS = [
    {value: 'unaccepted', label: 'Unaccepted'},
    {value: 'accepted', label: 'Accepted'},
] as const satisfies readonly { value: AcceptanceState; label: string }[];

const ACCEPTANCE_STATES = ACCEPTANCE_OPTIONS.map((option) => option.value);

const ACCEPTANCE_EXPLANATION: Record<AcceptanceState, string> = {
    unaccepted: 'Before acceptance only the drawer is liable on the bill.',
    accepted: 'By accepting, the drawee signs the bill and becomes liable to pay it to the bearer.',
};

/**
 * The home page centrepiece: one bill in both of its states, the registry figures, and the terms
 * recorded in the contract.
 */
export default function BillShowcase() {
    const [acceptance, setAcceptance] = useState<AcceptanceState>('accepted');

    return (
        <section className={styles.showcase}>
            <header className={styles.intro}>
                <h1 className={styles.heading}>An electronic bill of exchange</h1>
                <p className={styles.lede}>
                    The terms of this bill are read from its registry on the blockchain, not stored on this site.
                </p>
            </header>

            <Bill accepted={acceptance === 'accepted'}/>

            <div className={styles.controls}>
                <SegmentedControl label="State of the bill" options={ACCEPTANCE_OPTIONS} value={acceptance}
                                  onChange={setAcceptance}/>
            </div>
            {/* Both explanations share one grid cell, so the longer one sets the height for both. */}
            <div className={styles.explanations}>
                {ACCEPTANCE_STATES.map((state) => (
                    <p key={state} className={clsx(styles.explanation, state !== acceptance && styles.concealed)}
                       aria-hidden={state !== acceptance}>
                        {ACCEPTANCE_EXPLANATION[state]}
                    </p>
                ))}
            </div>

            <RegistrySummary/>
            <ContractTerms/>
        </section>
    );
}
