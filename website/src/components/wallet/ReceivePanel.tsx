import React from 'react';
import type {Address} from 'viem';
import {QRCodeSVG} from 'qrcode.react';
import CopyIcon from '@site/src/components/ui/CopyIcon';
import {useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import styles from './MyBills.module.css';

/** The holder's address, to give to whoever will send them bills: as text, as a QR code, or shared. */
export default function ReceivePanel({holder, onClose}: { holder: Address; onClose: () => void }) {
    const {chain} = useDisplayedContract('BillsOfExchange');
    // The system share sheet exists mostly on phones; elsewhere copying is the way.
    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    return (
        <section className={styles.panel} aria-labelledby="receive-heading">
            <div className={styles.panelHeader}>
                <h2 id="receive-heading" className={styles.panelTitle}>Receive bills</h2>
                <button type="button" className="button button--sm button--link" onClick={onClose}>Close</button>
            </div>
            <div className={styles.receive}>
                {/* Plain address, readable by any wallet's scanner; white margin for scanning on a dark page. */}
                <QRCodeSVG value={holder} size={176} marginSize={2} bgColor="#ffffff" fgColor="#000000"
                           title="Your address as a QR code" className={styles.qrCode}/>
                <div className={styles.receiveText}>
                    <p>Give this address to whoever will send you bills, on {chain.name}:</p>
                    <p className={styles.mono}>{holder} <CopyIcon dataToCopy={holder}/></p>
                    {canShare && (
                        <button type="button" className="button button--secondary"
                                onClick={() => navigator.share({title: 'My address for bills of exchange', text: holder})
                                    .catch(() => undefined /* the holder closed the share sheet */)}>
                            Share
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
