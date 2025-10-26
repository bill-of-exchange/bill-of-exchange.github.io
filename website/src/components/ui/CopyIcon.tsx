import React, {useState} from "react";

import {type Address} from "viem";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck} from '@fortawesome/free-solid-svg-icons';
import {faCopy} from '@fortawesome/free-regular-svg-icons';


type CopyIconProps = {
    dataToCopy?: string|Address;
};

export default function CopyIcon(props: CopyIconProps) {

    const [icon, setIcon] = useState(faCopy);
    const [isCopied, setIsCopied] = useState(false);


    const handleClick = async ()=>{
        if (props.dataToCopy) {
            try {
                await navigator.clipboard.writeText(props.dataToCopy.toString() as string);
                setIsCopied(true);
                setIcon(faCheck);
                setTimeout(() => setIcon(faCopy), 2000);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return(
        <FontAwesomeIcon
            className={"CopyIcon"}
            icon={icon}
            onClick={handleClick}
            title={isCopied?"Copied!":"Click to copy"}
        />
    )
}