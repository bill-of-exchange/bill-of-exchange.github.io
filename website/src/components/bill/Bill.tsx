import React, {type ReactNode, useRef} from 'react';
import clsx from 'clsx';
// Self-hosted fonts: no request to a third-party font service when the page opens.
import '@fontsource/cinzel/600.css';
import '@fontsource/cinzel/700.css';
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';
import '@fontsource/eb-garamond/500.css';
import '@fontsource/eb-garamond/600.css';
import '@fontsource/ibm-plex-mono/400.css';
// EB Garamond has no ₪ sign: the browser takes that one glyph from Frank Ruhl Libre (see --serif).
import '@fontsource/frank-ruhl-libre/hebrew-500.css';
import {type DisplayedContract, useDisplayedContract} from '@site/src/components/contracts/useDisplayedContract';
import {contractUrl} from '@site/src/components/contracts/contractLinks';
import truncateAddress from '@site/src/components/wagmi/truncateAddress';
import {type BillTerms, useBillTerms} from './useBillTerms';
import {currencySymbol} from './formatBills';
import {guillocheBorderPaths, ROSETTE_PATHS, ROSETTE_SIZE} from './guilloche';
import {useElementSize} from './useElementSize';
import styles from './Bill.module.css';

// The wide layout reproduces a design DESIGN_WIDTH px wide, scaled to the container. Narrower than
// NARROW_LAYOUT_MAX_WIDTH, the bill is laid out vertically; Bill.module.css has the same breakpoint.
const DESIGN_WIDTH = 1100;
const NARROW_LAYOUT_MAX_WIDTH = 899;

// Not read from the contract: legal characterisations shown on the bill as decided by the project
// owner. Everything else the bill asserts comes from the contract (specification §3.6).
const OWNER_APPROVED_SUBTITLE = 'Electronic trade document · payable to bearer';
const OWNER_APPROVED_STAMP_STATUTE = 'Bills of Exchange Act 1882 · s.17';

type BillProps = {
    /** Shows the bill with the drawee's acceptance stamp, or with an empty acceptance box. */
    accepted: boolean;
};

/**
 * A specimen of one bill, rendered from the terms in the contract on the displayed chain.
 * An electronic bill has no reverse side: the statements that paper bills would carry on the back
 * are shown separately, as contract text, by ContractTerms.
 */
export default function Bill({accepted}: BillProps) {
    const contract = useDisplayedContract('BillsOfExchange');
    const termsResult = useBillTerms();

    let body: ReactNode;
    switch (termsResult.status) {
        case 'not-deployed':
            body = <Message>No bill has been issued on {contract.chain.name} yet.</Message>;
            break;
        case 'error':
            body = (
                <Message>
                    The bill could not be read from {contract.chain.name}.
                    <button type="button" className={styles.retryButton} onClick={termsResult.retry}>Try again</button>
                </Message>
            );
            break;
        default: {
            // While loading, the same layout is drawn with placeholders, so nothing jumps.
            const terms = termsResult.status === 'ready' ? termsResult.terms : undefined;
            body = (
                <>
                    <div className={styles.body}>
                        <Face terms={terms} accepted={accepted}/>
                    </div>
                    <Footer contract={contract} version={terms?.CONTRACT_VERSION}/>
                </>
            );
        }
    }

    return (
        <div className={styles.bill}>
            <Sheet testnet={contract.chain.testnet === true} label="Bill of exchange">
                {body}
            </Sheet>
        </div>
    );
}

function Sheet({testnet, label, children}: { testnet: boolean; label: string; children: ReactNode }) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const size = useElementSize(sheetRef);
    return (
        <figure ref={sheetRef} className={styles.sheet} aria-label={label}>
            {size !== undefined && <Frame width={size.width} height={size.height}/>}
            {testnet && (
                <div className={styles.watermark} aria-hidden="true">
                    <div className={styles.watermarkText}>Specimen · testnet</div>
                </div>
            )}
            {children}
        </figure>
    );
}

/**
 * Both acceptance states (the empty box and the stamp) are laid out in the same grid cell, and only
 * the active one is visible. The bill therefore keeps its size when the state is switched.
 */
function Layer({active, className, children}: { active: boolean; className?: string; children: ReactNode }) {
    return (
        <div className={clsx(styles.layer, !active && styles.hiddenLayer, className)} aria-hidden={!active} inert={!active}>
            {children}
        </div>
    );
}

/** The guilloche border and the double rule inside it, drawn for the sheet's actual size. */
function Frame({width, height}: { width: number; height: number }) {
    const narrow = width <= NARROW_LAYOUT_MAX_WIDTH;
    const scale = narrow ? 1 : width / DESIGN_WIDTH;
    const inset = narrow ? 10 : 24 * scale;
    const amplitude = narrow ? 4 : 6 * scale;
    const rules = narrow ? [inset + 8, inset + 11] : [inset + 20 * scale, inset + 24 * scale];
    return (
        <svg className={styles.frame} width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
            {guillocheBorderPaths(width, height, inset, amplitude).map((path, index) => (
                <path key={index} d={path} fill="none" stroke="var(--engraving)" strokeWidth={0.8} strokeOpacity={0.55}/>
            ))}
            {rules.map((ruleInset, index) => (
                <rect key={ruleInset} x={ruleInset} y={ruleInset} width={width - 2 * ruleInset} height={height - 2 * ruleInset}
                      fill="none" stroke="var(--engraving)" strokeWidth={index === 0 ? 1 : 0.6}
                      strokeOpacity={index === 0 ? 0.6 : 0.35}/>
            ))}
        </svg>
    );
}

