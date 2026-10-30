---
sidebar_position: 1
---

# Global 

## Electronic bills of exchange 

This section lists the projects, platforms and initiatives we have found that work on electronic negotiable instruments: bills of exchange, promissory notes, drafts and cheques. Every entry ends with a short comparison with our own bills. The comparisons concern only the legal model and the technical implementation; the two are considered together, because in our contract they are the same thing: the state of the token *is* the legal state of the bill.

**What is being compared.** Our bills (see [How the contract works](../smart-contract/how-it-works.md)) have four features that we have not found together in any other project:

1. **One unit, one bill.** Every smallest unit of the ERC-20 token is a separate bill of exchange. The terms of the bill (the order to pay, the parties, the sum, "at sight") are public constants of the contract, not a document stored somewhere else.
2. **Payable to bearer, at sight.** The bill passes with the token, without indorsement; whoever controls the address holds the bill. An accepted bill is the acceptor's unconditional obligation, payable on presentation.
3. **A public registry without an operator.** The register of bills is a public blockchain, the code is open and verified, and anyone can read the terms, the balances and the acceptance state without an account on any platform. The signature of a party is the signature of its Ethereum transaction.
4. **A payment instrument, not a trade-finance document.** The bill is meant to circulate between bearers like a banker's draft or a banknote, not to be discounted once by a financier.

