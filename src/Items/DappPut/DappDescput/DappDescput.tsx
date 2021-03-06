import React, {FC, ReactElement} from 'react';
import { DappDescputI } from '../DappPutType';
import { DappPutLayout } from '../DappPutLayout';
import {Colors} from "../../../Theme/Colors";
import { DappDescputHeader } from './DappDescputHeader';
import { DappDescputContent } from './DappDescputContent';
import { reduceContractFunctionI } from '../../DappFunction/StateMethods';

export type DappPutDescputProps = {
    style ? : React.CSSProperties
    dappDescput : DappDescputI
    contractFunction : OpenContractFunctionI,
    reduceContractFunction ? : (contractFunction : reduceContractFunctionI)=>void
}

export const DappDescput : FC<DappPutDescputProps>  = ({
    dappDescput,
    style
}) =>{

    return (

        <DappPutLayout style={{
            background : "white",
            userSelect : "text",
            ...style
        }}>
            <DappPutLayout.Header>
                <DappDescputHeader dappDescput={dappDescput}/>
            </DappPutLayout.Header>
            <DappPutLayout.Content>
                <DappDescputContent dappDescput={dappDescput}/>
            </DappPutLayout.Content>
        </DappPutLayout>

    )

}