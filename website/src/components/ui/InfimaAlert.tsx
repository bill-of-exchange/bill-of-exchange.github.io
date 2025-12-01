import React, {MouseEventHandler} from "react";
import clsx from "clsx";

export type AlertType = "alert--primary"| "alert--secondary"|"alert--success"|"alert--info"|"alert--warning"|"alert--danger";

type InfimaAlertProps = {
    alertType: AlertType,
    closeFunction?: MouseEventHandler<HTMLButtonElement>,
    alertMessage?: string,
};

export default function InfimaAlert(props: InfimaAlertProps) {
    return (
        <div className={clsx("alert", props.alertType)} role="alert">

            {props.closeFunction?
                <button aria-label="Close" className="clean-btn close" type="button" onClick={props.closeFunction}>
                    <span aria-hidden="true">&times;</span>
                </button>:null
            }

            {props.alertMessage?props.alertMessage:null}

        </div>
    )
}