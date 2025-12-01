import React, {ChangeEvent, useEffect, useState} from "react";
import clsx from "clsx";
import {type Address, formatUnits, isAddress, zeroAddress} from "viem";
import {useReadBillsOfExchangeBalanceOf} from "../../../generated";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faShekelSign} from '@fortawesome/free-solid-svg-icons';
import EthAddress from "@site/src/components/wagmi/EthAddress";
import {currencySymbolSVG, decimals} from "@site/src/constants";

// const currencySymbol = faShekelSign;

export default function BalanceBof(){

    const [addressForRequest, setAddressForRequest] = useState<Address>(`0x${""}`);
    const [lastCheckedAddress, setLastCheckedAddress] = useState<Address>(zeroAddress);
    const [balance, setBalance] = useState<string|undefined>(undefined);`0x${"..."}`
    const [isWorking, setIsWorking] = useState<boolean>(false);
    const [inputAddressValidated, setInputAddressValidated] = useState<boolean|undefined>(undefined);
    const [validationMessage, setValidationMessage] = useState<string>("Input ETH address");

    // Call the hook at the component level
    // React hooks (including Wagmi’s generated hooks) must run at the top level of a function component
    // (or inside a custom hook) — never inside handleClick
    const { data, refetch } = useReadBillsOfExchangeBalanceOf({
        args: [addressForRequest as Address],
        query: {
            enabled: false, //
            // enabled: true, // runs if args changed
        }
    });

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setAddressForRequest(value as Address);
        if (value.length===0||value===`0x${""}`){
            setInputAddressValidated(undefined);
            setValidationMessage("Input ETH address");
        } else if (isAddress(value, {strict: false})){
            setInputAddressValidated(true);
            setValidationMessage("Valid address");
        } else {
            setInputAddressValidated(false);
            setValidationMessage("Not a valid ETH address");
        }
    };

    const updateBalance = async () => {
        if (!addressForRequest||!inputAddressValidated) return
        setIsWorking(true);
        setLastCheckedAddress(addressForRequest as Address);
        try {
            const { data: raw } = await refetch();
            console.log("raw:", raw);
            // ERC-20 balances are bigint; don't `Number()` (overflow risk). Format properly:
            const formatted = formatUnits(raw as bigint, /* token decimals, e.g. */ decimals);
            setBalance(formatted);
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsWorking(false);
        }
    };

    useEffect(() => {
        updateBalance();
    },[])

    const handleClick = async (event: React.FormEvent) => {
        event.preventDefault()
        updateBalance();
    }

    return (
        <div className="card">
            <div className="card__header">
                <h3>Check balance of:</h3>
            </div>

            <div className="card__body">
                <div>
                    {/* === Show Balance */}
                    <div>
                        <EthAddress ethAddress={lastCheckedAddress as Address}/>
                    </div>
                    <div>
                        {balance?balance:"no data"}
                        {balance?<FontAwesomeIcon icon={currencySymbolSVG} />:null}
                    </div>

                    <input
                        name={"ethAddress"}
                        width={"10rem"}
                        type={"text"}
                        value={addressForRequest}
                        onChange={handleOnChange}
                        placeholder={"0x..."}
                        autoComplete={"on"}
                        style={{ width: '80%', fontSize: '1rem' }}
                    />

                    <button
                        onClick={(e)=>setAddressForRequest(`0x${""}`)}
                        style={{ width: '20%', fontSize: '1rem' }}
                    >
                        clear
                    </button>

                    <div className={clsx(inputAddressValidated&&"textSuccess", inputAddressValidated===false&&"textError")}>
                        {validationMessage}
                    </div>

                </div>
            </div>

            <div className="card__footer">
                <button className="button button--secondary button--block"
                        onClick={handleClick}
                        disabled={!inputAddressValidated||isWorking}
                        title={!inputAddressValidated?"Enter valid ETH address":undefined}
                >
                    {isWorking ? <FontAwesomeIcon icon={faCircleNotch} spin /> : "Get/refresh"}
                </button>
            </div>

        </div>
    );
};