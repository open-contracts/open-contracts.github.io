import React, {FC, ReactElement} from 'react';
import { DappResultputI } from '../DappPutType';
import { DappPutLayout } from '../DappPutLayout';
import {Colors} from "../../../Theme/Colors";
import { DappResultputHeader } from './DappResultputHeader';
import { DappResultputContent } from './DappResultputContent';
import { darkenStandard } from '../Methods';

export type DappPutResultputProps = {
    style ? : React.CSSProperties
    dappResultput : DappResultputI,
    setResultput ? : (Resultput : DappResultputI)=>void,
}

export const DappResultput : FC<DappPutResultputProps>  = ({
    dappResultput,
    style,
    setResultput
}) =>{

    return (

        <DappPutLayout style={{
            borderTop : "none",
            background : Colors.arizonaOrange,
            border : `1px solid ${darkenStandard(Colors.greenCeramic)}`,
            color : Colors.primaryTextColor,
            ...style
        }}>
            <DappPutLayout.Header>
                <DappResultputHeader dappResultput={dappResultput} />
            </DappPutLayout.Header>
            <DappPutLayout.Content>
                <DappResultputContent setResultput={setResultput} dappResultput={dappResultput}/>
            </DappPutLayout.Content>
        </DappPutLayout>

    )

}