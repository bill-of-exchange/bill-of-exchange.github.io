
### Short description of the idea: 

We can imagine a smart contract in witch has implemented all the requirements of an 'instrument' as defined in Geneva Convention ( https://www.jus.uio.no/lm/bills.of.exchange.and.promissory.notes.convention.1930/doc.html ) or of an 'order in writing' as defined in U.K. Bills of Exchange Act 1882 (http://www.legislation.gov.uk/ukpga/Vict/45-46/61/contents), together with the Cryptonomica arbitration clause (https://github.com/Cryptonomica/arbitration-rules/blob/master/Arbitration_Rules/Cryptonomica/Cryptonomica-Arbitration-Rules.EN.clearsigned.md#model-arbitration-clause-for-contracts) 

This smart contract can define: 
* The name of the person who is to pay (drawee). We need a function 'accept', that provides a (digital) signature of the drawee. 
* The person who issues the bill (drawer). And with blockchain we have a (digital signature) of this person. 
* The name of the person to whom or to whose order payment is to be made. 
(These persons can be presented by address on the blockchain and identified via Cryptonomica.net It should be also stated if he/she is just a physical person, or acts in behalf of a legal person) 
* Sum to pay, which can be expressed in 1) fiat money, 2) cryptocurrency (ETH), or 3) cryptocurrency at the rate at the exchange rate for fiat currency at the time of payment. If a payment has to be made in cryptocurrency, the person to whom payment is to be made can be represented just by ETH address (payment is public and self-evident)

We also should provide a function for an endorsement. Technically it can be the same as 'transfer' in ERC20 (https://eips.ethereum.org/EIPS/eip-20) token standard. 
It probably better to make endorsements "without recourse", so we can unify bills/notes and make them more convenient for circulation.  In a smart contract we can make other forms of endorsements technically impossible.

See also on this topic: 
'The negotiable cow': https://en.wikipedia.org/wiki/Board_of_Inland_Revenue_v_Haddock 