import React, {ChangeEvent, useEffect, useState} from "react";
import {type Address, formatUnits, isAddress, zeroAddress} from "viem";

type EthAddressInputProps = {
    value?: Address,
    onChangeFunction: (e: ChangeEvent<HTMLInputElement>)=>void,
    clearFunction?: (e: React.FormEvent) => void,
};

export default function EthAddressInput(props: EthAddressInputProps) {

    const [value, setValue] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [color, setColor] = useState<"red"|"green">("green");

    useEffect(() => {

    },[value])

    return (
        <div className="ethAddressInput">

            <input
                className="ethAddressInput__input"
                name={"ethAddress"}
                width={"10rem"}
                type={"text"}
                value={value}
                onChange={props.onChangeFunction}
                placeholder={"0x..."}
                autoComplete={"on"}
                style={{ width: '80%', fontSize: '1rem' }}
            />

            <button
                className={"clearButton"}
                onClick={props.clearFunction}
                style={{ width: '20%', fontSize: '1rem' }}
            >
                clear
            </button>

            <div style={{ width: '80%', fontSize: '1rem' }}>

                <span style={{color:color}}>{message}</span>

            </div>

        </div>
    );
}