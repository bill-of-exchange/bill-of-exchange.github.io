---
sidebar_position: 5
---

# Europe and other Geneva Convention countries

Continental Europe, Ukraine and most of the former Soviet Union follow the [Geneva Uniform Law on Bills of Exchange and Promissory Notes of 1930](https://www.jus.uio.no/english/services/library/treaties/09/9-03/bills-exchange-notes.html). Under it a bill must name its payee (Article 1) and cannot be drawn payable to bearer, and the signed paper is the instrument. Two consequences follow for everything on this page: no project in these countries issues a bearer bill, and the companies that want a digital bill of exchange today either draw it under English law or build an instrument that is legally something else. Our project took the first path for the same reason: it began with the Geneva model and moved to English law because a fungible token cannot satisfy the Geneva form (see [Global](./Global.md#electronic-bills-of-exchange)). The comparisons below therefore show not where our bills fall short of Geneva law, but why they were designed outside it.

## France

[Loi n° 2024-537 du 13 juin 2024 visant à accroître le financement des entreprises et l'attractivité de la France](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000049707573) — Articles 14–16 introduce the electronic transferable title ("titre transférable électronique"), covering bills of exchange (lettres de change) and promissory notes (billets à ordre); in force since 13 March 2025. The first enactment of an electronic bill of exchange in a Geneva Convention country. Cheques are excluded ([Norton Rose Fulbright](https://www.nortonrosefulbright.com/en/knowledge/publications/50678cd3/france-introduces-new-category-of-legal-instrument-to-support-the-growth-of-international-trade)).

[Décret n° 2025-811 du 12 août 2025 relatif à la définition de la méthode fiable pour la dématérialisation des titres transférables](https://www.icc-france.fr/wp-content/uploads/2025/08/Decret-2025-811.pdf) — Defines the "reliable method": uniqueness of the document, exclusive control by the holder, identification of signatories and successive holders by an electronic identification means of "substantial" level under eIDAS, integrity with a history of actions, and evaluation and certification of the method by an independent body less than five years old. No certified method and no first transaction had been reported by October 2026.

**Compared with our bills:** the French regime and ours answer the same question, what makes an electronic record a bill, in opposite ways. France requires a named payee, identified holders and a certified operator; our bills are payable to bearer, held by whoever controls an address, and verified from public code rather than certified by a body. Our bills are therefore not lettres de change électroniques, and are not meant to be: they are drawn under English law precisely so that a bill can circulate without identification at each transfer, like cash, which French law does not allow for bills.

[Lettre de change relevé (LCR) and billet à ordre relevé (BOR)](https://www.cfonb.org/fichiers/20130612092941_2_7_Brochure_clientele_Effets_de_commerce_LCR__BOR_2002_09.pdf) — The long-standing dematerialised collection of commercial bills through the French interbank system (CFONB). French doctrine holds that an LCR without a paper bill "n'est pas une lettre de change" ([Gazette du Palais, 2015](https://www.labase-lextenso.fr/gazette-du-palais/2015-n216/la-lettre-de-change-releve-magnetique-n-est-pas-une-lettre-de-change-GPL236h8)).

**Compared with our bills:** the LCR is a bank collection process in which the bill does not circulate and, without paper, loses its cambiary character. Our bill keeps its character throughout, because the register entry is the bill.

[Banque de France and Euroclear: Project Pythagore](https://www.banque-france.fr/system/files/2025-10/PR_Project_Pythagore_FINAL.pdf) — Tokenisation of French short-term commercial paper (NEU CP) on Euroclear's distributed-ledger platform, with a pilot from the end of 2026 aligned with the Eurosystem's Pontes project. NEU CP are financial instruments, not bills of exchange.

## Germany

[Lobbyregister des Bundestages: "Elektronischer Wechsel" (RV0001829)](https://www.lobbyregister.bundestag.de/media/02/9c/677689/Lobbyregister-Regelungsvorhaben-Detailansicht-RV0001829-2026-01-05_14-26-11.pdf) — Lobbying project of ICC Germany for an amendment of the Wechselgesetz modelled on the MLETR, registered from June 2024 to January 2026. No government draft had been published by October 2026; ITFA described Germany as "in legal limbo" on electronic bills ([ITFA, May 2026](https://itfa.org/?p=34323)).

[PwC Germany: BexNote](https://www.pwc.de/de/finanzdienstleistungen/pwc-whitepaper-revolution-im-scf-bexnote.pdf) — Digitised bill of exchange for supply-chain finance described in a September 2024 whitepaper: the supplier issues, the buyer accepts, a bank buys the note. Its current use relies on UK law, the ETDA 2023 ([Trade Finance Global](https://www.tradefinanceglobal.com/posts/bexnote-the-nascent-digital-revolution-in-bills-of-exchange/)); the technology, the operator and the volumes are not published.

[Traxpay](https://www.pressebox.com/pressrelease/traxpay-gmbh/traxpay-to-launch-web-application-for-digital-bills-of-exchange-a-new-milestone-for-supply-chain-finance/boxid/1256688) — Frankfurt supply-chain-finance company that announced a web application for digital bills of exchange, in partnership with Arqit for encryption; its managing director called the UK Act "the major breakthrough" ([BCR](https://bcrpub.com/tag/traxpay/)).

**Compared with our bills (BexNote, Traxpay):** both confirm our choice of law: German companies that want a digital bill today draw it under English law, because German law offers none. Both issue order bills with a maturity, between identified companies, for financing; BexNote also ties the payment date to performance indicators, which sits uneasily with the requirement of an unconditional order in s.3 of the 1882 Act. Our bills are unconditional, at sight and to bearer, and their register is public rather than a vendor's application.

[Commerzbank, Continental and Siemens: electronic commercial paper on a blockchain (January 2019)](https://commerzbank.de/konzern/newsroom/pressemitteilungen/2019/20190220-pr-continental-commerzbank-siemens-ecp-blockchain-en.pdf) — A €100,000 commercial paper with a three-day maturity issued by Continental to Siemens on a Corda-based platform of Commerzbank's incubator, governed by Luxembourg law, signed with qualified electronic signatures and settled against Commerzbank e-money. A one-off pilot.

**Compared with our bills:** a security under Luxembourg law on a permissioned ledger, with delivery against payment. Our instrument is a bill of exchange, not a security, and needs no payment leg: the accepted bill is the payment.

## Switzerland

[FQX eNote](https://www.gtreview.com/?p=95053) — Electronic promissory notes of FQX AG (Zurich), signed with Swisscom qualified electronic signatures on the Swiss Trust Chain, one ISIN per note, governed at launch by Delaware law. **Pilots:** first note settled in Sygnum's DCHF stablecoin, September 2020 ([finews.ch](https://www.finews.ch/news/banken/42968-sygnum-fqx-swisscon-enote-wechsel)); a pilot with Credit Suisse and the manufacturers SFS and Mikron ([Ledger Insights](https://www.ledgerinsights.com/credit-suisse-trials-blockchain-promissory-notes-with-fqx/)); an announced listing of eNotes as NFTs on SIX Digital Exchange (February 2022). No activity has been reported since 2022.

**Compared with our bills:** the closest European analogue in spirit: a small company, a ledger, an instrument as a digital object, settlement in a stablecoin. The eNote was an order note between identified parties, one token per note, on a permissioned chain, under American law. Our bills are fungible, to bearer, on a public chain, under the Act that governs bills in their home jurisdiction. FQX's silence since 2022 is the clearest warning in this field: a working design does not by itself create demand.

[Federal Act on the Adaptation of Federal Law to Developments in Distributed Ledger Technology (DLT Act, 2021)](https://www.pwc.ch/en/insights/regulation/partial-entry-swiss-dlt-act.html) — Introduced ledger-based securities (Registerwertrechte, art. 973d ff. of the Code of Obligations). The strict form of a Wechsel under the Code is not displaced by it; no ledger-based bill of exchange has been reported.

## Sweden

[ICC Sweden: proposal for the implementation of the MLETR in Swedish law (November 2025)](https://www.icc.se/wp-content/uploads/2025/11/FINAL_Lagforslag-Implementering-av-elektroniska-negotiabla-handelsdokument_nov-2025.pdf) — Draft by Emil Elgebrant (Stockholm University) with ICC Sweden adding one sentence to the Bills of Exchange Act (Växellagen 2 §): what the Act says of a bill applies also to a bill in electronic form; with a parallel change to the Cheques Act and a rule treating exclusive control as possession. A proposal, not law.

**Compared with our bills:** the most economical legislative technique found in a Geneva country, and the one closest to the English approach: possession is satisfied by exclusive control. It keeps the named payee, so a Swedish electronic bill would still be an order instrument; ours is a bearer instrument.

## Spain

[Norbolsa: corporate promissory notes (pagarés) on a blockchain](https://www.diariobitcoin.com/paises/europa/espana/espana-pagares-en-blockchain/) — Private placements for Vidrala (€15 million) and Sidenor (€4.3 million) on the MARF alternative fixed-income market, around 2020, recorded on Hyperledger Fabric.

**Compared with our bills:** despite the name, these pagarés are short-term securities of a regulated market, not promissory notes under the Ley Cambiaria y del Cheque. Our bills are bills of exchange under the law of bills of exchange, not securities.

[La materialización de una letra de cambio sobre blockchain](https://www.civil-mercantil.com/letra-cambio-token-smart-contract-blockchain-letrabloc.html) — Academic study (CEFLegal, 2020) of a bill of exchange as a token and smart contract under Spanish law.

## Poland

[Ministry of Digital Affairs working group: "Weksle elektroniczne w technologii blockchain" (2019)](https://fintek.pl/wp-content/uploads/2020/03/Weksle-elektroniczne-w-technologii-blockchain.pdf) — Expert document (version 1.01, November 2019) of the working group on distributed registers at the Ministry of Digital Affairs, with participants from ING, the Jagiellonian University, Oracle, 7Bulls and NASK: a promissory note (weksel własny) as an XML document signed with a qualified electronic signature and kept through a smart contract on public Ethereum, with indorsement and acceptance on chain. A working prototype was built; no pilot followed, and the group recommended adopting the MLETR.

**Compared with our bills:** the closest European predecessor of our architecture: public Ethereum, a smart contract as the register, acceptance recorded on chain. It stopped at the Geneva form: a named payee, a qualified signature, one record per note. Our project met the same obstacles and resolved them by moving to English law, where a bearer bill is valid, a bill passes without indorsement and the transaction signature is the signature. The price of that choice is that our bills are not Polish bills.

## Ukraine

[Рішення НКЦПФР від 26.11.2013 № 2674](https://news.dtkt.ua/finance/currency-and-securities/27100-finansovi-bankivski-ta-kaznaceiski-vekseli-mozna-vidavati-v-elektronnomu-vigliadi) (Decision of the National Securities and Stock Market Commission No. 2674 of 26 November 2013) — Allows financial bank bills (фінансові банківські векселі) and financial treasury bills (фінансові казначейські векселі) to be issued as electronic documents.

[Рішення НКЦПФР від 17.12.2013 № 2893](https://jurliga.ligazakon.net/news/104451_zatverdzhen-rekvziti-bankvskogo-vekselya-elektronno-formi) (Decision No. 2893 of 17 December 2013 on the requisites of the electronic financial bank bill) — The electronic bill carries the words "Простий вексель", the bank's unconditional promise to pay, the interest rate, the due date, the place of payment, the payee, an indorsement field without a limit on the number of indorsements, and the electronic digital signatures of the bank's head and chief accountant. Whether these decisions remain in force after the capital-markets reform of 2020–2021 has not been verified.

**Compared with our bills:** the Ukrainian electronic bill is a signed electronic document with indorsements, issued only by a bank or the Treasury and payable to a named person. The idea that an electronic signature makes an electronic bill is the same as ours; the differences are the Geneva form (payee, indorsement, maturity) and the absence of a public register. Our bills are to bearer, at sight, and pass by transfer of the token on a public chain.

[DONE: electronic promissory notes for Ukrainian importers](https://itfa.org/dni-case-study-done-set-to-build-on-success-of-digital-promissory-notes-september-2025/) — Ukrainian–Polish supply-chain-finance company licensed by the National Bank of Ukraine and a member of the ITFA DNI Initiative. Since May 2024 it has issued about twenty electronic promissory notes, roughly US$1.6 million in total, typically US$30,000–100,000 with 30–60 day tenors, for Ukrainian distributors buying from Chinese factories; the notes are issued on Enigio trace:original and structured as irrevocable payment undertakings.

**Compared with our bills:** a live Ukrainian use of digital notes, but as English-law instruments on a foreign platform, each for one purchase and discounted by DONE. Our bills are drawn under the same English law; they differ in being standardised bearer bills on a public register, meant to circulate rather than to be discounted once.

[UK–Ukraine Digital Trade Agreement (2023)](https://www.gov.uk/government/collections/uk-ukraine-digital-trade-agreement) — Agreement on digital trade between the United Kingdom and Ukraine, in force since 2023 ([Government of Ukraine](https://www.kmu.gov.ua/en/news/ukraina-ta-velyka-brytaniia-posyliuiut-spivpratsiu-v-tsyfrovii-torhivli-nabula-chynnosti-uhoda-pro-tsyfrovu-torhivliu)).

## Russia

[Digital financial assets (ЦФА) market, 2025](https://www.vedomosti.ru/analytics/trends/articles/2026/01/30/1172789-rinok-tsfa-v-rossii-v-2025-godu-viros-na-115) — Digital financial assets under Federal Law No. 259-ФЗ are issued on permissioned ledgers of operators registered by the Bank of Russia (Alfa-Bank, the National Settlement Depository, Sberbank and others); 172 billion roubles outstanding at the end of 2025. They are monetary claims of their own legal category, not bills of exchange.

**Compared with our bills:** closed, licensed platforms with identified participants, issuing a statutory asset created for the purpose. Our bills are an old instrument on an open register, with no licence and no operator between issuer and holder.

## Kyrgyzstan

[Закон о внесении изменений в закон о присоединении к Женевской конвенции (April 2026)](https://economist.kg/ekonomika/2026/04/24/v-kyrgyzstane-uzakonili-elektronnye-vekselia/) — Amendments adopted by the Jogorku Kenesh on 9 April 2026 and signed on 23 April 2026 to Article 2 of the annex to the law on accession to the Convention providing a Uniform Law for Bills of Exchange and Promissory Notes: a bill "должен быть составлен на бумаге или в электронной форме" (must be drawn up on paper or in electronic form), alongside paper bills; the only technology named is the digital signature ([24.kg](https://24.kg/ekonomika/367691_vkyirgyizstane_hotyat_vvesti_elektronnyie_vekselya_zakon_vnesli_vjogorku_kenesh/)). No registry or platform had been announced by October 2026.

**Compared with our bills:** the first state we have found to write electronic form into the text of the Uniform Law itself, rather than into a separate statute. The law is technology-neutral, so a register on a blockchain is not excluded; the bill remains an order instrument with a named payee. Our bearer bills would not qualify under it, and the amendment does not change the reason we chose English law; it is nonetheless a precedent that the Geneva system can admit electronic bills without a new convention.

## European Union

[Eurosystem exploratory work on new technologies for wholesale central bank money settlement (2024)](https://bundesbank.de/en/tasks/payment-systems/trigger-solution) — Trials settling tokenised securities in central bank money through the Bundesbank Trigger Solution and the solutions of the Banque de France and the Banca d'Italia; continued in the Pontes pilot from 2026. The work concerns financial instruments and settlement, not bills of exchange. No EU legislative proposal on electronic transferable records exists.

[Regulation (EU) No 910/2014 (eIDAS), Article 25(2)](https://eur-lex.europa.eu/eli/reg/2014/910/oj) — A qualified electronic signature has the legal effect of a handwritten signature. This is the hook the Polish proposal and the French decree rely on.

**Compared with our bills:** the signature of an Ethereum transaction is an electronic signature in the sense of eIDAS, but not a qualified one, so it would not satisfy a Geneva-law signature requirement without national legislation on functional equivalence. Under English law, which does not prescribe the form of a signature, it suffices ([J Pereira Fernandes SA v Mehta](https://vlex.co.uk/vid/j-pereira-fernandes-sa-793329805); ETDA 2023 s.3).
