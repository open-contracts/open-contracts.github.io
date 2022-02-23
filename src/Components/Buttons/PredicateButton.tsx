import React, {FC, ReactElement, useRef, useState} from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';
import {AthenaButton, AthenaButtonProps} from "./AthenaButton";
import {generate} from "shortid";
import {motion} from "framer-motion";

export type PredicateButtonProps = AthenaButtonProps & {
    Warning : React.ReactNode
};

export const PredicateButton : FC<PredicateButtonProps>  = (props) =>{

    const [warningPopup, setWarningPopup] = useState(false);

    const _action = async ()=>{
        setWarningPopup(false);
        if(props.disabled) return setWarningPopup(true);
        props.action && await props.action();
    }

    const _onClick = (e  : React.MouseEvent)=>{
        setWarningPopup(false);
        if(props.disabled) return setWarningPopup(true); 
        props.onClick && props.onClick(e);
    }

    const target = useRef(null);

    return (
        <div>
            <motion.div
            transition={{ duration : .4 }}
            animate={warningPopup && {
                x : [0, 4, -4, 4, -4, 4, -4, 0]
            }}>
                <AthenaButton 
                {...props} action={_action} onClick={_onClick} disabled={false}>
                    <div ref={target}>
                        {props.children}
                    </div>
                </AthenaButton>
            </motion.div>
            <Overlay target={target.current} show={warningPopup} placement="left">
                {(innerProps)=>(
                    <Tooltip id={generate()} {...innerProps}>
                        {props.Warning}
                    </Tooltip>
                )}
            </Overlay>
        </div>

    )

}