/** Contract text, or a grey bar of the given width while it is being read. */
function Term({value, placeholderWidth}: { value: string | undefined; placeholderWidth: string }) {
    if (value === undefined) {
        return <span className={styles.placeholder} style={{width: placeholderWidth}}/>;
    }
    return <>{value}</>;
}

function Face({terms, accepted}: { terms: BillTerms | undefined; accepted: boolean }) {
    return (
        <>
            <header className={styles.header}>
                <div>
                    <div className={styles.title}>Bill of exchange</div>
                    <div className={styles.subtitle}>{OWNER_APPROVED_SUBTITLE}</div>
                </div>
                <div className={styles.denomination}>
                    <svg className={styles.rosette} viewBox={`0 0 ${ROSETTE_SIZE} ${ROSETTE_SIZE}`} aria-hidden="true">
                        {ROSETTE_PATHS.map((path) => (
                            <path key={path} d={path} fill="none" stroke="var(--engraving)" strokeWidth={0.7} strokeOpacity={0.32}/>
                        ))}
                    </svg>
                    <div className={styles.denominationValue}>
                        {terms === undefined
                            ? <Term value={undefined} placeholderWidth="3.2em"/>
                            : `${currencySymbol(terms.CURRENCY)}${terms.SUM_PER_BILL}`}
                    </div>
                    <div className={styles.denominationCode}>
                        <Term value={terms && `${terms.CURRENCY} ${terms.SUM_PER_BILL}`} placeholderWidth="6em"/>
                    </div>
                </div>
            </header>

            <section>
                <div className={styles.label}>The order</div>
                <p className={styles.orderText}>
                    {terms === undefined ? <Term value={undefined} placeholderWidth="90%"/> : `“${terms.ORDER}”`}
                </p>
                <div className={styles.timeOfPayment}>
                    Time of payment: <strong><Term value={terms?.TIME_OF_PAYMENT} placeholderWidth="5em"/></strong>
                </div>
            </section>

            <div className={styles.fields}>
                <div className={styles.field}>
                    <div className={styles.label}>To (the drawee)</div>
                    <div className={styles.partyName}><Term value={terms?.DRAWEE_NAME} placeholderWidth="85%"/></div>
                </div>
                <div className={styles.field}>
                    <div className={styles.label}>The drawer</div>
                    <div className={styles.partyName}><Term value={terms?.DRAWER_NAME} placeholderWidth="85%"/></div>
                    <div className={styles.signature}>
                        <div className={styles.signatureNote}>Signed electronically by the drawer</div>
                        <div className={styles.address}><Term value={terms?.DRAWER_ETH_ADDRESS} placeholderWidth="90%"/></div>
                    </div>
                </div>
                <div className={styles.field}>
                    <div className={styles.label}>Acceptance</div>
                    <div className={styles.stack}>
                        <Layer active={!accepted}><AwaitingAcceptance/></Layer>
                        <Layer active={accepted}><AcceptanceStamp drawee={terms?.DRAWEE_ETH_ADDRESS}/></Layer>
                    </div>
                </div>
            </div>
        </>
    );
}

function AcceptanceStamp({drawee}: { drawee: string | undefined }) {
    return (
        <div className={styles.stamp}>
            <div className={styles.stampTitle}>Accepted</div>
            <div className={styles.stampLine}>by the drawee</div>
            <div className={styles.stampSigner}>signed <Term value={drawee && truncateAddress(drawee)} placeholderWidth="7em"/></div>
            <div className={styles.stampStatute}>{OWNER_APPROVED_STAMP_STATUTE}</div>
        </div>
    );
}

function AwaitingAcceptance() {
    return (
        <div className={styles.awaitingAcceptance}>
            <div className={styles.awaitingTitle}>Not yet accepted</div>
            <div className={styles.awaitingNote}>The drawee's acceptance will appear here</div>
        </div>
    );
}

function Footer({contract, version}: { contract: DisplayedContract; version: string | undefined }) {
    return (
        <footer className={styles.footer}>
            <span>
                Registry: {contract.chain.name} · contract{' '}
                <a href={contractUrl(contract.chainId, contract.address)} target="_blank" rel="noreferrer noopener">{truncateAddress(contract.address)}</a>
                {' '}· code v<Term value={version} placeholderWidth="2.5em"/>
            </span>
            {contract.chain.testnet && <span className={styles.badge}>Specimen · testnet · not a valid bill</span>}
        </footer>
    );
}

function Message({children}: { children: ReactNode }) {
    return <div className={styles.message}>{children}</div>;
}
