import React, {FC, ReactElement} from 'react';
import { Colors } from '../../../Theme';
import { DappResultputI } from '../DappPutType';
import {DefaultHeader} from "../Standards";

export type DappResultputHeaderProps = {
    style ? : React.CSSProperties
    dappResultput : DappResultputI,
}

export const DappResultputHeader : FC<DappResultputHeaderProps>  = ({
    dappResultput,
    style
}) =>{

    return (

        <DefaultHeader dappPut={{} as DappResultputI} style={{
            color : Colors.babyBlue,
            ...style
        }}>
            <DefaultHeader.Pre>
                𝑦      
            </DefaultHeader.Pre>
        </DefaultHeader>

    )

}