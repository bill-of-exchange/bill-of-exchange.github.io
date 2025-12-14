// TransferBoE.tsx
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {type Address, type Abi, erc20Abi, parseUnits, isAddress} from "viem";
import clsx from "clsx";
import {
    blockchainExplorerUrl,
    ContractName,
    DeployedChainId,
    deployments,
    currencySymbolSVG,
    currencySymbolString, defaultBlockchainExplorer
} from "@site/src/constants";
import {useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract} from 'wagmi';
import { injected } from 'wagmi/connectors'
import {useWriteBillsOfExchangeTransfer, billsOfExchangeAbi} from "../../../generated";
// import {abi} from "./BillsOfExchange.json";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import {AlertType} from "@site/src/components/ui/InfimaAlert";
import {TOKEN_DECIMALS} from "@site/src/constants";
import CurrencyInput, {CurrencyInputOnChangeValues} from 'react-currency-input-field';
import CopyIcon from "@site/src/components/ui/CopyIcon";

export default function TransferBoE() {

    const account = useAccount();

    const [isWorking, setIsWorking] = useState<boolean>(false);

    const [toAddress, setToAddress] = useState<Address>();
    const [amountToTransfer, setAmountToTransfer] = useState<number>(0);
    const [buttonText, setButtonText] = useState<string>("Transfer");
    const [txStatus, setTxStatus] = useState<string>("");
    const [inputAddressValidated, setInputAddressValidated] = useState<boolean|undefined>(undefined);
    const [validationMessage, setValidationMessage] = useState<string>("Input ETH address");
    const [clearStatus, setClearStatus] = useState<boolean>(true);

    // Wraps useWriteContract with abi set to billsOfExchangeAbi and functionName set to "transfer"
    // useWriteContract:
    // https://wagmi.sh/react/api/hooks/useWriteContract
    // Return Type: { type UseWriteContractReturnType } from 'wagmi'
    const {
        writeContract:transfer,
        status, // https://wagmi.sh/react/api/hooks/useWriteContract#status
        data: txHash,  // undefined, tx hash after submit
        isPending,     // waiting for wallet/user confirmation
        isSuccess,
        isError,
        error: writeError,
        reset: resetWrite,
    } = useWriteBillsOfExchangeTransfer();

    const txReceipt = useWaitForTransactionReceipt({hash:txHash});

    const onValueChange = (value: string | undefined, name?: string | undefined, values?: CurrencyInputOnChangeValues | undefined) => {
        if(values&&values.float&&values.float>=0){
            setAmountToTransfer(values.float*10);
        }
    };

    const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (value.length==0){
            setInputAddressValidated(undefined);
            setValidationMessage("Input ETH address");
        } else if (isAddress(value, {strict: false})){
            setInputAddressValidated(true);
            setValidationMessage("Valid address");
            setToAddress(value as Address);
        } else {
            setInputAddressValidated(false);
            setValidationMessage("Not a valid ETH address");
        }
    };

    const handleTransfer = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsWorking(true);

        try {

            // (!important) always check if args and other options values are valid, if not it will not trigger transaction
            if(!toAddress||!isAddress){
                console.error("toAddress invalid:",toAddress);
                return;
            }

            setClearStatus(false);
            const value = BigInt(amountToTransfer) as bigint;
            const transferOptions = {
                args: [
                    toAddress as Address,
                    value as bigint,
                ]
            } as const;

            resetWrite();
            transfer(transferOptions);

        } catch (e) {
            console.error(e);
        } finally {
            setIsWorking(false);
            if(txHash){
                console.log("txHash:", txHash);
            }
        }
    }

    const handleClearStatus = (e:React.FormEvent)=>{
        e.preventDefault();
        setClearStatus(true);
    }

    return (
        <div className="transferBoF row row--eq" style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
            <div className="col col--6">

                <div className="card transferForm" >
                    <div className="card__header">
                        <h3>Transfer</h3>
                    </div>

                    <div className="card__body">
                        <div>
                            <b>{"Amount: "}</b>
                        </div>
                        <div>
                            <CurrencyInput
                                id={"transferAmountInput"}
                                name={"transferAmountInput"}
                                placeholder="Please enter a number"
                                disableGroupSeparators={true}
                                prefix={currencySymbolString}
                                // suffix={"₪"}
                                defaultValue={10}
                                decimalsLimit={2}
                                onValueChange={onValueChange}
                                style={{
                                    // width: '80%',
                                    width: '100%',
                                    fontSize: '1rem',
                                    // marginRight: '.1rem',
                                }}
                            />
                        </div>


                        <div>
                            <b>{"Receiver address: "}</b>
                        </div>

                        <input
                            // width={"10rem"}
                            type={"text"}
                            // value={toAddress}
                            onChange={onAddressChange}
                            placeholder={"0x..."}
                            autoComplete={"on"}
                            style={{
                                width: '100%',
                                fontSize: '1rem'
                            }}
                        />

                        <div className={clsx(inputAddressValidated&&"textSuccess", inputAddressValidated===false&&"textError")}>
                            {validationMessage}
                        </div>

                    </div>

                    <div className="card__footer">

                        <button className="button button--secondary button--block"
                                onClick={handleTransfer}
                                disabled={!toAddress||isWorking||isPending}
                                title={""}
                        >
                            {isWorking||isPending ?
                                <FontAwesomeIcon icon={faCircleNotch} spin />
                                : buttonText
                            }

                        </button>
                    </div>
                </div>

            </div>
            <div className="col col--6">
                <div className="card transferStatus" >
                    <div className="card__header">
                        <h3>Transfer status</h3>
                    </div>
                    <div className="card__body">
                        <div className="row txHash">
                            <div className="col col--4">
                                <b>Tx hash: </b>
                            </div>
                            <div className="col col--8">
                                {account.chainId&&txHash&&!clearStatus?
                                    <span>
                                        <a
                                            title={`Click to view on ${defaultBlockchainExplorer}`}
                                            target={"_blank"}
                                            rel={"noreferrer noopener"}
                                            href={
                                                `${blockchainExplorerUrl[defaultBlockchainExplorer][account.chainId as DeployedChainId]}tx/${txHash}`
                                            }>
                                        {txHash?txHash:null}
                                        </a>
                                        {" "}
                                        {txHash?<CopyIcon dataToCopy={txHash}/>:null}
                                    </span>
                                    :null
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col--4">
                                <b>Tx status: </b>
                            </div>
                            <div className="col col--8">
                                <span className={clsx(
                                    status==="success"&&"textSuccess",
                                    status==="error"&& "textError",
                                )}>
                                    {status==="success"&&!clearStatus?"✅":null}
                                    {status==="error"&&!clearStatus?"❌":null}
                                    {status=="pending"&&!clearStatus?"⏳":null}
                                    {" "}
                                    {status&&!clearStatus?status:null}
                                </span>

                            </div>
                        </div>
                        {
                            writeError&&!clearStatus?
                                <div className="row">
                                    <div className="col col--4">
                                        <b>Error: </b>
                                    </div>
                                    <div className="col col--8">
                                        <span className={"textError"}>
                                            {writeError.message}
                                        </span>
                                    </div>
                                </div>
                                :null
                        }
                    </div>
                    <div className="card__footer">
                        <button className="button button--secondary button--block"
                                onClick={handleClearStatus}
                                disabled={clearStatus}
                                title={"Clear status"}
                        >
                            {"Clear"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}