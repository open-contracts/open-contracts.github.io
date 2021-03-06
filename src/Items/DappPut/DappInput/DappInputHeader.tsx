import React, {FC, ReactElement} from 'react';
import { Colors } from '../../../Theme';
import { DappInputI } from '../DappPutType';
import {DefaultHeader} from "../Standards";

export type DappInputHeaderProps = {
    style ? : React.CSSProperties
    dappInput : DappInputI,
}

export const DappInputHeader : FC<DappInputHeaderProps>  = ({
    dappInput,
    style
}) =>{

    return (

        <DefaultHeader dappPut={dappInput} style={{
            color : Colors.babyBlue,
            ...style
        }}>
            <DefaultHeader.Post>
                &emsp;<i style={{
                    color : Colors.secondaryTextColor
                }}>{dappInput.type}</i>
            </DefaultHeader.Post>
        </DefaultHeader>

    )

}