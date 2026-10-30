---
sidebar_position: 4
---

# United States 

United States law has no general electronic bill of exchange. Drafts and notes under Article 3 of the Uniform Commercial Code remain paper instruments; electronic equivalents exist through two separate routes, "transferable records" for mortgage notes and "controllable electronic records" under the new Article 12.

## Law 

---
### Legislation 

### GENIUS Act 

[congress.gov: GENIUS Act (full text)](https://www.congress.gov/bill/119th-congress/senate-bill/1582/text)

[Wikipedia: GENIUS Act](https://en.wikipedia.org/wiki/GENIUS_Act) 

[video: Signing Ceremony for S.1582 GENIUS Act](https://www.youtube.com/watch?v=1izvMU1WfBU)


**Compared with our bills:** a payment stablecoin under the GENIUS Act is the redemption obligation of a licensed issuer, backed one-to-one by reserves and carved out of securities law. An accepted bill in our model is the acceptor's unconditional obligation under the law of bills of exchange, with no reserve requirement and no special statute: its negotiability is two centuries older than the stablecoin's. Both are "an obligation to pay that circulates as money"; they differ in the source of the holder's rights.

### Electronic negotiable instruments

[E-SIGN Act, 15 U.S.C. §7021 "Transferable records"](https://www.law.cornell.edu/uscode/text/15/7021) — An electronic record that would be a note under UCC Article 3 if it were in writing may be a "transferable record", but only if it "relates to a loan secured by real property". The person in control of the single authoritative copy is the holder, with holder-in-due-course rights.

**Compared with our bills:** the federal carve-out is limited to mortgage notes and requires a system holding a single authoritative copy. Our bills are not secured by anything and have no authoritative copy to custody: the balance on the chain is the only record.

[2022 amendments to the Uniform Commercial Code: Article 12, controllable electronic records](https://www.dlapiper.com/en-us/insights/publications/2022/08/ulc-approves-important-new-amendments-to-the-uniform-commercial-code-for-state-adoption) — A controllable electronic record may evidence a "controllable payment intangible" when the obligor agrees to pay the person in control; a qualifying purchaser takes it free of competing claims, like a holder in due course ([Mayer Brown](https://www.mayerbrown.com/en/insights/publications/2023/04/the-ucc-amendments-and-their-impact-on-negotiable-instruments-in-trade-finance)). Adopted by 33 jurisdictions by December 2025; New York's amendments took effect on 5 June 2026 ([Alston & Bird](https://www.alston.com/en/insights/publications/2025/12/new-york-signs-2022-ucc-amendments)) and Ohio's on 6 October 2026 ([Ohio R.C. 1314.101](https://codes.ohio.gov/assets/laws/revised-code/authenticated/13/1314/1314.101/10-6-2026/1314.101-10-6-2026.pdf)). The Article 3 changes of 2022 are narrow: electronic images of cheques, truncation, choice of law and electronic signature ([Oklahoma Bar Journal](https://www.okbar.org/barjournal/january-2023/financial-institutions-and-commercial-law-committee-report-on-the-2022-amendments-to-the-uniform-commercial-code/)).

**Compared with our bills:** Article 12 does not create an electronic draft; it gives a token-like record negotiability-like effects while classifying it as a payment intangible. Its formula "pay the person in control" is the functional twin of our "pay to bearer". A United States variant of our contract would therefore be an Article 12 record, not an Article 3 bill; under English law the token is the bill itself.

[Check 21 Act: Federal Reserve FAQ](https://www.federalreserve.gov/paymentsystems/regcc-faq-check21.htm) — The "substitute check" (2004) is a paper copy with the legal effect of the original; the Act does not oblige banks to accept cheques in electronic form.

--- 

### Case law 

The decisions below concern electronic promissory notes under E-SIGN and UETA, electronic images of cheques, and the characterisation of crypto tokens and smart contracts.

#### Electronic notes and cheques

[New York Community Bank v. McClendon, 138 A.D.3d 805, 29 N.Y.S.3d 507 (N.Y. App. Div. 2d Dep't, 13 April 2016)](https://www.nycourts.gov/Reporter/3dseries/2016/2016_02790.htm) — A mortgage note signed electronically was a "transferable record" under 15 U.S.C. §7021; the person in control of it is the holder, and "delivery, possession, and endorsement are not required". The sworn eNote transfer history, with a copy of the eNote, established the lender's standing to foreclose.
**Relevance:** the leading appellate statement that a registry's record of transfers takes the place of physical possession and indorsement of an electronic note.

[Rivera v. Wells Fargo Bank, N.A., 189 So. 3d 323 (Fla. 4th DCA, 20 April 2016)](https://www.courtlistener.com/opinion/3196028/carlos-m-rivera-and-yanira-j-pena-santiago-v-wells-fargo-bank-na/) — Under Florida's UETA (§668.50(16)) an electronic note was a transferable record because the bank's system kept "a single authoritative copy … which is unique, identifiable, and unalterable" identifying Fannie Mae as the transferee; the bank, as Fannie Mae's custodian, had standing.
**Relevance:** applies the statutory test of control element by element; these elements are the natural yardstick for a token ledger.

[Good v. Wells Fargo Bank, N.A., 18 N.E.3d 618 (Ind. Ct. App., 29 September 2014)](https://caselaw.findlaw.com/court/in-court-of-appeals/1679476.html) — Summary judgment for the lender was reversed: it relied on an unindorsed paper copy of an electronic note and produced no evidence that a reliable system "documenting the transfer" established its control under §7021(b).
**Relevance:** the counter-example: without proof of control through a reliable system an electronic note cannot be enforced as a holder, and a printout is not enough.

[Wells Fargo Bank, N.A. v. Benitez, 2017 NY Slip Op 32747(U) (N.Y. Sup. Ct. Suffolk County, 10 December 2017)](https://www.nycourts.gov/reporter/pdfs/2017/2017_32747.pdf), [aff'd, 194 A.D.3d 986 (2d Dep't, 19 May 2021)](https://www.nycourts.gov/reporter/3dseries/2021/2021_03211.htm) — Summary judgment was first denied because control through the eNote registry had not been shown, then granted on renewal: the lender had standing "as the controller of the eNote, since Wells Fargo maintains the single authoritative copy".
**Relevance:** the same court moved from failure to success solely on the quality of the evidence of control.

[Comptroller of Maryland v. Badlia Brothers, LLC, No. 23, Sept. Term 2024 (Md., 28 March 2025)](https://law.justia.com/cases/maryland/court-of-appeals/2025/23-24.html) — A check casher cashed State cheques that had already been paid after mobile deposit of their images; the Supreme Court of Maryland held that a holder in due course may sue the State on a cheque and noted that the Check 21 Act provides the State's remedy for such duplicate presentment.
**Relevance:** duplicate presentment, where an electronic image and the paper original circulate at once, is the "double spend" of cheque law; a bill that exists only as a unique token cannot be presented twice.

[Garfield-Dan Ryan Currency Exchange, Inc. v. Citibank, N.A., No. 1:23-cv-05033 (N.D. Ill. 2024)](https://law.justia.com/cases/federal/district-courts/illinois/ilndce/1:2023cv05033/436246/27/) — A customer deposited a cheque image remotely and then cashed the paper original at a currency exchange; the exchange's claim under the remote-deposit indemnity of Regulation CC (12 C.F.R. §229.34(f)) was dismissed, because the indemnity runs only to a depositary bank.
**Relevance:** federal cheque law allocates the risk of a duplicated instrument by indemnities between banks, not by the law of negotiable instruments; a non-bank holder may be left without a remedy.

#### Tokens, crypto-assets and smart contracts

[Reves v. Ernst & Young, 494 U.S. 56 (1990)](https://supreme.justia.com/cases/federal/us/494/56/) — The Supreme Court's "family resemblance" test: a note is presumed to be a security unless it resembles a recognised non-security note (consumer notes, short-term notes secured by receivables, commercial paper financing current operations, and others), judged by the parties' motives, the plan of distribution, public expectations and other regulation.
**Relevance:** the controlling test for whether a tokenised note or bill is a security; wide distribution through wallets points one way, a commercial payment purpose the other.

[SEC v. Ripple Labs, Inc., 682 F. Supp. 3d 308 (S.D.N.Y., 13 July 2023)](https://www.sec.gov/enforcement-litigation/litigation-releases/lr-26306) — XRP "as a digital token, is not in and of itself" an investment contract; whether its sale is a securities transaction depends on the circumstances of the sale. Final judgment of 7 August 2024; both appeals were dismissed by stipulation in August 2025, so the district court's judgment stands.
**Relevance:** separates the token, a record, from the legal arrangement around it — the same distinction on which a token that is a bill of exchange rests.

[SEC v. Terraform Labs Pte. Ltd., No. 23-cv-1346 (S.D.N.Y., 28 December 2023)](https://www.nysd.uscourts.gov/sites/default/files/2023-12/23-cv-1346,%20Opinion%20and%20Order,%20December%2028,%202023.pdf) — The stablecoin UST was a security only "in combination with the Anchor Protocol", the scheme that paid holders a return; the court also rejected the Ripple distinction between methods of sale.
**Relevance:** a fixed-value payment token became a security only when tied to a promise of yield; a bill for a fixed sum payable at sight carries no such promise.

[United States v. Faiella, 39 F. Supp. 3d 544 (S.D.N.Y., 19 August 2014)](https://sherloc.unodc.org/cld/uploads/res/case-law-doc/usa/2014/united-states_of_america_v__robert_m__faiella_aka_btcking_and_charlie_shrem_html/UnitedStatesvFaiella.pdf) — Bitcoin "clearly qualifies as 'money' or 'funds'" for the federal offence of unlicensed money transmission (18 U.S.C. §1960).

[United States v. Murgio, 209 F. Supp. 3d 698 (S.D.N.Y., 19 September 2016)](https://www.courtlistener.com/opinion/7321914/united-states-v-murgio/) — Bitcoins are "funds" under §1960 in their ordinary meaning, and a crypto exchange was adequately alleged to be an unlicensed money-transmitting business.
**Relevance (Faiella, Murgio):** a ledger entry transferable by a private key can be "money" or "funds" for regulatory purposes. That says nothing about "money" in the UCC, which means currency authorised by a government, but it marks the regulatory field that a circulating payment token enters.

[In re Celsius Network LLC, 647 B.R. 631 (Bankr. S.D.N.Y., 4 January 2023)](https://www.nysb.uscourts.gov/content/re-22-10964-mg-celsius-network-llc-6) — The platform's terms of use "unambiguously transfer title and ownership" of crypto-assets deposited in its Earn accounts to Celsius, so they were property of its bankruptcy estate; assets in custody accounts were treated differently.
**Relevance:** for tokens held through an intermediary, ownership follows the contract, not the ledger; a bill held in a custodial wallet may belong to the custodian in its insolvency. A bill held in the bearer's own wallet does not raise this question.

[Van Loon v. Department of the Treasury, 122 F.4th 549 (5th Cir., 26 November 2024)](https://www.ca5.uscourts.gov/opinions/pub/23/23-50669-CV0.pdf) — Immutable smart contracts of Tornado Cash "are not property because they are not capable of being owned", and are not contracts or services, because no one can control them or exclude others from them; the sanctions on them were set aside, and Tornado Cash was delisted in March 2025.
**Relevance:** the code of an immutable contract is no one's property; the legal rights lie in the tokens controlled by their holders and in the obligations of drawer and drawee. This is how our contract is designed: the code is the register, the bills are the tokens.

[Risley v. Universal Navigation Inc., No. 23-1340 (2d Cir., 26 February 2025) (summary order)](https://www.lit-sl.aoshearman.com/siteFiles/50520/%5BSecurities%204%5D%20Risley%20v.%20Universal%20Navigation%20Inc.pdf) — Federal securities claims against the developer of the Uniswap protocol were dismissed: it "defies logic" that the drafter of a smart contract could be liable for third parties' misuse, and the contracts are "more analogous to overarching user agreements"; the state-law claims were later dismissed on remand ([S.D.N.Y. 2026](https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2022cv02780/577791/126/)).
**Relevance:** treats a smart contract as infrastructure and standard terms rather than as the parties' bargain, which supports reading our contract as the system of control and the terms of the bill as the contract.

[United States v. Eisenberg, No. 1:23-cr-00010 (S.D.N.Y., 23 May 2025)](https://www.venable.com/insights/publications/2025/06/venue-fatal-in-crypto-fraud-case-an-important) — Convictions for commodities fraud, manipulation and wire fraud arising from the exploitation of the Mango Markets protocol were vacated: the court found insufficient evidence of a false representation because the protocol "was permissionless and automatic" and had no terms forbidding the conduct, and found venue improper. (Link: Venable analysis; the opinion itself is on the court docket.)
**Relevance:** where code is the only "agreement", using it as coded may not be a misrepresentation. The terms of a bill should therefore be stated in words, not left implicit in code — which is why our contract carries its terms as public text constants (`ORDER`, `DESCRIPTION`, `LEGAL_SIGNATURE_STATEMENT`).

#### Analyses

[Uniform Law Commission: Summary of the 2022 UCC amendments](https://apps.legislature.ky.gov/CommitteeDocuments/75/28796/2.%20SB%20155%20-%20UCC%20Amendments%20%282022%29%20Summary.pdf) — States that Article 3 does not apply to electronic records "because a negotiable instrument must be a writing" and that the amendments "do not provide for an electronic negotiable instrument".

[Mayer Brown: The UCC Amendments and Their Impact on Negotiable Instruments in Trade Finance (April 2023)](https://www.mayerbrown.com/en/insights/publications/2023/04/the-ucc-amendments-and-their-impact-on-negotiable-instruments-in-trade-finance) — How an electronic draft must be redrafted as a promise to pay "the person in control" to work under Article 12.

[Dykema: What's Past Is Prologue — applying lessons from the financial crisis to the future of eMortgage and eNote litigation](https://www.dykema.com/a/web/93fCw6nhdWta2pcARx39oB/3h9mWa/whats-past-is-prologue-applying-lessons-from-the-financial-crisis-to-the-future-of-emortgage-and-enote-litigationpdf.pdf) — Review of the eNote cases and of electronic-signature decisions under UETA.

[Fannie Mae: eMortgage foreclosure educational aid](https://singlefamily.fanniemae.com/media/6201/display) — Practical guide to proving control of an eNote in foreclosure, with a digest of cases.

[Yale Journal on Regulation, Steven A. Levy: Van Loon v. Department of the Treasury — a decision with important implications for Bitcoin](https://www.yalejreg.com/nc/van-loon-v-department-of-the-treasury-a-decision-with-important-implications-for-bitcoin-by-steven-a-levy/)

[Kostelanetz: Ownership without intermediaries — comparing cryptocurrency to bearer instruments](https://kostelanetz.com/publications/ownership-without-intermediaries-comparing-cryptocurrency-to-bearer-instruments) — The analogy between crypto-assets and bearer paper, as drawn in practitioner commentary.

---

## Systems and projects

[MERS eRegistry](https://www.mersinc.org/eregistry) — Central registry of MERSCORP Holdings, part of ICE Mortgage Technology, for electronic mortgage promissory notes (eNotes) that qualify as transferable records under E-SIGN and UETA; the authoritative copies are kept in private eVaults. About 3.4 million unique eNotes registered as of 1 October 2026; more than 500 participants ([ICE, March 2026](https://www.businesswire.com/news/home/20260311965353/en/ICE-Announces-MERS-eRegistry-Surpasses-3-Million-eNotes)). The largest system of electronic promissory notes in the world.

**Compared with our bills:** MERS proves that electronic negotiable notes work at scale, but only as two-party credit instruments secured by real estate, registered centrally and vaulted by custodians. Our bills are unsecured bearer instruments on a public register with no custodian; the holder controls the bill directly.

[Figure: DART on the Provenance Blockchain](https://www.figure.com) — Registry of Figure Technology Solutions for eNotes and liens on the Provenance blockchain, described by the company as an E-SIGN/UETA safe-harbour-compliant alternative to MERS; in production for Figure's mortgage and home-equity lending, with eNote sales as NFTs to Apollo in 2022 ([Provenance](https://medium.com/provenanceblockchain/what-is-dart-ff0099917e21); [Figure, March 2025](https://www.businesswire.com/news/home/20250305521945/en)).

**Compared with our bills:** the only blockchain registry of negotiable notes operating at scale. One token is one loan, on a chain with permissioned validators, under the mortgage carve-out. In our contract one smallest unit is one bill, the chain is public, and the instrument is a bill of exchange, not a loan.

[J.P. Morgan Payments: electronic bill of exchange in the United States](https://www.jpmorgan.com/payments/newsroom/electronic-bill-of-exchange-united-states) — Extension (May 2026) of the bank's English-law product to the United States, on Enigio trace:original, on the basis of New York's adoption of Article 12.

**Compared with our bills:** see [Global](./Global.md). The United States launch confirms that the practical American path for an electronic bill is Article 12 rather than Article 3.
