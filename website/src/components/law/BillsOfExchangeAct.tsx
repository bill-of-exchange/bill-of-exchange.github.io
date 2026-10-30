import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';

/** The official text of the Act, on the UK government's legislation database. */
export const BILLS_OF_EXCHANGE_ACT_URL = 'https://www.legislation.gov.uk/ukpga/Vict/45-46/61';

/** legislation.gov.uk publishes each section on its own page; subsections have none, so s.17(2)(a) opens s.17. */
export function billsOfExchangeActSectionUrl(section: number): string {
    return `${BILLS_OF_EXCHANGE_ACT_URL}/section/${section}`;
}

/**
 * The name of the Act as a link to its official text. The site links every mention of the Act it writes
 * itself; text read from the contract is shown as recorded there, without links.
 */
export default function BillsOfExchangeAct({className}: { className?: string }) {
    return <Link className={className} to={BILLS_OF_EXCHANGE_ACT_URL}>Bills of Exchange Act 1882</Link>;
}

/** A reference such as "s.17(2)(a)" as a link to the official text of that section. */
export function BillsOfExchangeActSection({section, className, children}: {
    section: number;
    className?: string;
    /** The reference as written, which may name a subsection: "s.17(2)(a)". */
    children: ReactNode;
}) {
    return <Link className={className} to={billsOfExchangeActSectionUrl(section)}>{children}</Link>;
}
