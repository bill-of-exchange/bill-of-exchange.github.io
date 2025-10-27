// TransferBoF.tsx
import React, {ChangeEvent, useState} from "react";
import {type Address, type Abi, erc20Abi, parseUnits, isAddress} from "viem";
import {blockchainExplorer, ContractName, DeployedChainId, deployments} from "@site/src/constants";
import {useAccount, useConnect, useWaitForTransactionReceipt, useWriteContract} from 'wagmi';
import { injected } from 'wagmi/connectors'
import {useWriteBillsOfExchangeTransfer, billsOfExchangeAbi} from "../../../generated";
// import {abi} from "./BillsOfExchange.json";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';

export default function TransferBoF() {

    const { connect, isPending: isConnecting } = useConnect();

    function requestConnect() {
        // Triggers MetaMask popup (connect or unlock)
        connect({ connector: injected()});
    }

    const TOKEN_DECIMALS = 18; // TODO: read from contract

    const account = useAccount();
    // console.log("account", account);

    const [isWorking, setIsWorking] = useState<boolean>(false);

    const [toAddress, setToAddress] = useState<Address|undefined>(undefined);
    const [amountToTransfer, setAmountToTransfer] = useState<number>(0);
    const [buttonText, setButtonText] = useState<string>("Transfer");

    // const { data: decimals } = useReadBillsOfExchangeDecimals();
    // console.log(decimals);

    // const {
    //     writeContract:transfer,
    //     data: hash,               // tx hash after submit
    //     isPending,                // waiting for wallet/user confirmation
    //     error: writeError,
    //     reset: resetWrite,
    // } = useWriteBillsOfExchangeTransfer();

    // const transfer = useWriteBillsOfExchangeTransfer();
    // console.log(transfer.variables);

    // const hash = transfer.data;

    // const { isLoading: isConfirming, isSuccess: isConfirmed } =
    //     useWaitForTransactionReceipt({hash});

    // https://wagmi.sh/react/api/hooks/useWriteContract
    // const { writeContract, data: txHah, status,error, } = useWriteContract();
    const { writeContract, data: txHash, isPending: writePending, error: writeError, reset: resetWrite } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if(value&&isAddress(value)){ // < check if value is a valid ETH address
            setToAddress(value as Address);
        }
    }

    const handleClick = async (event: React.FormEvent) => {
        event.preventDefault();

        console.log("handleClick triggered");

        // requestConnect();
        if (!account.isConnected) {
            // If not, just request connection and stop.
            requestConnect();
            return;
        }

        let amountAsBigInt: bigint;
        try {
            // Parse the human-readable amount (e.g., "0.5") into the token's base units
            amountAsBigInt = parseUnits(amountToTransfer.toString() as `${number}`, TOKEN_DECIMALS);
            if (amountAsBigInt < 0) throw new Error("Amount must be greater than 0");
        } catch (e) {
            console.error(e);
            alert("Please enter a valid amount.");
            return;
        }

        // // call generated write hook
        // try {
        //     // resetWrite();
        //     transfer.writeContract({
        //         args: [toAddress as Address, BigInt(amountToTransfer)]
        //     });
        // } catch (e) {
        //     console.error(e);
        // }
        // console.log(hash);

        resetWrite();
        // writeContract({ address, abi, functionName: functionName as any, //// @ts-expect-error variadic
        //     args: parsedArgs })

        const contractAddress=deployments.BillsOfExchange[account.chainId as DeployedChainId];
        console.log("contractAddress", contractAddress);


        if(!toAddress||!isAddress(toAddress)){
            console.error(toAddress, "is wrong address to transfer to");
        }

        // TODO: (!important) always check if args and other options values are valid, if not it will not trigger transaction
        const writeContractOptions = {
            address:contractAddress as Address,
            abi: erc20Abi,
            functionName: "transfer", //// @ts-expect-error variadic
            args: [
                toAddress as `0x${string}`, // TODO: (!) check if string is a valid address
                amountAsBigInt,
            ]
        } as const;

        console.log("writeContractOptions");
        console.log(writeContractOptions);

        writeContract(writeContractOptions);

        // Determine button state and text
        const isWorking = isConnecting || writePending || isConfirming;
        // let buttonText = "Transfer";
        if (!account.isConnected) setButtonText("Connect Wallet");
        else if (writePending) setButtonText("Confirm in wallet...");
        else if (isConfirming) setButtonText("Confirming Transaction...");

        // writeContract({
        //     abi,
        //     address: contractAddress,
        //     functionName: 'transfer',
        //     args: [
        //        toAddress,
        //         BigInt(amountToTransfer)
        //     ],
        // })

    }

    return (
        // https://docusaurus.io/docs/advanced/ssg#browseronly

        <div className="card" >
            <div className="card__header">
                <h3>Transfer</h3>
            </div>

            <div className="card__body">
                <div>
                    <input
                        width={"10rem"}
                        type={"text"}
                        value={toAddress}
                        onChange={handleOnChange}
                        placeholder={"0x..."}
                        autoComplete={"on"}
                        style={{ width: '80%', fontSize: '1rem' }}
                    />

                    <button
                        onClick={()=>{setToAddress(undefined)}}
                        style={{ width: '20%', fontSize: '1rem' }}
                        >
                        {"clear"}
                    </button>
                </div>
            </div>

            <div className="card__footer">
                <button className="button button--secondary button--block"
                        onClick={handleClick}
                        disabled={isWorking}
                        title={""}
                >
                    {/*{isWorking ? <FontAwesomeIcon icon={faCircleNotch} spin /> : "Transfer"}*/}
                    {buttonText}
                </button>
            </div>

        </div>
    );
}