**Why English law.** Our bills are drawn under English law ([Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) and [Electronic Trade Documents Act 2023](https://www.legislation.gov.uk/ukpga/2023/38/contents)) by design, not by default. The project started from the [Geneva Uniform Law of 1930](https://www.jus.uio.no/english/services/library/treaties/09/9-03/bills-exchange-notes.html), the law of bills in continental Europe and the former Soviet Union, and moved away from it because under that law a fungible token cannot be a bill of exchange: a bill must name its payee (Article 1, item 6), is transferred by an indorsement written on the bill itself (Articles 11 and 13), and is a document signed by the drawer (Article 1, item 8). A unit that names a payee is no longer interchangeable with the next one, and a token has no reverse side to indorse. English law is the one major system in which every property of the token is lawful at once: a bill may be payable to bearer ([BEA s.8(3)](https://www.legislation.gov.uk/ukpga/Vict/45-46/61/section/8)), passes by delivery without indorsement ([s.31(2)](https://www.legislation.gov.uk/ukpga/Vict/45-46/61/section/31)), may exist in electronic form capable of possession (ETDA s.3), and may be signed electronically. The price of this choice is that our bills have no equivalent in the countries of the Geneva system; the [Europe](./Europe.md) page shows how their own reforms keep the named payee.

**One limit.** The contract has so far been deployed on test networks only; no bill has yet been issued for real value.

The jurisdiction pages hold the national systems and laws: [Israel](./Israel.md), [United Kingdom](./UK.md), [United States](./US.md), [Europe and other Geneva Convention countries](./Europe.md), [Singapore](./Singapore.md), [China](./China.md), [Japan](./Japan.md), [Hong Kong, Taiwan and South Korea](./Hong-Kong-Taiwan-Korea.md), [India](./India.md), [Latin America](./Latin-America.md), [Middle East](./Middle-East.md).

### Platforms and bank products

[Enigio trace:original](https://enigio.com/use-cases/bills-of-exchange/) — Platform of Enigio AB (Stockholm) for "digital originals" of bills of exchange, promissory notes, bills of lading and ITFA payment undertakings. Each instrument is a signed electronic document whose state and control history are anchored on what the company calls a hybrid distributed ledger; signatures are collected through DocuSign or Adobe Sign. Lloyds Banking Group led a €6 million round in September 2023 and is its main customer. Enigio says trace:original was the first solution verified under the ICC DSI reliability assessment ([Enigio](https://enigio.com/news/enigios-traceoriginal-becomes-first-verified-solution-under-icc-dsi-digital-trade-reliability-assessment/)).

**Transactions:** the first transaction under the UK ETDA on the day it came into force, 20 September 2023 — a digital promissory note issued by Matalan to Lloyds Bank ([Enigio](https://enigio.com/news/lloyds-bank-completes-first-digital-trade-transaction-under-new-uk-legislation/)); digital bills of exchange between Lloyds and Mercore with secondary participations in an accepted bill, 2024 ([Finextra](https://www.finextra.com/newsarticle/45973/lloyds-and-mercore-complete-secondary-trade-transactions-using-digital-documentation)); J.P. Morgan's electronic bills of exchange (below); a China–UK import settled with a digital bill of exchange in under 24 hours through the TradeGo channel, 2025 ([Trade Treasury Payments](https://tradetreasurypayments.com/articles/behind-the-scenes-of-the-24-hour-china-uk-import-that-travelled-the-digital-highway)); five electronic bills of exchange under Mauritian law, drawn by ETG and transferred to Mauritius Commercial Bank, September 2026 ([Enigio](https://enigio.com/news/enigio-africas-first-electronic-bill-of-exchange-under-mauritian-law/)).

**Compared with our bills:** Enigio's bills rest on the same Act as ours, which is the strongest confirmation available that the law we rely on is already used by major banks. The object is different. An Enigio bill is an individual document for one trade transaction, payable to a named party and discounted by a bank; its holder needs the platform, or a signing service, to deal with it, and its reliability is attested by third parties. Our bill is a fungible unit whose terms are fixed in the contract; possession is the token balance; any holder can verify it from the public chain and transfer it from an ordinary wallet, with no platform between the parties.

[J.P. Morgan Payments: electronic bill of exchange](https://www.jpmorgan.com/payments/newsroom/digitizing-trade-finance-eboe) — Bank product for trade bills of exchange under English law and the ETDA 2023, running on Enigio trace:original. First transaction announced in July 2025 (MTN South Africa, goods shipped from Asia to the UK). Extended to the United States in 2026 on the basis of New York's adoption of UCC Article 12 ([J.P. Morgan, May 2026](https://www.jpmorgan.com/payments/newsroom/electronic-bill-of-exchange-united-states)).

**Compared with our bills:** the same statute in the UK, a different instrument. J.P. Morgan's bills are time bills drawn for a shipment and held by the bank until maturity; in the United States they are "controllable electronic records" under Article 12, not drafts under Article 3. Our bills are payable at sight and, once accepted, circulate from bearer to bearer: the acceptor's obligation is itself the means of payment, not collateral for a loan.

[Mercore: digital negotiable instruments](https://www.mercore.com/digital-negotiable-instruments) — London trade-finance group that originates and funds digital bills of exchange (citing [BEA 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) [s.3(1)](https://www.legislation.gov.uk/ukpga/Vict/45-46/61/section/3)), promissory notes ([s.83(1)](https://www.legislation.gov.uk/ukpga/Vict/45-46/61/section/83)) and ITFA electronic payment undertakings, on Enigio's platform. Its first "digital bill of exchange" (February 2023) was an ITFA payment undertaking under contract law, made before the ETDA existed ([ITFA](https://itfa.org/?p=21459)); its 2024 transactions with Lloyds were digital bills of exchange with secondary participations.

**Compared with our bills:** Mercore is a financier: it buys an individual bill from an exporter and sells participations in it. Our contract is the instrument, not a financing service; there is no discount, because a sight bill carries no credit period. The holder of our bill is paid by the acceptor on presentation, not by a funder.

[ETR Digital Bills of Exchange](https://etr.digital/digital-bills-of-exchange) — London company (launched February 2025) offering API-based digital bills of exchange within its "Working Capital Notes" product family, which it describes as aligned with the MLETR and the ETDA 2023 and as kept as "a single authoritative record". *Transactions:* a programme for Şişecam financed by İşbank through the Faturalab platform (December 2025) and a first note funded by Investec Capital Solutions (2026) ([ETR Digital](https://etr.digital/insights/the-digital-bill-has-arrived)). The legal form of the notes is not published.

**Compared with our bills:** a closed service in which the record of the instrument lives in the vendor's system and its terms are known to the parties only. Our terms and our register are public; a counterparty, a court or a regulator can read the bill directly from the chain, and the instrument is not tied to any vendor.

[Citi Digital Bill](https://www.citigroup.com/global/news/press-release/2024/citi-launches-new-digital-trade-receivable-finance-solution) — Receivables product launched by Citi in October 2024 inside CitiDirect for clients in the US, UK and Ireland. Citi states that it "is not a negotiable instrument" and is structured under contract law.

**Compared with our bills:** the opposite choice. Citi replaced negotiability with a bank's contractual promise, so the rights of a transferee depend on Citi's terms. Our holder's rights come from the Act: an accepted bill binds the acceptor to whoever holds it, independently of any platform agreement.

[XDC Network: trade finance](https://docs.xdc.network/enterprise/trade-finance/) — EVM-compatible network promoted for trade-finance instruments. In October 2024 DocuTrade (Yodaplus) financed a US$49,518 fabric purchase with a digitally signed promissory note handled by a smart contract on XDC, with a regulated custodian and "invisible wallets" ([press release](https://benzinga.com/content/41507288/docutrade-facilitates-breakthrough-in-trade-finance-with-blockchain-based-digital-promissory-notes)). A single pilot.

**Compared with our bills:** the closest technical stack among commercial projects: an EVM chain and a smart contract. The differences are in what the contract holds. DocuTrade issues one note for one deal and keeps it through a custodian; our contract issues any number of identical bills held directly by their bearers in standard wallets, and the acceptance of the drawee is a state of the bill recorded in the same contract.

### Industry initiatives and standards

[ITFA Digital Negotiable Instruments (DNI) Initiative](https://itfa.org/trade-forfaiting/fintech-initiatives/) — Initiative of the International Trade and Forfaiting Association (since 2019) to digitise bills of exchange and promissory notes. Its outputs are contractual templates and specifications: the electronic payment undertaking (ePU), the dDOC specifications, the Uniform Rules for Transferable Electronic Payment Obligations ([URTEPO](https://itfa.org/wp-content/uploads/2022/12/URTEPO-Uniform-Rules-for-Transferable-Electronic-Payment-Obligations-Dec-2022-2.pdf), December 2022) and standards for electronic promissory notes and bills of exchange. Its [2026 plan](https://itfa.org/wp-content/uploads/2026/01/ITFA-Fintech-Committee-2026-Plan.pdf) pairs these instruments with settlement in a regulated stablecoin or tokenised deposit.

**Compared with our bills:** ITFA designed its instruments to work without a statute, through contract law, and keeps the ETDA route in parallel; our bills rely on the statute alone. More important is a difference of concept: ITFA treats the bill as the credit instrument and the stablecoin as the money. In our model the accepted bill is the money: the bank's accepted obligation circulates by itself, as it did in the nineteenth century, without a second token for settlement.

[ICC DSI: Key Trade Documents and Data Elements (KTDDE)](https://www.digitalizetrade.org/ktdde) — Reference framework of the ICC Digital Standards Initiative covering 36 trade documents, including the bill of exchange and the promissory note; a data glossary based on the UN Trade Data Elements Directory, which ICC itself says "is not a standard".

**Compared with our bills:** KTDDE lists the data elements a bill carries; our contract stores them as constants (`ORDER`, `DRAWER_NAME`, `DRAWEE_NAME`, `SUM_PER_BILL`, `CURRENCY`, `TIME_OF_PAYMENT`). The two are compatible: our constants can be mapped to the KTDDE elements, with the difference that in our case the data elements are the bill, not a description of it.

[ICC DSI and Digital Governance Council: Digital Trade Reliability Assessment](https://iccwbo.org/news-publications/news/icc-dsi-launches-digital-trade-reliability-assessment-tool/) — Assessment, launched in October 2024 as a beta self-assessment, of whether a platform transfers electronic transferable records consistently with the reliability standard of the MLETR.

**Compared with our bills:** the assessment examines a platform operated by a vendor. Our registry has no operator to assess: reliability is shown by the published, verified contract code and by the public ledger itself, which anyone can audit at any time. Whether the assessment methodology can be applied to a public blockchain is an open question.

### International law

[UNCITRAL Model Law on Electronic Transferable Records (MLETR, 2017)](https://uncitral.un.org/en/texts/ecommerce/modellaw/electronic_transferable_records) — Model law providing for electronic equivalents of transferable documents, including bills of exchange and promissory notes, through the concepts of a reliable method and exclusive control. Adopted, among others, by Bahrain (2019), Abu Dhabi Global Market (2021), Singapore (2021), the United Kingdom (2023, in its own form), France (2024) and Mauritius (2025).

**Compared with our bills:** the MLETR asks whether a method reliably ensures that one record is the original and that one person controls it. On a public blockchain both are properties of the ledger: a token balance exists once and is controlled by one private key. Our model is a test of the MLETR's criteria against a registry that nobody operates.

[UNIDROIT Principles on Digital Assets and Private Law (2023)](https://unidroit.org/instruments/digital-assets-and-private-law/overview) — Principles defining a digital asset as an electronic record capable of being subject to control, with rules on control and on acquisition by an innocent purchaser; they leave the link between a token and an underlying asset to other law.

**Compared with our bills:** "control" in the Principles corresponds to holding the private key of the address with the balance. The Principles supply the property-law layer; the [Bills of Exchange Act](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) supplies the instrument. Our contract combines the two: the token is not linked to a bill, it is the bill.

### Central-bank projects

[BIS Project Promissa](https://www.bis.org/publ/othp93.htm) — Proof of concept of the BIS Innovation Hub, the World Bank and the Swiss National Bank (report of 23 April 2025) for tokenising the promissory notes that member countries deposit with multilateral development banks. The report found the platform addressed the operational problems and left open the legal characterisation, the governance and the question of who would operate the platform.

**Compared with our bills:** the notes in Promissa are high-value, non-circulating commitments between a sovereign and a development bank, kept on a permissioned platform. The questions Promissa left open — who runs the registry and under which law — are the questions our design answers by using a public chain and one named statute.

### Open-source and blockchain projects

[TradeTrust](https://www.imda.gov.sg/how-we-can-help/digital-utilities/tradetrust) — Open-source framework of Singapore's Infocomm Media Development Authority for MLETR-aligned transferable documents, with one ERC-721 token per document ([GitHub](https://github.com/TradeTrust)). Documented for electronic bills of lading; its source code added an obligation lifecycle (accept, reject, discharge) in 2026. See [Singapore](./Singapore.md).

**Compared with our bills:** TradeTrust and our contract both record the acceptance of an obligation on chain. TradeTrust individuates each document as a non-fungible token with the document itself kept off chain and only its hash on chain; our bills are fungible units with their terms on chain. TradeTrust serves trade documents between known parties; our bills serve payment between bearers.

[Accord Project: promissory-note template](https://github.com/accordproject/cicero-template-library) — Open-source smart legal contract template (Linux Foundation) for an interest-bearing loan repayable under a promissory note.

**Compared with our bills:** a machine-readable contract text, not a transferable instrument: it has no holder and no possession. Our token is the instrument and the register of its holders at once.

[Billex](https://medium.com/billex/billex-powering-innovation-with-negotiable-instruments-6f06b37ca8bd) — Concept (2019) of a blockchain bill of exchange under the [Bills of Exchange Act 1882](https://www.legislation.gov.uk/ukpga/Vict/45-46/61) to replace cheques and drafts. No code or deployment was published.

**Compared with our bills:** the same aim and the same Act. Billex proposed transfer by indorsement; our bills are payable to bearer and pass by transfer alone. Our contract is deployed and its code is verified.

[Cryptonomica: electronic bills of exchange](https://github.com/Cryptonomica/cryptonomica/wiki/electronic-bills-of-exchange) — Earlier project (2019) of the author of this site: a factory contract on Ethereum creating ERC-20 tokens, each described as a bill of exchange in blank payable to bearer, with on-chain acceptance by the drawee; deployed on the Ropsten test network and audited by Callisto ([Medium, June 2019](https://medium.com/cryptonomica/electronic-bills-of-exchange-on-blockchain-d48c62cf45ea)).

**Compared with our bills:** the direct predecessor of this project, built before the ETDA 2023 existed. The present contract replaces per-bill factory contracts with one contract whose terms are constants, adds the separate ledger of unaccepted bills, and rests on the ETDA, which in 2023 made electronic trade documents capable of possession under English law.

### Academic work

[A blockchain-based bill of exchange ("DigiBoE")](https://iris.univr.it/handle/11562/1042494) — Ponza, Scannapieco, Simone and Tomazzoli, Springer 2020: a proposal combining a distributed ledger, authentication and PDF/A archiving for debt settlement without intermediaries.

[Could DLT serve as the basis for a new kind of electronic negotiable instruments?](https://revistas.ucm.es/index.php/DERE/en/article/view/90889) — Spanish proposal (Derecom, Universidad Complutense de Madrid) for bills, cheques and promissory notes issued and transferred on a private blockchain operated from accounts of the Royal Mint and of banks.

**Compared with our bills:** both proposals keep a document or an operator at the centre; neither treats a fungible unit as a separate bill. We have found no published work on that model.

### Closed projects

[we.trade](https://library.iccwbo.org/content/tfb/news/dcwn_15June202210501.htm) (closed June 2022), [Marco Polo Network](https://www.irishtimes.com/business/2023/02/22/provisional-liquidators-appointed-to-software-company-with-52m-debts) (liquidation, February 2023) and [Contour](https://library.iccwbo.org/content/tfb/news/dcwn_31October2023113133.htm) (ceased operations 30 November 2023) — Bank-consortium blockchain networks for open-account trade and letters of credit. None issued negotiable instruments; all closed when their bank shareholders stopped funding them.

**Compared with our bills:** permissioned networks need an operator, a budget and a consortium agreement, and they end when the funding ends. A contract on a public chain needs none of these: once deployed, it runs for as long as the chain does.

## Stable coins 

[Ethereum Fondation: Stablecoins](https://ethereum.org/stablecoins/)

[Bridge](https://www.bridge.xyz/) - payments platform owned by [Stripe](https://stripe.com), built with stablecoins, to simplify global money movement.

### Metamask: mUSD 

[mUSD: MetaMask USD](https://metamask.io/price/metamask-usd)

### Tether: USDT

[Wikipedia: Tether (cryptocurrency)](https://en.wikipedia.org/wiki/Tether_(cryptocurrency))
