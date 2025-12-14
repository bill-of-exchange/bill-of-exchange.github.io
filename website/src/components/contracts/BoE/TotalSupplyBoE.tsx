import React, {useEffect, useState} from "react";
import {formatUnits} from "viem";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch} from '@fortawesome/free-solid-svg-icons';
import {currencySymbolSVG, decimals} from "@site/src/constants";

import {useReadBillsOfExchangeTotalSupply} from "../../../generated";

export default function TotalSupplyBoE(props: {}){

    const [totalSupply, setTotalSupply] = useState<string|undefined>(undefined);
    const [isWorking, setIsWorking] = useState<boolean>(false);

    // Call the hook at the component level
    // React hooks (including Wagmi’s generated hooks) must run at the top level of a function component
    // (or inside a custom hook) — never inside handleClick,
    // inside handleClick use 'refetch' function
    const { data, refetch } = useReadBillsOfExchangeTotalSupply({
        query: {
            enabled: false, //
            // enabled: true, // runs if args changed
        }
    });

    const updateTotalSupply = async () => {
        setIsWorking(true);
        try {
            const { data: raw } = await refetch();
            const formatted = formatUnits(raw as bigint, /* token decimals, e.g. */ decimals);
            setTotalSupply(formatted);
        } catch (error) {
            console.error(error);
        }
        finally {
            setIsWorking(false);
        }
    };

    useEffect(() => {
        updateTotalSupply();
    }, []);

    const handleClick = async (event: React.FormEvent) => {
        event.preventDefault();
        updateTotalSupply();
    }

    return (

        <div className="totalSupplay">

            <h3>{"Total supply:"}</h3>
            {totalSupply?totalSupply:"no data"}
            {totalSupply?<FontAwesomeIcon icon={currencySymbolSVG} />:null}
            <button className="button button--secondary button--block"
                    onClick={handleClick}
                    disabled={isWorking}
                    title={"Get/update info"}
            >
                {isWorking ? <FontAwesomeIcon icon={faCircleNotch} spin /> : "Get/refresh"}
            </button>
        </div>
    );

}