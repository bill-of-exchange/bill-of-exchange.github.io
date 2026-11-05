import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';

/** The official text of the Act, on the UK government's legislation database. */
export const ELECTRONIC_TRADE_DOCUMENTS_ACT_URL = 'https://www.legislation.gov.uk/ukpga/2023/38';

/** legislation.gov.uk publishes each section on its own page; subsections have none, so s.2(2) opens s.2. */
export function electronicTradeDocumentsActSectionUrl(section: number): string {
    return `${ELECTRONIC_TRADE_DOCUMENTS_ACT_URL}/section/${section}`;
}

/**
 * The name of the Act as a link to its official text. Like the Bills of Exchange Act (see BillsOfExchangeAct.tsx),
 * the site links every mention of the Act it writes itself; text read from the contract is shown as recorded there,
 * without links.
 */
export default function ElectronicTradeDocumentsAct({className}: { className?: string }) {
    return <Link className={className} to={ELECTRONIC_TRADE_DOCUMENTS_ACT_URL}>Electronic Trade Documents Act 2023</Link>;
}

/** A reference to a section of the Act (or a term it defines there) as a link to the official text of that section. */
export function ElectronicTradeDocumentsActSection({section, className, children}: {
    section: number;
    className?: string;
    /** The reference or the term as written: "s.2(2)", "Electronic trade document". */
    children: ReactNode;
}) {
    return <Link className={className} to={electronicTradeDocumentsActSectionUrl(section)}>{children}</Link>;
}
