import React, {useState} from "react";
import {type Address, formatUnits} from "viem";
import {useAccount} from 'wagmi';
import {useReadBillsOfExchangeBalanceOf} from "@site/src/generated";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleNotch, faShekelSign} from '@fortawesome/free-solid-svg-icons';
import EthAddress from "@site/src/components/wagmi/EthAddress";

const currencySymbol = faShekelSign;

export default function YourBalanceBoF(){

    const {address} = useAccount();

    const [isWorking, setIsWorking] = useState<boolean>(false);

    // Call the hook at the component level
    // React hooks (including Wagmi’s generated hooks) must run at the top level of a function component
    // (or inside a custom hook) — never inside handleClick
    const { data, refetch } = useReadBillsOfExchangeBalanceOf({
        args: [address as Address],
        query: {
            enabled: true, // Run automatically on mount
        }
    });

    const handleClick = async (event: React.FormEvent)=>{
        event.preventDefault();
        setIsWorking(true);
        try {
            await refetch();
        } catch (error) {
            console.error(error);
        } finally {
            setIsWorking(false);
        }
    }

    return (
        <div className="card">
            <div className="card__header">
                <h3>Your balance</h3>

            </div>
            <div className="card__body">

                <div>
                    {address ?
                        <EthAddress ethAddress={address}/>
                        :null
                    }
                </div>

                <div>
                    {/* === Show Balance */}
                    <b>{data?formatUnits(data as bigint, /* token decimals, e.g. */ 18) : 'no data'}</b>
                    {" "}
                    {data?<FontAwesomeIcon icon={currencySymbol} />:null}
                </div>

            </div>

            <div className="card__footer">
                <button className="button button--secondary button--block"
                        onClick={handleClick}
                        disabled={isWorking}
                        title={"Refresh"}
                >
                    {isWorking ? <FontAwesomeIcon icon={faCircleNotch} spin /> : "Refresh"}
                </button>
            </div>

        </div>
    )
}
