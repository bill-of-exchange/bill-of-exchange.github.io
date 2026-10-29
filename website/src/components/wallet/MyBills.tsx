import React, {useState} from 'react';
import type {Address} from 'viem';
import {useQueryClient} from '@tanstack/react-query';
import WalletGate from './WalletGate';
import WalletChip from './WalletChip';
import HoldingsCard from './HoldingsCard';
import SendPanel from './SendPanel';
import ReceivePanel from './ReceivePanel';
import ActivityCard from './ActivityCard';
import VerifyHolder from './VerifyHolder';
import AboutContract from './AboutContract';
import {useHolderBills} from './useHolderBills';
import styles from './MyBills.module.css';

/** The holder's page: what they hold, sending and receiving bills, recent transfers. */
export default function MyBills() {
    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>My bills</h1>
                <WalletChip/>
            </header>
            <WalletGate>{(holder) => <HolderContent holder={holder}/>}</WalletGate>
            <AboutContract/>
        </div>
    );
}

type OpenPanel = 'none' | 'send' | 'receive';

function HolderContent({holder}: { holder: Address }) {
    const [openPanel, setOpenPanel] = useState<OpenPanel>('none');
    const {bills, refetch} = useHolderBills(holder);
    const queryClient = useQueryClient();

    // After a transfer is in a block: the balance at once, the history once Blockscout has indexed it.
    const refreshAfterTransfer = () => {
        void refetch();
        setTimeout(() => void queryClient.invalidateQueries({queryKey: ['holder-transfers']}), 5_000);
    };

    return (
        <>
            <HoldingsCard bills={bills} onSend={() => setOpenPanel('send')} onReceive={() => setOpenPanel('receive')}/>
            {openPanel === 'send' && (
                <SendPanel holder={holder} balance={bills?.accepted} onClose={() => setOpenPanel('none')}
                           onSettled={refreshAfterTransfer}/>
            )}
            {openPanel === 'receive' && <ReceivePanel holder={holder} onClose={() => setOpenPanel('none')}/>}
            <ActivityCard holder={holder}/>
            <VerifyHolder/>
        </>
    );
}
